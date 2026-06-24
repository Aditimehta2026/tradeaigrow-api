const { createWithdraw, getWithdrawsByUser } = require('../services/withdraw.service');
const { sendMail } = require('../services/mail.service');
const { withdrawRequestTemplate } = require('../templates/withdrawRequest.template');

class WithdrawController {
  async createWithdraw(req, res, next) {
    try {
      const { email, withdrawAmount, walletAddress } = req.body;
      // 1) Save to DB first
      const result = await createWithdraw(req.body);
      // 2) Only after success, send email
      try {
        await sendMail({
          to: 'mythiligoud94451@gmail.com',
          subject: 'New Withdraw Request',
          html: withdrawRequestTemplate({ email, withdrawAmount, walletAddress })
        });
      } catch (mailError) {
        console.error('Withdraw request email failed:', mailError);
      }

      // 3) Return success
      res.status(201).json({
        success: true,
        message: 'Withdraw created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getWithdrawsByUser(req, res, next) {
    try {
      const { email } = req.body;
      if (!email?.trim()) {
        return res.status(400).json({ success: false, message: 'email is required' });
      }
      const data = await getWithdrawsByUser(email.trim());
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WithdrawController();