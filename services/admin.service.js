const UserModel = require('../models/user.model');

const getAllUsers = async () => {
  return UserModel.findAll();
};

module.exports = { getAllUsers };