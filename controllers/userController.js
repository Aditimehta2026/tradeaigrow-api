const DashboardData = require('../services/dashboardData');

class UserController {
  async dashboard(req, res, next) {
    try {

      const email = req.body.email;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const dashboardData = await DashboardData.getDashboardData(email);
      
      res.status(200).json({
        success: true,
        message: 'User dashboard retrieved successfully',
        dashboardData: dashboardData
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserData(req, res, next) {
    try {
      const { 
        email, 
        balance, 
        todayPnl, 
        todayGain,
        coinname,
        timing,
        direction,
        date,
        createdAt
      } = req.body;
      
      // Prepare trade history object if trade data is provided
      let tradeHistory = null;
      if (coinname) {
        tradeHistory = {
          coinname,
          balance,
          todayPnl,
          todayGain,
          timing,
          direction,
          date,
          createdAt
        };
      }
      
      const updatedUserData = await DashboardData.updateUserData(
        email, 
        balance, 
        todayPnl, 
        todayGain,
        tradeHistory
      );
      
      res.status(200).json({
        success: true,
        message: 'User data updated successfully',
        userData: updatedUserData
      });
    } catch (error) {
      next(error);
    }
  }

  async tradeHistory(req, res, next) {
    try {
      const email = req.body.email;
      
      const history = await DashboardData.getTradeHistory(email);
      
      res.status(200).json({
        success: true,
        message: 'Trade history retrieved successfully',
        tradeHistory: history
      });
    } catch (error) {
      next(error);
    }
  } 
}

module.exports = new UserController();