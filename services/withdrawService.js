const admin = require('../config/firebase/firebase');
const db = admin.firestore();

class WithdrawService {

  async WithDrawADDFunds(email, withdrawAmount, walletAddress) {
    try {

      const snap = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snap.empty) {
        throw new Error('User not found');
      }

      const userDoc = snap.docs[0];

      const withdrawRecord = {
        userEmail: email,
        withdrawAmount: Number(withdrawAmount),
        walletAddress: walletAddress,
        createdAt: admin.firestore.Timestamp.now()
      };

      await userDoc.ref.update({
        withdrawals: admin.firestore.FieldValue.arrayUnion(withdrawRecord)
      });

      return withdrawRecord;

    } catch (err) {
      throw err;
    }

  }

}

module.exports = new WithdrawService();