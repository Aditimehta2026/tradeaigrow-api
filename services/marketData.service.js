const axios = require("axios");
const admin = require("../config/firebase/firebase");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });
const db = admin.firestore();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const WAIT_ATTEMPTS = 10;
const WAIT_INTERVAL_MS = 1000;

const MARKET_API = {
  crypto: {
    url: "https://api.coingecko.com/api/v3/coins/markets",
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: "10",
      page: "1",
      sparkline: "true",
    },
  },
  forex: {
    symbols: [
      { symbol: "EURUSD=X", name: "EUR/USD", flags: ["eu", "us"] },
      { symbol: "GBPUSD=X", name: "GBP/USD", flags: ["gb", "us"] },
      { symbol: "JPY=X", name: "USD/JPY", flags: ["us", "jp"] },
      { symbol: "CHF=X", name: "USD/CHF", flags: ["us", "ch"] },
      { symbol: "AUDUSD=X", name: "AUD/USD", flags: ["au", "us"] },
      { symbol: "CAD=X", name: "USD/CAD", flags: ["us", "ca"] },
      { symbol: "NZDUSD=X", name: "NZD/USD", flags: ["nz", "us"] },
      { symbol: "EURGBP=X", name: "EUR/GBP", flags: ["eu", "gb"] },
    ],
  },
  commodities: {
    symbols: [
      { symbol: "GC=F", name: "Gold" },
      { symbol: "SI=F", name: "Silver" },
      { symbol: "CL=F", name: "Crude Oil WTI" },
      { symbol: "BZ=F", name: "Brent Crude" },
      { symbol: "NG=F", name: "Natural Gas" },
      { symbol: "HG=F", name: "Copper" },
      { symbol: "PL=F", name: "Platinum" },
      { symbol: "PA=F", name: "Palladium" },
    ],
  },
};

const getMarketData = async (type) => {
  if (!MARKET_API[type]) {
    const err = new Error("Invalid market type");
    err.statusCode = 400;
    throw err;
  }

  const cacheRef = db.collection("marketDataCache").doc(type);

  // 1. Fresh cache → return
  const cacheSnap = await cacheRef.get();
  if (cacheSnap.exists) {
    const cache = cacheSnap.data();
    if (Date.now() - cache.updatedAt < CACHE_DURATION) {
      return cache.response;
    }
  }

  // 2. Try lock → refresh
  const lockAcquired = await acquireLock(type);

  if (lockAcquired) {
    try {
      // Re-check cache after lock (another request may have finished)
      const freshSnap = await cacheRef.get();
      if (freshSnap.exists) {
        const fresh = freshSnap.data();
        if (Date.now() - fresh.updatedAt < CACHE_DURATION) {
          return fresh.response;
        }
      }

      let responseData;

      if (type === "forex") {
        responseData = await getYahooHistory(MARKET_API.forex.symbols);
      } else if (type === "commodities") {
        responseData = await getYahooHistory(MARKET_API.commodities.symbols);
      } else {
        const { url, params } = MARKET_API[type];
        const response = await axios.get(url, { params });
        responseData = response.data;
      }

      await cacheRef.set({
        type,
        response: responseData,
        updatedAt: Date.now(),
      });

      return responseData;
    } finally {
      await releaseLock(type);
    }
  }

  // 3. Another request is refreshing → wait for cache
  for (let i = 0; i < WAIT_ATTEMPTS; i++) {
    await sleep(WAIT_INTERVAL_MS);

    const latest = await cacheRef.get();
    if (latest.exists) {
      const data = latest.data();
      if (Date.now() - data.updatedAt < CACHE_DURATION) {
        return data.response;
      }
    }
  }

  // Optional fallback: return stale cache if present
  if (cacheSnap.exists) {
    return cacheSnap.data().response;
  }

  const err = new Error("Timeout waiting for refreshed cache");
  err.statusCode = 504;
  throw err;
};

async function getYahooHistory(symbols) {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const period1 = oneWeekAgo.toISOString().split("T")[0];
  const period2 = today.toISOString().split("T")[0];

  return Promise.all(
    symbols.map(async ({ symbol, name, flags }) => {
      const chart = await yahooFinance.chart(symbol, {
        period1,
        period2,
        interval: "1d",
      });

      const rows = (chart.quotes || [])
        .filter((r) => r.close != null || r.adjclose != null)
        .map((r) => ({
          date: r.date instanceof Date ? r.date.toISOString() : r.date,
          open: r.open,
          high: r.high,
          low: r.low,
          close: r.close ?? r.adjclose,
          volume: r.volume,
        }));

      return {
        symbol,
        name,
        flags: flags || [],
        latest: rows[rows.length - 1] || null,
        sparkline: rows.map((r) => r.close),
        history: rows,
      };
    }),
  );
}

async function acquireLock(type) {
  const lockRef = db.collection("marketDataLocks").doc(type);

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(lockRef);

      if (!snap.exists) {
        tx.set(lockRef, {
          locked: true,
          lockedAt: Date.now(),
        });
        return true;
      }

      const lock = snap.data();
      const expired = Date.now() - lock.lockedAt > LOCK_TIMEOUT;

      if (!lock.locked || expired) {
        tx.update(lockRef, {
          locked: true,
          lockedAt: Date.now(),
        });
        return true;
      }

      return false;
    });
  } catch {
    return false;
  }
}

async function releaseLock(type) {
  await db.collection("marketDataLocks").doc(type).set({
    locked: false,
    lockedAt: 0,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { getMarketData };