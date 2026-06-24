const WithdrawService = require('../services/withdrawService');

class WithDrawController {

    async WithDrawFunds(req, res, next) {
        try {
            const { email, withdrawAmount, walletAddress } = req.body;

            if (!email || withdrawAmount == null || !walletAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, withdraw amount, and wallet address are required'
                });
            }

            const savedWithdraw = await WithdrawService.WithDrawADDFunds(
                email,
                withdrawAmount,
                walletAddress
            );

            return res.status(201).json({
                success: true,
                message: 'Withdrawal successful',
                withdraw: savedWithdraw
            });

        } catch (error) {
            next(error);
        }
    }

}

module.exports = new WithDrawController();