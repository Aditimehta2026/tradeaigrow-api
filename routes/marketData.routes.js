const express = require('express');
const router = express.Router();
const marketDataController = require('../controllers/marketData.controller');
const { authenticate } = require('../middleware/auth');

// Private routes
router.get('/type', authenticate, marketDataController.getMarketData);

module.exports = router;