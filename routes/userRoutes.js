const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loanController = require('../controllers/loanController');

const multer = require('multer');
const { apiRateLimiter } = require('../middleware/apiRateLimiter');
const upload = multer({ storage: multer.memoryStorage() });
const withdrawController = require('../controllers/withdrawController');
const { authenticate } = require('../middleware/auth');

// Private routes
router.post('/dashboard',authenticate, userController.dashboard);
router.put('/update-user-data',authenticate ,userController.updateUserData);
router.post('/trade/history',authenticate, userController.tradeHistory);
router.post('/add/loan',authenticate, upload.single('file'), apiRateLimiter(), loanController.addLoan);
router.post('/withdraw/funds',authenticate, apiRateLimiter(), withdrawController.WithDrawFunds);
module.exports = router;