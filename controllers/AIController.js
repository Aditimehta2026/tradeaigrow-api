const AIService = require('../services/AIService');
const admin = require('../config/firebase/firebase');

class AIController {
  async updateBalanceAiTrade(req, res, next) {
     try {
      await AIService.updateUserBalanceinAiTrade(req.body);
       res.status(201).json({
         success: true,
         message: 'Your AI trade has been completed successfully. The result has been reflected in your account balance, and you can view full details in your AI trade history.',
       });
     } catch (error) {
       next(error);
     }
   }
  async getUserAITradeHistory(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AIService.userAITradeHistory(email);
      res.status(200).json({
        success: true,
        message: 'User AI trade history retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AIController();