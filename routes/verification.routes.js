const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');
const { authenticate } = require('../middleware/auth');

const multer = require('multer');
const { apiRateLimiter } = require('../middleware/apiRateLimiter');
const upload = multer({ storage: multer.memoryStorage() });

// Private routes
router.post('/add-identity', authenticate, upload.single('file'), apiRateLimiter(), verificationController.addVerification);
router.post('/get-history', authenticate, verificationController.getVerificationHistory);

module.exports = router;