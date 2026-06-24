const express = require('express');
const router = express.Router();
const spotTradeController = require('../controllers/spotTrade.controller');
const { authenticate } = require('../middleware/auth');

//  Create new trade
router.post('/create', authenticate,spotTradeController.createSpotTrade);

// Get all trades by email
router.post('/list',authenticate, spotTradeController.getSpotTradesByUser);

module.exports = router;