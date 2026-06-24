const WithdrawModel = require('../models/withdraw.model');

const createWithdraw = async (payload) => {
  const email = payload.email?.trim();
  if (!email) throw Object.assign(new Error('email is required'), { statusCode: 400 });

  const ok = await WithdrawModel.userExistsByEmail(email);
  if (!ok) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return WithdrawModel.create(payload);
};

const getWithdrawsByUser = async (email) => {
  return WithdrawModel.findByUserEmail(email);
};

module.exports = { createWithdraw, getWithdrawsByUser };