const crypto = require('crypto');
const admin = require('../config/firebase/firebase');
const User = require('../models/authModel');

const usersCollection = admin.firestore().collection('users');
const CODE_TTL_MS = 15 * 60 * 1000;

class ActivationCodeService {
  async generateActivationCode(email) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User not found');

    const code = String(crypto.randomInt(100000, 1000000));
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + CODE_TTL_MS)
    );

    await usersCollection.doc(user.id).update({
      activationCode: code,
      activationCodeExpiresAt: expiresAt,
      emailVerified: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return code;
  }
  
   async verifyActivationCode(email, code) {
    const user = await User.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    if (user.emailVerified) {
      const err = new Error('Email already verified');
      err.statusCode = 400;
      throw err;
    }
    if (!user.activationCode) {
      const err = new Error('No verification code pending');
      err.statusCode = 400;
      throw err;
    }
    if (String(user.activationCode) !== String(code)) {
      const err = new Error('Invalid verification code');
      err.statusCode = 400;
      throw err;
    }
    if (user.activationCodeExpiresAt) {
      const expiresAt = user.activationCodeExpiresAt.toDate
        ? user.activationCodeExpiresAt.toDate()
        : new Date(user.activationCodeExpiresAt.seconds * 1000);
      if (expiresAt < new Date()) {
        const err = new Error('Verification code has expired');
        err.statusCode = 400;
        throw err;
      }
    }
  
    await usersCollection.doc(user.id).update({
      emailVerified: true,
      activationCode: admin.firestore.FieldValue.delete(),
      activationCodeExpiresAt: admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  
    return {
      id: user.id,
      email: user.email,
      emailVerified: true,
    };
  }
}

module.exports = new ActivationCodeService();