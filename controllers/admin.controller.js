const { getAllUsers } = require('../services/admin.service');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const data = await getAllUsers();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();