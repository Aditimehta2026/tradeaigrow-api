const authService = require('../services/authService');
const { sendMail } = require('../services/mail.service');
const { welcomeTemplate } = require('../templates/welcome.template');
const ActivationCodeService = require('../services/activationCode.service');
const { passwordResetTemplate } = require('../templates/passwordReset.template');

class AuthController {
  async register(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.register(email);
       const code = await ActivationCodeService.generateActivationCode(email);
      // call email service here (after successful register)
      try {
        await sendMail({
          to: email,
          subject: 'Welcome!',
          html: welcomeTemplate(code)
        });
      } catch (mailError) {
        // do not block registration if email fails
        console.error('Welcome email failed:', mailError);
      }
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  async verifyActivationCode(req, res, next) {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: 'email and code are required',
        });
      }
      const result = await authService.verifyActivationCode(email, code);
      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   async createPassword(req, res, next) {
    try {
      const { email, password , username} = req.body;
      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          message: 'email, password and username are required',
        });
      }
      const result = await authService.createPassword(email, password ,username);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);

      try {
        await sendMail({
          to: email,
          subject: 'Password Reset Link',
          html: passwordResetTemplate(result.token,email)
        });
      } catch (mailError) {
        console.error('Password reset link email failed:', mailError);
      }

      return res.status(200).json({
        success: true,
        message: 'Password reset link sent successfully to your email inbox',
        data: { expiresAt: result.expiresAt }
      });
    } catch (error) {
      next(error);
    }
  }
 async resetPassword(req, res, next) {
    try {
      const { email, password, token } = req.body;
      const result = await authService.resetPassword(email, password, token);
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();