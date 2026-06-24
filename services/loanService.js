const admin = require('../config/firebase/firebase');
const db = admin.firestore();
const cloudinary = require('../config/cloudinary/cloudinary');

class LoanService {
  async addLoan(email, loanData, file) {
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

      // 1) Upload file to Cloudinary (if present)
      let fileUrl = null;
      let filePublicId = null;

       if (file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'loan-documents' },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          uploadStream.end(file.buffer);
        });

        fileUrl = result.secure_url;
        filePublicId = result.public_id;
      }

      // 2) Build Firestore record
      const loanRecord = {
        loanAmount: loanData.loanAmount,
        loanTerm: loanData.loanTerm,
        calculatedInterest: loanData.calculatedInterest,
        fileUrl: fileUrl,
        filePublicId: filePublicId,
        createdAt: admin.firestore.Timestamp.now()
      };

      // 3) Store loan in user document
      await userDoc.ref.update({
        loans: admin.firestore.FieldValue.arrayUnion(loanRecord)
      });

      return loanRecord;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new LoanService();