const AIModel = require('../models/AIModel');

class AIService {
  async updateUserBalanceinAiTrade(data) {
    const updatedUser = await AIModel.updateBalanceAndAiTrade(data);
    return updatedUser;
  }
  async userAITradeHistory(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    return AIModel.userAITradeHistory(email);
  }
}

module.exports = new AIService();