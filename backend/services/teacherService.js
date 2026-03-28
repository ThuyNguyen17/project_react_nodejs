const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class TeacherService {

  // ================= VERIFY PASSWORD =================
  async verifyPassword(inputPassword, storedPassword) {
    if (!storedPassword || !inputPassword) return false;

    // Support password plain text (old data)
    if (inputPassword === storedPassword) return true;

    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch {
      return false;
    }
  }

  // ================= LOGIN =================
  async login(identifier, password) {
    // 1. Tìm user trước (username = teacherCode)
    const user = await User.findOne({
      username: identifier,
      role: 'TEACHER',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    });

    if (!user) {
      throw new Error('Tài khoản không tồn tại');
    }

    // 2. Check password
    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Mật khẩu không đúng');
    }

    // 3. Tìm teacher tương ứng
    const teacher = await Teacher.findOne({
      teacherCode: identifier
    });

    if (!teacher) {
      throw new Error('Không tìm thấy thông tin giáo viên');
    }

    // 4. Kiểm tra JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET chưa được cấu hình');
    }

    // 5. Tạo token
    const token = jwt.sign(
      {
        userId: user._id,
        teacherId: teacher.teacherCode,
        role: 'TEACHER'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Return data cho frontend
    return {
      success: true,
      token,
      role: 'TEACHER',
      id: teacher._id,
      teacherId: teacher.teacherCode,
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone
    };
  }

  // ================= GET TEACHER =================
  async getTeacherById(teacherId) {
    const teacher = await Teacher.findOne({
      teacherCode: teacherId
    });

    if (!teacher) {
      throw new Error('Không tìm thấy giáo viên');
    }

    return teacher;
  }
}

module.exports = new TeacherService();