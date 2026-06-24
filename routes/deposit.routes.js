const express = require('express');
const depositController = require('../controllers/deposit.controller');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// routes
router.post('/create',authenticate, depositController.createDeposit);
router.post('/list', authenticate, depositController.getDepositsByUser);

module.exports = router;