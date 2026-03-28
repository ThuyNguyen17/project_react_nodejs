const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

// Universal login for STUDENT | TEACHER | ADMIN
router.post('/login', [
  body('username').notEmpty().withMessage('Vui lòng nhập tài khoản'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  validate
], authController.login);

module.exports = router;

