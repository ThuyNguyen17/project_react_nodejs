const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { body, validationResult } = require('express-validator');

// Middleware xử lý lỗi validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

// Login routes
router.post('/login', [
  body('username').notEmpty().withMessage('Vui lòng nhập tài khoản'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  validate
], studentController.login);

router.post('/login/code', [
  body('studentCode').notEmpty().withMessage('Vui lòng nhập mã sinh viên'),
  validate
], studentController.loginByStudentCode);

router.post('/login-new', [
  body('username').notEmpty().withMessage('Vui lòng nhập tài khoản'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  validate
], (req, res, next) => {
  console.log('=== LOGIN-NEW DEBUG ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('========================');
  next();
}, studentController.loginNew);

// Student routes
router.get('/:studentId/subjects', studentController.getStudentSubjects);
router.get('/:studentId/attendance/:assignmentId', studentController.getAttendanceDetails);
router.get('/:studentId/subjects/:assignmentId/attendance', studentController.getAttendanceDetails);
router.get('/class/:className', studentController.getStudentsByClass);

module.exports = router;
