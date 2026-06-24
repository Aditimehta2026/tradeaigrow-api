const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const spotTradeCollection = db.collection('spot-trade-history');

class SpotTradeModel {
  static async create(data) {
    const docRef = await spotTradeCollection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  static async findByUserEmail(email) {
    const snap = await spotTradeCollection
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

module.exports = SpotTradeModel;