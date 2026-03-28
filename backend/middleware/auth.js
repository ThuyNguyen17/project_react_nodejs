const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 2. Verify JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'JWT_SECRET not configured'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || (!user.isActive && user.isActive !== undefined)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not active'
      });
    }

    // 4. Attach user info to request
    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    // 5. Attach specific role data
    if (decoded.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ teacherCode: decoded.teacherId });
      if (!teacher) {
        return res.status(401).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      req.teacher = {
        teacherId: teacher.teacherCode,
        teacherData: teacher
      };
    } else if (decoded.role === 'STUDENT') {
      const student = await Student.findById(decoded.studentId);
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Student not found'
        });
      }
      req.student = {
        studentId: student._id,
        studentCode: student.studentCode,
        studentData: student
      };
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Teacher only middleware
const requireTeacher = requireRole(['TEACHER']);

// Student only middleware
const requireStudent = requireRole(['STUDENT']);

// Teacher or Student middleware
const requireTeacherOrStudent = requireRole(['TEACHER', 'STUDENT']);

module.exports = {
  authMiddleware,
  requireRole,
  requireTeacher,
  requireStudent,
  requireTeacherOrStudent
};
