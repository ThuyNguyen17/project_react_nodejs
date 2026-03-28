const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/database');

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const SchoolClass = require('../models/SchoolClass');
const StudentClass = require('../models/StudentClass');
const Subject = require('../models/Subject');
const AcademicYear = require('../models/AcademicYear');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const TeachingAssignment = require('../models/TeachingAssignment');
const Timetable = require('../models/Timetable');

class DemoSeeder {
  constructor(options = {}) {
    this.demoPassword = options.demoPassword || process.env.DEMO_PASSWORD || 'password123';
  }

  async clearAllData() {
    // Clear in order of dependencies (child collections first)
    await Attendance.deleteMany({});
    await AttendanceSession.deleteMany({});
    await Timetable.deleteMany({});
    await TeachingAssignment.deleteMany({});
    await StudentClass.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await SchoolClass.deleteMany({});
    await Subject.deleteMany({});
    await AcademicYear.deleteMany({});
    await User.deleteMany({});
  }

  getCurrentAcademicSeed() {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const year = today.getFullYear();

    // Mirror frontend logic in academicUtils.js
    if (month >= 9) return { academicYear: year, semester: 1 };
    if (month >= 1 && month <= 5) return { academicYear: year - 1, semester: 2 };
    return { academicYear: year - 1, semester: 0 };
  }

