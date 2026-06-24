const { createDeposit , getDepositsByUser } = require('../services/deposit.service');

class DepositController {
  async createDeposit(req, res, next) {
    try {
      const result = await createDeposit(req.body);
      res.status(201).json({
        success: true,
        message: 'Deposit created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
 async getDepositsByUser(req, res, next) {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: 'userEmail is required' });
    }
    const data = await getDepositsByUser(email.trim());
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
}

module.exports = new DepositController();