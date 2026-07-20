const User = require('../models/authModel');
const ForexTradeModel = require('../models/forexTrade.model');
const dashboardData = require('./dashboardData');

class ForexTradeService {
  async createForexTrade(data) {
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

    const trade = await ForexTradeModel.create({
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

  async getForexTradesByUser(email) {
    if (!email) {
      const err = new Error('email is required');
      err.statusCode = 400;
      throw err;
    }
    return ForexTradeModel.findByUserEmail(email);
  }
}

module.exports = new ForexTradeService();