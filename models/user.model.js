const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const usersCollection = db.collection('users');

const EXCLUDED_FIELDS = [
  'password',
  'resetToken',
  'resetTokenExpiresAt',
  'activationCode',
  'activationCodeExpiresAt',
  'createdAt',
  'updatedAt',
  'lastLogin',
  'holdings'
];

class UserModel {
  static async findAll() {
    const snapshot = await usersCollection.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      EXCLUDED_FIELDS.forEach((field) => delete data[field]);
      return data;
    });
  }
}

module.exports = UserModel;