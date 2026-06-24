const admin = require('../config/firebase/firebase');
const db = admin.firestore();
const dashboardDataCollection = db.collection('users');

class DashboardData {
  async getDashboardData(email) {
    try {
      // Get user data using email
      const snap = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snap.empty) {
        throw new Error('User not found');
      }

      const userData = snap.docs[0].data();
      return userData;

    } catch (err) {
      throw err;
    }
  }

  async updateUserData(email, balance, todayPnl, todayGain, tradeHistory) {
    try {
      // Find user by email
      const snap = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snap.empty) {
        throw new Error('User not found');
      }

      const userDoc = snap.docs[0];
      
      // Prepare update data
      const updateData = {
        balance,
        todayPnl,
        todayGain,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // If trade history is provided, add it to the history array
      if (tradeHistory) {
        const tradeRecord = {
          coinname: tradeHistory.coinname,
          balance: tradeHistory.balance,
          todayPnl: tradeHistory.todayPnl,
          todayGain: tradeHistory.todayGain,
          timing: tradeHistory.timing,
          direction: tradeHistory.direction,
          date: tradeHistory.date,
          createdAt: tradeHistory.createdAt
        };

        // Add to tradeHistory array using arrayUnion
        updateData.tradeHistory = admin.firestore.FieldValue.arrayUnion(tradeRecord);
      }

      // Update user data
      await userDoc.ref.update(updateData);

      // Return updated user data
      const updatedDoc = await userDoc.ref.get();
      return updatedDoc.data();

    } catch (err) {
      throw err;
    }
  }

  async getTradeHistory(email) {
    try {
      // Find user by email
      const snap = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snap.empty) {
        throw new Error('User not found');
      }

      const userData = snap.docs[0].data();
      
      // Return trade history array (or empty array if not exists)
      return userData.tradeHistory || [];

    } catch (err) {
      throw err;
    }
  }
}

module.exports = new DashboardData();