const admin = require('../config/firebase/firebase');
const db = admin.firestore();
const cloudinary = require('../config/cloudinary/cloudinary');

class VerificationService {
  async addVerification(email, { documentType, documentNumber }, file) {
    const snap = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snap.empty) throw new Error('User not found');

    const userId = snap.docs[0].id;

    // Upload file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'verification-documents' },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(file.buffer);
    });

    const record = {
      userId,
      email,
      documentType,
      documentNumber,
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
      status: 'pending',
      isKycVerified: false,
      createdAt: admin.firestore.Timestamp.now()
    };

    const docRef = await db.collection('identity-verification-history').add(record);

    return { id: docRef.id, ...record };
  }
  async getVerificationHistory(email) {
    const snap = await db
      .collection('identity-verification-history')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

module.exports = new VerificationService();