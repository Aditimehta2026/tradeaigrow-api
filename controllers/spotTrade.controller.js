const { createSpotTrade, getSpotTradesByUser } = require('../services/spotTrade.service');

class SpotTradeController {

    //  Create Trade
    async createSpotTrade(req, res, next) {
        try {
            let { email } = req.body;

            if (!email?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'email is required'
                });
            }
            const result = await createSpotTrade({
                ...req.body
            });

            res.status(201).json({
                success: true,
                message: 'Spot trade created successfully',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    //  Get Trades by Email
    async getSpotTradesByUser(req, res, next) {
        try {
            let { email } = req.body;

            if (!email?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'email is required'
                });
            }
            const data = await getSpotTradesByUser(email);

            res.status(200).json({
                success: true,
                message: 'Spot trades retrieved successfully',
                data: data
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SpotTradeController();
