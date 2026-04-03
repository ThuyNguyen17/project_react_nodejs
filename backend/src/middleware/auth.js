// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.header('Authorization');

//     // ❌ Không có header
//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access denied. No token provided.'
//       });
//     }

//     // ❌ Sai format Bearer
//     if (!authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token format.'
//       });
//     }

//     // ✅ Lấy token
//     const token = authHeader.split(' ')[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Keep decoded payload for routes that need role-specific ids
//     // (e.g. studentId / teacherId inside JWT).
//     req.auth = decoded;

//     const userId = decoded.id || decoded.userId;
//     const user = userId ? await User.findById(userId) : null;
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found.'
//       });
//     }

//     // Attach decoded ids onto req.user in-memory so existing route code works.
//     if (decoded.studentId) req.user.studentId = decoded.studentId;
//     if (decoded.teacherId) req.user.teacherId = decoded.teacherId;
//     if (decoded.studentCode) req.user.studentCode = decoded.studentCode;
//     if (decoded.teacherCode) req.user.teacherCode = decoded.teacherCode;

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid or expired token.'
//     });
//   }
// };

// // Phân quyền
// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Insufficient permissions.'
//       });
//     }
//     next();
//   };
// };

// module.exports = { auth, authorize };