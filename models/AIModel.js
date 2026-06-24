const admin = require('../config/firebase/firebase');
const db = admin.firestore();
const usersCollection = db.collection('users');
const aiTradesCollection = db.collection('ai-trade-history');

class AIModel {
  static async updateBalanceAndAiTrade(AITradeResult) {
    const user = await usersCollection.where('email', '==', AITradeResult.email).get();
    if (user.empty) {
      throw new Error('User not found');
    }

    const userDoc = user.docs[0];
    const userRef = usersCollection.doc(userDoc.id);

    const AITradeDurationProcessDays = (data) => {
      const days = Number(data);
      if (!Number.isInteger(days) || days <= 0) {
        throw new Error('numberOfDaysOfAITrade must be a positive integer');
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + days);
      return endDate;
    };

    const endDate = AITradeDurationProcessDays(AITradeResult.numberOfDaysOfAITrade);

    await db.runTransaction(async (transaction) => {
      transaction.update(userRef, {
        balance: AITradeResult.balanceAfterAITrade,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const tradeRef = aiTradesCollection.doc();
      transaction.set(tradeRef, {
        email: AITradeResult.email,
        tradeDuration: AITradeResult.tradeDuration, // e.g., "5 Days AI Trade"
        durationInDays: AITradeResult.numberOfDaysOfAITrade, // number
        amount: AITradeResult.investedAmount,
        oldBalance: AITradeResult.balanceBeforeAITrade,
        newBalance: AITradeResult.balanceAfterAITrade,
        dailyROI: AITradeResult.dailyAIROI,
        status: "running",
        tradeEndDate: endDate,
        totalProfit: AITradeResult.strategyProfit,
        finalAmount: AITradeResult.projectedPayout,
        tradeCreatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    const updatedUser = await userRef.get();
    return { id: updatedUser.id, ...updatedUser.data() };
  }

  static async userAITradeHistory(email) {
    const snap = await aiTradesCollection
      .where('email', '==', email)
      .orderBy('tradeCreatedAt', 'desc')
      .get();

    return snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        tradeEndDate: data.tradeEndDate?.toDate
          ? data.tradeEndDate.toDate().toISOString()
          : null,
        tradeCreatedAt: data.tradeCreatedAt?.toDate
          ? data.tradeCreatedAt.toDate().toISOString()
          : null
      };
    });
  }
}

module.exports = AIModel;