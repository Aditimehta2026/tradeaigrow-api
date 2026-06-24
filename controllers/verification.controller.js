const VerificationService = require('../services/verification.service');

class VerificationController {

    async addVerification(req, res, next) {
        try {
            const { email, documentType, documentNumber } = req.body;
            const file = req.file;

            if (!email || !documentType || !documentNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'email, documentType and documentNumber are required'
                });
            }

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'ID document file is required'
                });
            }

            const verificationData = {
                documentType,
                documentNumber
            };

            const saved = await VerificationService.addVerification(email, verificationData, file);

            return res.status(201).json({
                success: true,
                message: 'Identity verified successfully. Pending review.',
                status: 'pending',
                verification: saved
            });
        } catch (error) {
            next(error);
        }
    }
    async getVerificationHistory(req, res, next) {
        try {
            const { email } = req.body;
            const verificationHistory = await VerificationService.getVerificationHistory(email);
            return res.status(200).json({
                success: true,
                verificationHistory: verificationHistory
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VerificationController();