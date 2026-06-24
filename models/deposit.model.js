const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const usersCollection = db.collection('users');
const depositCollection = db.collection('deposit-history');

class DepositModel {
  static async userExistsByEmail(email) {
    const snap = await usersCollection.where('email', '==', email).limit(1).get();
    return !snap.empty;
  }

  static async create(data) {
    const docRef = await depositCollection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

static async findByUserEmail(email) {
  const snap = await depositCollection
    .where('email', '==', email)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null
    };
  });
}

}

module.exports = DepositModel;