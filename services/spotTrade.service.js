const User = require('../models/authModel');
const SpotTradeModel = require('../models/spotTrade.model');
const dashboardData = require('./dashboardData');

class SpotTradeService {
  async createSpotTrade(data) {
    const email = data.email;
    if (!email) {
      const err = new Error('userEmail is required');
      err.statusCode = 400;
      throw err;
    }
    
    const user = await User.findByEmail(data.email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

     const trade = await SpotTradeModel.create({
      email: email,
      coinname: data.coinname,
      balance: data.balance,
      todayPnl: data.todayPnl,
      todayGain: data.todayGain,
      timing: data.timing,
      direction: data.direction,
      date: data.date
    });
    await dashboardData.updateUserData(
      email,
      data.balance,
      data.todayPnl,
      data.todayGain
    );
    return trade;
  }

  async getSpotTradesByUser(email) {
    if (!email) {
      const err = new Error('email is required');
      err.statusCode = 400;
      throw err;
    }
    return SpotTradeModel.findByUserEmail(email);
  }
}

module.exports = new SpotTradeService();