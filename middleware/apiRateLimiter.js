const admin = require("firebase-admin");
const db = admin.firestore();

function apiRateLimiter() {
  return async (req, res, next) => {
    try {
      
      const email = req.body?.email?.trim?.();
      if (!email) {
        return res.status(401).json({ message: "Unauthenticated" });
      }
      // Firestore doc IDs can't contain '/', so normalize route
      const pathSegment = (req.route && req.route.path) ? req.route.path : (req.path && req.path.slice(1));
      const route = pathSegment ? pathSegment.replace(/\//g, '_') : 'default';
      const docId = `${email}_${route}`;
      const ref = db.collection("apiCooldowns").doc(docId);
      const now = Date.now();
      const limit = 24 * 60 * 60 * 1000;

      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists) {
          const data = snap.data();
          const lastHitAt = data.lastHitAt?.toMillis ? data.lastHitAt.toMillis() : data.lastHitAt;
          if (now - lastHitAt < limit) {
            throw new Error("COOLDOWN");
          }
        }
        tx.set(ref, {
          lastHitAt: admin.firestore.Timestamp.fromMillis(now),
        });
      });
      next();
    } catch (err) {
      if (err.message === "COOLDOWN") {
        return res.status(429).json({
          message: "Today's usage limit has been reached. Please try again tomorrow.",
        });
      }
      next(err);
    }
  };
}

module.exports = { apiRateLimiter };