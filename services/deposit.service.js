const DepositModel = require('../models/deposit.model');

const createDeposit = async (payload) => {
  const email = payload.email?.trim();
  if (!email) throw Object.assign(new Error('userEmail is required'), { statusCode: 400 });

  const ok = await DepositModel.userExistsByEmail(email);
  if (!ok) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return DepositModel.create(payload);
};

const getDepositsByUser = async (email) => {
  return DepositModel.findByUserEmail(email);
};

module.exports = { createDeposit ,getDepositsByUser };