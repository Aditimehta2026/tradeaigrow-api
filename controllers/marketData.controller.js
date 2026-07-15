const { getMarketData } = require('../services/marketData.service');

class MarketDataController {
    async getMarketData(req, res, next) {
        try {
          const { type } = req.query; // 'crypto' | 'forex' | 'commodities'
          if (!['crypto', 'forex', 'commodities'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type' });
          }
          const data = await getMarketData(type);
          res.status(200).json({ success: true, data });
        } catch (error) {
          next(error);
        }
      }
}

module.exports = new MarketDataController();