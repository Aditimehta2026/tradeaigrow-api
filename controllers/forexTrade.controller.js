const { createForexTrade, getForexTradesByUser } = require('../services/forexTrade.service');

class ForexTradeController {
  async createForexTrade(req, res, next) {
    try {
      let { email } = req.body;

      if (!email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'email is required'
        });
      }

      const result = await createForexTrade({
        ...req.body
      });

      res.status(201).json({
        success: true,
        message: 'Forex trade created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getForexTradesByUser(req, res, next) {
    try {
      let { email } = req.body;

      if (!email?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'email is required'
        });
      }

      const data = await getForexTradesByUser(email);

      res.status(200).json({
        success: true,
        message: 'Forex trades retrieved successfully',
        data: data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ForexTradeController();