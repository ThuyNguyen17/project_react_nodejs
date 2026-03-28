const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const TeachingAssignment = require('../models/TeachingAssignment');
const SchoolClass = require('../models/SchoolClass');

class AttendanceService {
  normalizeClassKey(value) {
    return String(value || '').replace(/\s+/g, '').toUpperCase();
  }

  parseHsLegacyId(value) {
    const id = String(value || '');
    const match = id.match(/^s(\d+)$/i);
    if (!match) return null;
    return `HS${String(parseInt(match[1], 10)).padStart(3, '0')}`;
  }

  async resolveStudentByLegacyId(studentId) {
    const id = String(studentId || '');
    let student = await Student.findById(id);
    if (student) return student;

    student = await Student.findOne({ studentCode: id.toUpperCase() });
    if (student) return student;

    const code = this.parseHsLegacyId(id);
    if (code) {
      return Student.findOne({ studentCode: code });
    }

    return null;
  }

  async startSession(sessionData) {
    const { assignmentId, date, period, semester, latitude, longitude } = sessionData;

    if (!assignmentId || !date) {
      throw new Error('assignmentId và date là bắt buộc');
    }

    const existing = await AttendanceSession.findOne({
      teachingAssignmentId: assignmentId,
      date: new Date(date),
      period,
      semester
    }).sort({ createdAt: -1 });

    if (existing) {
      return this.toSessionResponse(existing);
    }

    const session = await AttendanceSession.create({
      teachingAssignmentId: assignmentId,
      date: new Date(date),
      period,
      semester,
      latitude,
      longitude,
      isActive: true,
      isClosed: false,
      open: true
    });

    return this.toSessionResponse(session);
  }

  async updateQrToken(sessionId, token) {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      throw new Error('Không tìm thấy phiên điểm danh');
    }
    if (!this.isSessionOpen(session)) {
      throw new Error('Phiên điểm danh đã đóng');
    }

    session.previousQrToken = session.qrToken || null;
    session.qrToken = token;
    await session.save();
    return this.toSessionResponse(session);
  }

  async recordAttendance(attendanceData) {
    const { sessionId, studentId, studentName, studentClass, location, qrToken, note } = attendanceData;

    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      throw new Error('Không tìm thấy phiên điểm danh');
    }
    if (!this.isSessionOpen(session)) {
      throw new Error('Phiên điểm danh đã đóng');
    }
    const tokenOk = session.qrToken && (session.qrToken === qrToken || session.previousQrToken === qrToken);
    if (!tokenOk) {
      throw new Error('Mã QR không hợp lệ hoặc đã hết hạn');
    }

    const existing = await Attendance.findOne({ attendanceSessionId: sessionId, studentId });
    if (existing) {
      existing.checkInTime = new Date();
      existing.location = location || existing.location;
      existing.note = typeof note === 'string' ? note : existing.note;
      existing.qrToken = qrToken;
      await existing.save();
      return this.toAttendanceResponse(existing);
    }

    const attendance = await Attendance.create({
      attendanceSessionId: sessionId,
      studentId,
      studentName,
      studentClass,
      location,
      qrToken,
      note: note || '',
      status: 'PRESENT',
      attendanceType: 'QR',
      checkInTime: new Date()
    });

    return this.toAttendanceResponse(attendance);
  }

  async getPendingStudents(sessionId) {
    const attendedStudents = await Attendance.find({ attendanceSessionId: sessionId }).distinct('studentId');
    const attendedSet = new Set(attendedStudents.map((id) => String(id)));

    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      throw new Error('Không tìm thấy phiên điểm danh');
    }
    const assignment = await TeachingAssignment.findById(session.teachingAssignmentId);
    const classRaw = assignment?.className || '';
    const schoolClass = await this.resolveClass(classRaw);

    const classKey = this.normalizeClassKey(classRaw);
    // Query by classId to avoid scanning all enrollments.
    const matchedClasses = await StudentClass.find({
      classId: { $regex: new RegExp(`^${classKey}$`, 'i') }
    });

    const pendingStudents = [];
    for (const sc of matchedClasses) {
      const scStudentId = String(sc.studentId);
      if (attendedSet.has(scStudentId)) continue;

      const student = await this.resolveStudentByLegacyId(scStudentId);
      if (!student) continue;

      pendingStudents.push({
        studentId: scStudentId,
        studentCode: student.studentCode,
        fullName: student.fullName,
        className: classRaw
      });
    }

    return pendingStudents;
  }

  async getAttendances(sessionId) {
    const rows = await Attendance.find({ attendanceSessionId: sessionId }).sort({ createdAt: 1 });
    return rows.map((row) => this.toAttendanceResponse(row));
  }

  async updateAttendanceNote(attendanceId, note) {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      throw new Error('Không tìm thấy bản ghi điểm danh');
    }
    attendance.note = note || '';
    await attendance.save();
    return this.toAttendanceResponse(attendance);
  }

  async closeSession(sessionId) {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      throw new Error('Không tìm thấy phiên điểm danh');
    }
    session.isClosed = true;
    session.isActive = false;
    session.open = false;
    session.endTime = new Date();
    await session.save();
    return this.toSessionResponse(session);
  }

  async deleteAttendancesBySession(sessionId) {
    await Attendance.deleteMany({ attendanceSessionId: sessionId });
  }

  toSessionResponse(session) {
    return {
      id: String(session._id),
      teachingAssignmentId: String(session.teachingAssignmentId),
      date: session.date,
      period: session.period,
      semester: session.semester,
      qrToken: session.qrToken || '',
      latitude: session.latitude,
      longitude: session.longitude,
      isClosed: !!session.isClosed,
      isActive: !!session.isActive,
      open: this.isSessionOpen(session)
    };
  }

  toAttendanceResponse(attendance) {
    return {
      id: String(attendance._id),
      sessionId: attendance.attendanceSessionId ? String(attendance.attendanceSessionId) : '',
      studentId: String(attendance.studentId),
      studentName: attendance.studentName,
      studentClass: attendance.studentClass,
      location: attendance.location || '',
      note: attendance.note || '',
      status: attendance.status,
      attendanceType: attendance.attendanceType || 'QR',
      checkInTime: attendance.checkInTime
    };
  }

  async resolveClass(classIdOrName) {
    if (!classIdOrName) return null;

    const raw = String(classIdOrName).trim();
    if (/^[a-fA-F0-9]{24}$/.test(raw)) {
      const byId = await SchoolClass.findById(raw);
      if (byId) return byId;
    }

    const match = raw.match(/^(\d+)\s*([A-Za-z]\w*)$/);
    if (!match) return null;

    const gradeLevel = Number(match[1]);
    const className = match[2].toUpperCase();
    return SchoolClass.findOne({ gradeLevel, className });
  }

  isSessionOpen(session) {
    if (typeof session.open === 'boolean') return session.open;
    if (typeof session.isClosed === 'boolean') return !session.isClosed;
    return true;
  }
}

module.exports = new AttendanceService();
