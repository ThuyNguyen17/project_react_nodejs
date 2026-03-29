const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const validate = (req, res, next) => {
  console.log('=== AUTH LOGIN DEBUG ===');
  console.log('Headers:', req.headers['content-type']);
  console.log('Raw Body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

// Universal login for STUDENT | TEACHER | ADMIN
router.post('/login', async (req, res) => {
  console.log('=== AUTH LOGIN ATTEMPT ===');
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Body:', req.body);
  
  const { username, password } = req.body || {};
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu' });
  }

  return authController.login(req, res);
});

module.exports = router;

