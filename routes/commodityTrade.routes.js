const express = require('express');
const router = express.Router();
const commodityTradeController = require('../controllers/commodityTrade.controller');

router.post('/create', commodityTradeController.createCommodityTrade);
router.post('/list', commodityTradeController.getCommodityTradesByUser);

module.exports = router;