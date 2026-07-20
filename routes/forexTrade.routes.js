const express = require('express');
const router = express.Router();
const forexTradeController = require('../controllers/forexTrade.controller');
const { authenticate } = require('../middleware/auth');

router.post('/create', authenticate, forexTradeController.createForexTrade);
router.post('/list', authenticate, forexTradeController.getForexTradesByUser);

module.exports = router;