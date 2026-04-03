const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const SchoolClass = require('../models/SchoolClass');
const TeachingAssignment = require('../models/TeachingAssignment');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');

const normalizeToKey = (s) => (s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const resolveSchoolClassByIdOrName = async (classIdOrName) => {
    if (!classIdOrName) return null;
    const raw = classIdOrName.trim();
    if (!raw) return null;

    let byId = await SchoolClass.findById(raw);
    if (byId) return byId;

    const key = normalizeToKey(raw);
    const grade = key.match(/\d+/);
    const simpleName = key.replace(/\d+/, '');
    
    if (!grade || !simpleName) return null;
    return await SchoolClass.findOne({ gradeLevel: parseInt(grade[0]), className: { $regex: new RegExp(`^${simpleName}$`, 'i') } });
};

const login = async (username, password) => {
    const normalizedUsername = (username || '').trim();
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) throw new Error('Sai tài khoản hoặc mật khẩu');
    if (!user.isActive) throw new Error('Tài khoản đã bị khóa');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) { // Support legacy plaintext
        throw new Error('Sai tài khoản hoặc mật khẩu');
    }

    const response = {
        userId: user._id,
        username: user.username,
        role: user.role
    };

    if (user.role === 'STUDENT') {
        const student = await Student.findOne({ $or: [{ userId: user._id }, { _id: user.username }, { studentCode: user.username }] });
        if (!student) throw new Error('Thông tin học sinh không tồn tại');

        response.studentId = student._id;
        response.studentCode = student.studentCode;
        response.fullName = student.fullName;

        const studentClasses = await StudentClass.find({ studentId: student._id });
        if (studentClasses.length > 0) {
            const sc = studentClasses[studentClasses.length - 1];
            const schoolClass = await resolveSchoolClassByIdOrName(sc.classId);
            response.className = schoolClass ? `${schoolClass.gradeLevel}${schoolClass.className}` : sc.classId;
        }
    } else if (user.role === 'TEACHER') {
        const teacher = await Teacher.findOne({ $or: [{ userId: user._id }, { _id: user.username }] });
        if (!teacher) throw new Error('Thông tin giáo viên không tồn tại');

        response.teacherId = teacher._id;
        response.fullName = teacher.fullName;
    }

    return response;
};

const getStudentSubjects = async (studentId) => {
    const studentClasses = await StudentClass.find({ studentId });
    if (studentClasses.length === 0) return [];

    const sc = studentClasses[studentClasses.length - 1];
    const schoolClass = await resolveSchoolClassByIdOrName(sc.classId);
    if (!schoolClass) return [];

    const assignments = await TeachingAssignment.find({ classId: schoolClass._id });
    const result = [];

    for (const assignment of assignments) {
        const subject = await Subject.findById(assignment.subjectId);
        const teacher = await Teacher.findById(assignment.teacherId);
        const sessions = await AttendanceSession.find({ teachingAssignmentId: assignment._id });
        
        const attendedSessions = await Attendance.countDocuments({
            attendanceSessionId: { $in: sessions.map(s => s._id) },
            studentId
        });

        result.push({
            assignmentId: assignment._id,
            subjectName: subject ? subject.subjectName : 'N/A',
            teacherName: teacher ? teacher.fullName : 'N/A',
            totalSessions: sessions.length,
            attendedSessions
        });
    }

    return result;
};

const getAttendanceDetails = async (studentId, assignmentId) => {
    const sessions = await AttendanceSession.find({ teachingAssignmentId: assignmentId });
    const result = [];

    for (const session of sessions) {
        const attendance = await Attendance.findOne({ attendanceSessionId: session._id, studentId });
        result.push({
            sessionId: session._id,
            date: session.date,
            period: session.period,
            status: attendance ? attendance.status : 'ABSENT',
            checkInTime: attendance ? attendance.checkInTime : null,
            location: attendance ? attendance.location : null,
            note: attendance ? attendance.note : null,
            attendanceType: attendance ? attendance.attendanceType : null,
            isPresent: !!attendance
        });
    }
    return result;
};

const getStudentsByClass = async (className) => {
    const rawClass = (className || '').trim();
    const schoolClass = await resolveSchoolClassByIdOrName(rawClass);
    const finalClassId = schoolClass ? schoolClass._id : rawClass;

    const mappings = await StudentClass.find({ classId: finalClassId });
    const result = [];

    for (const mapping of mappings) {
        const student = await Student.findById(mapping.studentId);
        if (student) {
            result.push({
                studentId: student._id,
                studentCode: student.studentCode,
                fullName: student.fullName,
                className: schoolClass ? `${schoolClass.gradeLevel}${schoolClass.className}` : rawClass,
                seatRow: mapping.seatRow,
                seatColumn: mapping.seatColumn,
                notes: mapping.notes
            });
        }
    }

    return result.sort((a, b) => (a.studentCode || '').localeCompare(b.studentCode || ''));
};

const createStudent = async (studentData) => {
    const user = new User({
        username: studentData.studentCode || (studentData.fullName || '').replace(/\s+/g, '').toLowerCase(),
        password: await bcrypt.hash('123456', 10),
        role: 'STUDENT',
        isActive: true
    });
    await user.save();

    const student = new Student({ ...studentData, userId: user._id });
    return await student.save();
};

const updateStudent = async (id, studentData) => {
    return await Student.findByIdAndUpdate(id, studentData, { new: true });
};

const deleteStudent = async (id) => {
    return await Student.findByIdAndDelete(id);
};

module.exports = {
    login,
    getStudentSubjects,
    getAttendanceDetails,
    getStudentsByClass,
    createStudent,
    updateStudent,
    deleteStudent
};
