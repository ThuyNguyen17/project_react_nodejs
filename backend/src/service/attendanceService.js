const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const TeachingAssignment = require('../models/TeachingAssignment');
const StudentClass = require('../models/StudentClass');
const Student = require('../models/Student');
const SchoolClass = require('../models/SchoolClass');

const generateToken = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const openSession = async (teachingAssignmentId, date, period, semester, latitude, longitude) => {
    let session = await AttendanceSession.findOne({ teachingAssignmentId, date, period });

    if (session) {
        if (!session.open) {
            session.open = true;
            session.latitude = latitude;
            session.longitude = longitude;
            await session.save();
        }
        return session;
    }

    session = new AttendanceSession({
        teachingAssignmentId,
        date,
        period,
        semester,
        open: true,
        latitude,
        longitude,
        qrToken: generateToken()
    });

    return await session.save();
};

const getSessionById = async (sessionId) => {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) throw new Error('Session not found');
    return session;
};

const updateQrToken = async (sessionId, token) => {
    const session = await getSessionById(sessionId);
    session.previousQrToken = session.qrToken;
    session.qrToken = token;
    return await session.save();
};

const closeSession = async (sessionId) => {
    const session = await getSessionById(sessionId);
    session.open = false;
    return await session.save();
};

const validateSession = (session, qrToken) => {
    if (!session.open) throw new Error('Session closed');
    if (qrToken !== session.qrToken && qrToken !== session.previousQrToken) {
        throw new Error('Invalid QR');
    }
};

const checkDuplicate = async (sessionId, studentId) => {
    const existing = await Attendance.findOne({ attendanceSessionId: sessionId, studentId });
    if (existing) {
        throw new Error('Already checked in');
    }
};

const resolveStudentClass = async (studentId, assignment) => {
    const list = await StudentClass.find({ studentId });
    if (list.length === 0) {
        throw new Error('Student chưa được xếp lớp');
    }

    const targetClassId = assignment.classId;
    const studentInClass = list.find(sc => sc.classId === targetClassId);

    if (!studentInClass) {
        const schoolClass = await SchoolClass.findById(targetClassId);
        const className = schoolClass ? `${schoolClass.gradeLevel}${schoolClass.className}` : targetClassId;
        throw new Error(`Bạn không thuộc lớp ${className}`);
    }

    return targetClassId;
};

const checkIn = async (sessionId, studentId, studentName, qrToken, location, note) => {
    const session = await getSessionById(sessionId);
    validateSession(session, qrToken);
    await checkDuplicate(sessionId, studentId);

    const student = await Student.findById(studentId);
    if (!student) throw new Error('Student not found');

    const assignment = await TeachingAssignment.findById(session.teachingAssignmentId);
    if (!assignment) throw new Error('Assignment not found');

    await resolveStudentClass(studentId, assignment);
    validateLocation(session, location);

    const attendance = new Attendance({
        attendanceSessionId: sessionId,
        studentId: studentId,
        studentName: studentName || student.fullName,
        location: location,
        note: note,
        status: 'PRESENT',
        attendanceType: 'QR',
        checkInTime: new Date()
    });

    return await attendance.save();
};

const updateNote = async (attendanceId, note) => {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) throw new Error('Attendance not found');
    attendance.note = note;
    return await attendance.save();
};

const getAttendancesBySession = async (sessionId) => {
    return await Attendance.find({ attendanceSessionId: sessionId });
};

const deleteAllBySession = async (sessionId) => {
    return await Attendance.deleteMany({ attendanceSessionId: sessionId });
};

const getAbsentStudentIds = async (sessionId) => {
    const session = await getSessionById(sessionId);
    const assignment = await TeachingAssignment.findById(session.teachingAssignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const studentClasses = await StudentClass.find({ classId: assignment.classId });
    const allStudentIds = studentClasses.map(sc => sc.studentId);

    const attendedRecords = await Attendance.find({ attendanceSessionId: sessionId });
    const attendedIds = attendedRecords.map(a => a.studentId);

    return allStudentIds.filter(id => !attendedIds.includes(id));
};

const validateLocation = (session, location) => {
    if (!session.latitude || !session.longitude) return;

    const coords = extractLatLon(location);
    if (!coords) return;

    const distance = calculateDistance(session.latitude, session.longitude, coords[0], coords[1]);
    if (distance > 50) {
        throw new Error(`Bạn ở quá xa lớp (${distance.toFixed(1)}m)`);
    }
}

const extractLatLon = (loc) => {
    try {
        const parts = loc.split(',');
        return [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
    } catch (e) {
        return null;
    }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

module.exports = {
    openSession,
    getSessionById,
    updateQrToken,
    closeSession,
    checkIn,
    updateNote,
    getAttendancesBySession,
    deleteAllBySession,
    getAbsentStudentIds
};