  async createSeedData() {
    const { academicYear, semester } = this.getCurrentAcademicSeed();

    const activeYear = await AcademicYear.create({
      year: `${academicYear}-${academicYear + 1}`,
      startDate: new Date(`${academicYear}-09-01T00:00:00.000Z`),
      endDate: new Date(`${academicYear + 1}-05-31T23:59:59.999Z`),
      isActive: true
    });

    const prevYear = await AcademicYear.create({
      year: `${academicYear - 1}-${academicYear}`,
      startDate: new Date(`${academicYear - 1}-09-01T00:00:00.000Z`),
      endDate: new Date(`${academicYear}-05-31T23:59:59.999Z`),
      isActive: false
    });

    const passwordHash = await bcrypt.hash(this.demoPassword, 10);

    const users = [];
    const adminUser = await User.create({
      username: 'admin',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true
    });
    users.push(adminUser);

    const teacherCodes = ['GV001', 'GV002', 'GV003'];
    const studentCodes = ['HS001', 'HS002', 'HS003', 'HS004', 'HS005', 'HS006', 'HS007', 'HS008'];
    const extraStudentCodes = ['HS999'];

    const teacherUsers = await User.create(
      teacherCodes.map((code) => ({
        username: code,
        password: passwordHash,
        role: 'TEACHER',
        isActive: true
      }))
    );
    users.push(...teacherUsers);

    const studentUsers = await User.create(
      [...studentCodes, ...extraStudentCodes].map((code) => ({
        username: code,
        password: passwordHash,
        role: 'STUDENT',
        isActive: true
      }))
    );
    users.push(...studentUsers);

    const teachers = await Teacher.create([
      {
        _id: 'GV001',
        userId: teacherUsers[0]._id,
        teacherCode: 'GV001',
        fullName: 'Nguyen Van An',
        email: 'gv001@school.edu.vn',
        phone: '0912345678'
      },
      {
        _id: 'GV002',
        userId: teacherUsers[1]._id,
        teacherCode: 'GV002',
        fullName: 'Tran Thi Binh',
        email: 'gv002@school.edu.vn',
        phone: '0923456789'
      },
      {
        _id: 'GV003',
        userId: teacherUsers[2]._id,
        teacherCode: 'GV003',
        fullName: 'Le Van Cuong',
        email: 'gv003@school.edu.vn',
        phone: '0934567890'
      }
    ]);

    const subjects = await Subject.create([
      { subjectCode: 'TOAN', subjectName: 'Toan' },
      { subjectCode: 'VAN', subjectName: 'Ngu Van' },
      { subjectCode: 'ANH', subjectName: 'Tieng Anh' },
      { subjectCode: 'LY', subjectName: 'Vat Ly' }
    ]);

    const classes = await SchoolClass.create([
      {
        _id: '10A1',
        academicYearId: activeYear._id,
        gradeLevel: 10,
        className: '10A1',
        homeroomTeacherId: 'GV001'
      },
      {
        _id: '10A2',
        academicYearId: activeYear._id,
        gradeLevel: 10,
        className: '10A2',
        homeroomTeacherId: 'GV002'
      }
    ]);

    const students = await Student.create([
      {
        _id: 'HS001',
        userId: studentUsers[0]._id,
        studentCode: 'HS001',
        fullName: 'Pham Thi Mai',
        dateOfBirth: new Date('2008-03-15'),
        gender: 'Female',
        contact: { phone: '0945678901', email: 'hs001@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS002',
        userId: studentUsers[1]._id,
        studentCode: 'HS002',
        fullName: 'Hoang Van Nam',
        dateOfBirth: new Date('2008-07-22'),
        gender: 'Male',
        contact: { phone: '0956789012', email: 'hs002@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS003',
        userId: studentUsers[2]._id,
        studentCode: 'HS003',
        fullName: 'Do Thi Lan',
        dateOfBirth: new Date('2008-11-30'),
        gender: 'Female',
        contact: { phone: '0967890123', email: 'hs003@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS004',
        userId: studentUsers[3]._id,
        studentCode: 'HS004',
        fullName: 'Vu Minh Quan',
        dateOfBirth: new Date('2008-05-18'),
        gender: 'Male',
        contact: { phone: '0978901234', email: 'hs004@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS005',
        userId: studentUsers[4]._id,
        studentCode: 'HS005',
        fullName: 'Bui Thu Ha',
        dateOfBirth: new Date('2008-09-25'),
        gender: 'Female',
        contact: { phone: '0989012345', email: 'hs005@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS006',
        userId: studentUsers[5]._id,
        studentCode: 'HS006',
        fullName: 'Nguyen Duc Minh',
        dateOfBirth: new Date('2008-01-10'),
        gender: 'Male',
        contact: { phone: '0901122334', email: 'hs006@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS007',
        userId: studentUsers[6]._id,
        studentCode: 'HS007',
        fullName: 'Tran Ngoc Anh',
        dateOfBirth: new Date('2008-02-11'),
        gender: 'Female',
        contact: { phone: '0902233445', email: 'hs007@student.edu.vn', address: 'Ha Noi' }
      },
      {
        _id: 'HS008',
        userId: studentUsers[7]._id,
        studentCode: 'HS008',
        fullName: 'Le Gia Huy',
        dateOfBirth: new Date('2008-04-12'),
        gender: 'Male',
        contact: { phone: '0903344556', email: 'hs008@student.edu.vn', address: 'Ha Noi' }
      },
      // Extra account not assigned to any class (demo edge case)
      {
        _id: 'HS999',
        userId: studentUsers[studentUsers.length - 1]._id,
        studentCode: 'HS999',
        fullName: 'Hoc sinh ngoai lop',
        gender: 'Other',
        contact: { phone: '0999999999', email: 'hs999@student.edu.vn', address: 'Ha Noi' }
      }
    ]);

    await StudentClass.create([
      { _id: 'SC001', academicYearId: String(activeYear._id), studentId: 'HS001', classId: '10A1' },
      { _id: 'SC002', academicYearId: String(activeYear._id), studentId: 'HS002', classId: '10A1' },
      { _id: 'SC003', academicYearId: String(activeYear._id), studentId: 'HS003', classId: '10A1' },
      { _id: 'SC004', academicYearId: String(activeYear._id), studentId: 'HS004', classId: '10A2' },
      { _id: 'SC005', academicYearId: String(activeYear._id), studentId: 'HS005', classId: '10A2' },
      { _id: 'SC006', academicYearId: String(activeYear._id), studentId: 'HS006', classId: '10A2' },
      { _id: 'SC007', academicYearId: String(activeYear._id), studentId: 'HS007', classId: '10A1' },
      { _id: 'SC008', academicYearId: String(activeYear._id), studentId: 'HS008', classId: '10A2' }
    ]);

    const teachingAssignments = await TeachingAssignment.create([
      {
        _id: 'TA001',
        teacherId: 'GV001',
        subjectName: 'Toan',
        className: '10A1',
        academicYear,
        semester: semester || 2
      },
      {
        _id: 'TA002',
        teacherId: 'GV001',
        subjectName: 'Toan',
        className: '10A2',
        academicYear,
        semester: semester || 2
      },
      {
        _id: 'TA003',
        teacherId: 'GV002',
        subjectName: 'Ngu Van',
        className: '10A1',
        academicYear,
        semester: semester || 2
      },
      {
        _id: 'TA004',
        teacherId: 'GV003',
        subjectName: 'Tieng Anh',
        className: '10A2',
        academicYear,
        semester: semester || 2
      }
    ]);

    await Timetable.create([
      // Week 1
      { _id: 'TT001', teachingAssignmentId: 'TA001', week: 1, dayOfWeek: 'MONDAY', period: 1, room: 'P101', note: '' },
      { _id: 'TT002', teachingAssignmentId: 'TA001', week: 1, dayOfWeek: 'WEDNESDAY', period: 3, room: 'P101', note: '' },
      { _id: 'TT003', teachingAssignmentId: 'TA002', week: 1, dayOfWeek: 'TUESDAY', period: 2, room: 'P102', note: '' },
      { _id: 'TT004', teachingAssignmentId: 'TA003', week: 1, dayOfWeek: 'MONDAY', period: 2, room: 'P103', note: '' },
      { _id: 'TT005', teachingAssignmentId: 'TA004', week: 1, dayOfWeek: 'FRIDAY', period: 4, room: 'P104', note: '' },

      // Week 2 (so the "week" dropdown clearly changes the grid)
      { _id: 'TT101', teachingAssignmentId: 'TA001', week: 2, dayOfWeek: 'MONDAY', period: 2, room: 'P101', note: '' },
      { _id: 'TT102', teachingAssignmentId: 'TA001', week: 2, dayOfWeek: 'THURSDAY', period: 1, room: 'P101', note: '' },
      { _id: 'TT103', teachingAssignmentId: 'TA002', week: 2, dayOfWeek: 'TUESDAY', period: 3, room: 'P102', note: '' },
      { _id: 'TT104', teachingAssignmentId: 'TA003', week: 2, dayOfWeek: 'WEDNESDAY', period: 2, room: 'P103', note: '' },
      { _id: 'TT105', teachingAssignmentId: 'TA004', week: 2, dayOfWeek: 'FRIDAY', period: 5, room: 'P104', note: '' }
    ]);

    // Create a couple of attendance sessions around today so student history has data.
    const today = new Date();
    const d0 = new Date(today);
    d0.setHours(0, 0, 0, 0);
    const d1 = new Date(d0);
    d1.setDate(d1.getDate() - 7);

    const attendanceSessions = await AttendanceSession.create([
      {
        _id: 'AS001',
        teachingAssignmentId: 'TA001',
        date: d1,
        period: 1,
        semester: semester || 2,
        qrToken: 'DEMO_TOKEN_1',
        latitude: 21.0285,
        longitude: 105.8542,
        startTime: new Date(d1.getTime() + 7 * 60 * 60 * 1000),
        endTime: new Date(d1.getTime() + 7 * 60 * 60 * 1000 + 15 * 60 * 1000),
        room: 'P101',
        isClosed: true,
        isActive: false,
        open: false
      },
      {
        _id: 'AS002',
        teachingAssignmentId: 'TA001',
        date: d0,
        period: 1,
        semester: semester || 2,
        qrToken: 'DEMO_TOKEN_2',
        latitude: 21.0285,
        longitude: 105.8542,
        startTime: new Date(d0.getTime() + 7 * 60 * 60 * 1000),
        endTime: null,
        room: 'P101',
        isClosed: false,
        isActive: true,
        open: true
      }
    ]);

    await Attendance.create([
      {
        _id: 'ATT001',
        attendanceSessionId: 'AS001',
        studentId: 'HS001',
        studentName: 'Pham Thi Mai',
        studentClass: '10A1',
        location: 'P101',
        qrToken: 'DEMO_TOKEN_1',
        note: '',
        status: 'PRESENT',
        attendanceType: 'QR',
        checkInTime: new Date(d1.getTime() + 7 * 60 * 60 * 1000 + 5 * 60 * 1000)
      },
      {
        _id: 'ATT002',
        attendanceSessionId: 'AS001',
        studentId: 'HS002',
        studentName: 'Hoang Van Nam',
        studentClass: '10A1',
        location: 'P101',
        qrToken: 'DEMO_TOKEN_1',
        note: 'Di muon',
        status: 'LATE',
        attendanceType: 'QR',
        checkInTime: new Date(d1.getTime() + 7 * 60 * 60 * 1000 + 12 * 60 * 1000)
      }
    ]);

    return {
      academicYears: [activeYear, prevYear],
      users,
      teachers,
      subjects,
      classes,
      students,
      teachingAssignments,
      attendanceSessions,
      demoPassword: this.demoPassword
    };
  }

  async resetDatabase() {
    await connectDB();
    try {
      await this.clearAllData();
      return await this.createSeedData();
    } finally {
      await disconnectDB();
    }
  }
}

module.exports = { DemoSeeder };
