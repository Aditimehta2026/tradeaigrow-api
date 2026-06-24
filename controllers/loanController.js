const LoanService = require('../services/loanService');

class LoanController {

    async addLoan(req, res, next) {
        try {
          const {
            email,
            loanAmount,
            loanTerm,
            calculatedInterest
          } = req.body;
    
          const file = req.file; // file from multer
    
          if (!email || loanAmount == null || loanTerm == null || calculatedInterest == null) {
            return res.status(400).json({
              success: false,
              message: 'email, loanAmount, loanTerm and calculatedInterest are required'
            });
          }
    
          const loanData = {
            loanAmount: Number(loanAmount),
            loanTerm: Number(loanTerm),
            calculatedInterest: Number(calculatedInterest)
          };
    
          const savedLoan = await LoanService.addLoan(email, loanData, file);
    
          return res.status(201).json({
            success: true,
            message: 'Loan added successfully',
            loan: savedLoan
          });
        } catch (error) {
          next(error);
        }
      }
    

}

module.exports = new LoanController();