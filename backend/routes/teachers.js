const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { body, validationResult } = require('express-validator');

// Middleware xử lý lỗi validation
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

// Teacher routes
router.post('/login', [
  body().custom((value) => {
    if (!value?.teacherId && !value?.username) {
      throw new Error('Vui lòng nhập mã giáo viên hoặc tài khoản');
    }
    return true;
  }),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  validate
], teacherController.login);

router.get('/:teacherId/timetable', teacherController.getTimetable);

module.exports = router;
