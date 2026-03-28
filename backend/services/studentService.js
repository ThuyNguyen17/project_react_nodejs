const Student = require('../models/Student');
const User = require('../models/User');
const StudentClass = require('../models/StudentClass');
const AcademicYear = require('../models/AcademicYear');
const TeachingAssignment = require('../models/TeachingAssignment');
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class StudentService {
  async verifyPassword(inputPassword, storedPassword) {
    if (!storedPassword || !inputPassword) return false;

    // Legacy plain text support.
    if (inputPassword === storedPassword) return true;

    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch {
      return false;
    }
  }

  async login(username, password) {
    const u = String(username || '').trim();
    if (!u) throw new Error('Vui lòng nhập tài khoản');

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${u}$`, 'i') },
      role: 'STUDENT',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    });

    if (!user) throw new Error('Tài khoản không tồn tại');

    const ok = await this.verifyPassword(password, user.password);
    if (!ok) throw new Error('Mật khẩu không đúng');

    const student = await Student.findOne({
      studentCode: String(user.username || '').toUpperCase()
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

    const className = await this.getStudentClassName(student._id);

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

  async loginByStudentCode(studentCode) {
    const code = String(studentCode || '').trim().toUpperCase();
    if (!code) throw new Error('Vui lòng nhập mã sinh viên');

    const student = await Student.findOne({ studentCode: code });
    if (!student) throw new Error('Không tìm thấy sinh viên');

    // This endpoint is kept for backward-compat/demo; it issues a token without password.
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET chưa cấu hình');
    const token = jwt.sign(
      {
        userId: null,
        studentId: student._id,
        studentCode: student.studentCode,
        role: 'STUDENT'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const className = await this.getStudentClassName(student._id);

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

  async getStudentById(studentId) {
    const student = await Student.findById(studentId);
    if (!student) throw new Error('Không tìm thấy sinh viên');
    return student;
  }

  async getStudentClassName(studentId) {
    const activeYear = await AcademicYear.findOne({ isActive: true }).sort({ createdAt: -1 });
    const query = { studentId: String(studentId) };
    if (activeYear?._id) query.academicYearId = String(activeYear._id);

    const sc = await StudentClass.findOne(query).sort({ createdAt: -1 });
    if (!sc?.classId) return '';
    return String(sc.classId).trim().toUpperCase();
  }

  async getStudentSubjects(studentId) {
    const className = await this.getStudentClassName(studentId);
    if (!className) return [];

    const assignments = await TeachingAssignment.find({ className }).sort({ subjectName: 1 });

    const result = [];
    for (const a of assignments) {
      const [teacher, totalSessions] = await Promise.all([
        Teacher.findOne({ teacherCode: String(a.teacherId).toUpperCase() }),
        AttendanceSession.countDocuments({ teachingAssignmentId: String(a._id) })
      ]);

      let attendedSessions = 0;
      if (totalSessions > 0) {
        const sessions = await AttendanceSession.find({ teachingAssignmentId: String(a._id) }).select('_id');
        const sessionIds = sessions.map(s => String(s._id));
        attendedSessions = await Attendance.countDocuments({
          studentId: String(studentId),
          attendanceSessionId: { $in: sessionIds }
        });
      }

      result.push({
        assignmentId: String(a._id),
        subjectName: a.subjectName,
        teacherName: teacher?.fullName || String(a.teacherId),
        attendedSessions,
        totalSessions
      });
    }

    return result;
  }

  async getAttendanceDetails(studentId, assignmentId) {
    const sessions = await AttendanceSession.find({
      teachingAssignmentId: String(assignmentId)
    }).sort({ date: 1, period: 1 });

    if (!sessions.length) return [];

    const sessionIds = sessions.map(s => String(s._id));
    const attendances = await Attendance.find({
      studentId: String(studentId),
      attendanceSessionId: { $in: sessionIds }
    });

    const bySessionId = new Map(attendances.map(a => [String(a.attendanceSessionId), a]));

    return sessions.map((s) => {
      const a = bySessionId.get(String(s._id));
      return {
        sessionId: String(s._id),
        date: s.date,
        period: s.period || null,
        isPresent: !!a,
        status: a?.status || 'ABSENT',
        location: a?.location || '',
        note: a?.note || '',
        attendanceType: a?.attendanceType || '',
        checkInTime: a?.checkInTime || null
      };
    });
  }

  async getStudentsByClass(className) {
    const key = String(className || '').trim().toUpperCase();
    if (!key) return [];

    const enrollments = await StudentClass.find({ classId: key }).select('studentId');
    const ids = enrollments.map(e => String(e.studentId));
    if (!ids.length) return [];

    return Student.find({ _id: { $in: ids } }).select('studentCode fullName dateOfBirth gender');
  }
}

module.exports = new StudentService();

