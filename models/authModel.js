const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const usersCollection = db.collection('users');

class User {
  static async create(userData) {
    // Define defaults that should NEVER be overridden by userData
    const defaults = {
      balance: 0,
      totalDeposit: 0,
      totalWithdrawal: 0,
      todayPnl: 0,
      todayGain: 0,
      profit:"down",
      holdings: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Extract only allowed fields from userData (security: prevent field injection)
    const allowedFields = { };

    if (userData.email !== undefined) allowedFields.email = userData.email;
    if (userData.password !== undefined) allowedFields.password = userData.password;
    if (userData.name !== undefined) allowedFields.name = userData.name;
    if (userData.lastLogin !== undefined) allowedFields.lastLogin = userData.lastLogin;
  

    // Merge: defaults first, then allowed fields (defaults can't be overridden)
    const docRef = await usersCollection.add({
      ...defaults,
      ...allowedFields
    });

    const doc = await docRef.get();
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  static async findByEmail(email) {
    const user = await usersCollection.where('email', '==', email).get();
    if (user.empty) {
      return null; 
    }
    return {
      id: user.docs[0].id,
      ...user.docs[0].data()
    };
  }

  static async login(email, password) {
    const user = await usersCollection.where('email', '==', email).get();
    if (user.empty) {
      const err = new Error('Email not found');
      err.statusCode = 404;
      err.suggestion = 'No account found with this email. Please check the email or create a new account.';
      throw err;
    }
    
  
    const userData = user.docs[0].data();
    
      if (userData.password !== password) {
      const err = new Error('Invalid password');
      err.statusCode = 401;
      err.suggestion = 'The password you entered is incorrect. Try again or reset your password.';
      throw err;
    }
  
    if (userData.isVerified === false) {
      const err = new Error('User not verified.');
      err.statusCode = 400;
      err.suggestion = 'Please contact the support team for assistance with account verification.';
      throw err;
    }
  
   
  
    return {
      email: userData.email
    };
  }
  static async updateLastLogin(email) {
    const userQuery = await usersCollection.where('email', '==', email).get();
    if (userQuery.empty) {
      throw new Error('User not found');
    }
    
    const userDoc = userQuery.docs[0];
    await userDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return userDoc.ref.get();
  }

   static async updatePassword(email, newPassword, username) {
    const userQuery = await usersCollection.where('email', '==', email).get();
    if (userQuery.empty) {
      throw new Error('User not found');
    }

    const userDoc = userQuery.docs[0];
    await userDoc.ref.update({
      password: newPassword,
      username: username,
      isVerified: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updatedDoc = await userDoc.ref.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
  }
   static async setResetToken(id, token, expiresAt) {
    await usersCollection.doc(id).update({
      resetToken: token,
      resetTokenExpiresAt: admin.firestore.Timestamp.fromDate(new Date(expiresAt))
    });
  }
  static async getResetToken(token) {
    const userQuery = await usersCollection.where('resetToken', '==', token).limit(1).get();
    if (userQuery.empty) return null;
    const doc = userQuery.docs[0];
    const data = doc.data();
    // expiry check
    const expiresAtMs = data.resetTokenExpiresAt?.toDate?.().getTime?.() || 0;
    if (!expiresAtMs || Date.now() > expiresAtMs) return null;
    return {
      id: doc.id,
      email: data.email,
      resetTokenExpiresAt: data.resetTokenExpiresAt
    };
  }
  static async clearResetToken(id) {
    await usersCollection.doc(id).update({
      resetToken: admin.firestore.FieldValue.delete(),
      resetTokenExpiresAt: admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

module.exports = User;