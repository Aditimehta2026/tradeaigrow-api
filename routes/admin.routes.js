const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, adminOnly } = require('../middleware/auth');

router.post('/users', authenticate, adminOnly, adminController.getAllUsers);

module.exports = router;