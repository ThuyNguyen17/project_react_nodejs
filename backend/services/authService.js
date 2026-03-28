const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const AcademicYear = require('../models/AcademicYear');
const SchoolClass = require('../models/SchoolClass');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async verifyPassword(inputPassword, storedPassword) {
    if (!storedPassword || !inputPassword) return false;

    // Support legacy plain text passwords (old seed data).
    if (inputPassword === storedPassword) return true;

    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch {
      return false;
    }
  }

  // Universal login for STUDENT | TEACHER | ADMIN
  async universalLogin(username, password) {
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    });

    if (!user) throw new Error('Tài khoản không tồn tại');

    const ok = await this.verifyPassword(password, user.password);
    if (!ok) throw new Error('Mật khẩu không đúng');

    if (user.role === 'TEACHER') {
      return this.handleTeacherLogin(user, user.username);
    }
    if (user.role === 'STUDENT') {
      return this.handleStudentLogin(user, user.username);
    }
    if (user.role === 'ADMIN') {
      return this.handleAdminLogin(user);
    }

    throw new Error('Vai trò người dùng không hợp lệ');
  }

  async handleTeacherLogin(user, username) {
    const teacher = await Teacher.findOne({
      teacherCode: String(username || '').toUpperCase()
    });

    if (!teacher) throw new Error('Không tìm thấy thông tin giáo viên');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET chưa cấu hình');

    const token = jwt.sign(
      {
        userId: user._id,
        teacherId: teacher.teacherCode,
        role: 'TEACHER'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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

  async handleAdminLogin(user) {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET chưa cấu hình');

    const token = jwt.sign(
      {
        userId: user._id,
        role: 'ADMIN'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      token,
      role: 'ADMIN',
      id: user._id,
      username: user.username,
      fullName: user.username
    };
  }

  async handleStudentLogin(user, username) {
    const student = await Student.findOne({
      studentCode: String(username || '').toUpperCase()
    });

    if (!student) throw new Error('Không tìm thấy thông tin sinh viên');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET chưa cấu hình');

    const token = jwt.sign(
      {
        userId: user._id,
        studentId: student._id,
        studentCode: student.studentCode,
        role: 'STUDENT'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const className = await this.resolveStudentClassName(student._id);

    return {
      success: true,
      token,
      role: 'STUDENT',
      id: student._id,
      studentId: student._id,
      studentCode: student.studentCode,
      fullName: student.fullName,
      className,
      email: student.contact?.email || '',
      phone: student.contact?.phone || ''
    };
  }

  async resolveStudentClassName(studentId) {
    const activeYear = await AcademicYear.findOne({ isActive: true }).sort({ createdAt: -1 });

    const query = { studentId: String(studentId) };
    if (activeYear?._id) query.academicYearId = String(activeYear._id);

    const sc = await StudentClass.findOne(query).sort({ createdAt: -1 });
    if (!sc) return '';

    const raw = String(sc.classId || '').trim();
    if (!raw) return '';

    // If seed stores classId as "10A1" already.
    if (/^\d+\w+$/i.test(raw)) return raw.toUpperCase();

    // If seed stores classId as SchoolClass _id.
    const cls = await SchoolClass.findById(raw);
    if (!cls) return raw;

    return String(cls.className || raw).toUpperCase();
  }
}

module.exports = new AuthService();

