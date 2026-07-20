const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const forexTradeCollection = db.collection('forex-trade-history');

class ForexTradeModel {
  static async create(data) {
    const docRef = await forexTradeCollection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  static async findByUserEmail(email) {
    const snap = await forexTradeCollection
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

module.exports = ForexTradeModel;