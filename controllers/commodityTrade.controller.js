const { createCommodityTrade, getCommodityTradesByUser } = require('../services/commodityTrade.service');

class CommodityTradeController {
  async createCommodityTrade(req, res, next) {
    try {
      let { email } = req.body;

      if (!email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'userEmail is required'
        });
      }

      const result = await createCommodityTrade({ ...req.body });

      res.status(201).json({
        success: true,
        message: 'Commodity trade created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getCommodityTradesByUser(req, res, next) {
    try {
      let { email } = req.body;

      if (!email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'userEmail is required'
        });
      }

      const data = await getCommodityTradesByUser(email);

      res.status(200).json({
        success: true,
        message: 'Commodity trades retrieved successfully',
        data: data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommodityTradeController();