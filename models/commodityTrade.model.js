const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const commodityTradeCollection = db.collection('commodity-trade-history');

class CommodityTradeModel {
  static async create(data) {
    const docRef = await commodityTradeCollection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  static async findByUserEmail(email) {
    const snap = await commodityTradeCollection
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

module.exports = CommodityTradeModel;