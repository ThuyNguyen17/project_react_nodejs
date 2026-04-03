const mongoose = require('mongoose');
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const TeachingAssignment = require('../models/TeachingAssignment');
const StudentClass = require('../models/StudentClass');
const Student = require('../models/Student');
const SchoolClass = require('../models/SchoolClass');

const generateToken = () => {
    // Generate UUID-based token like Java version (8 characters, uppercase)
    return require('crypto').randomUUID().substring(0, 8).toUpperCase();
};

const getSessionOpenState = (session) => {
    if (typeof session.open === 'boolean') return session.open;
    if (typeof session.isOpen === 'boolean') return session.isOpen;
    return false;
};

const setSessionOpenState = (session, open) => {
    session.open = open;
    session.isOpen = open;
};

const getDisplayClassName = (schoolClass) => {
    const className = String(schoolClass?.className || '').trim();
    const gradeLevel = schoolClass?.gradeLevel ?? schoolClass?.grade ?? '';

    if (!className) return String(gradeLevel || '').trim();
    if (gradeLevel !== '' && className.startsWith(String(gradeLevel))) {
        return className;
    }

    return `${gradeLevel || ''}${className}`.trim();
};

const loadClasses = async () => {
    const db = mongoose.connection.db;
    const docsWithSource = [];
    const modelClasses = await SchoolClass.find().lean();

    modelClasses.forEach((doc) => docsWithSource.push({ ...doc, __source: 'classes' }));

    for (const collectionName of ['school_classes', 'classes']) {
        const docs = await db.collection(collectionName).find({}).toArray();
        docs.forEach((doc) => docsWithSource.push({ ...doc, __source: collectionName }));
    }

    const grouped = new Map();

    docsWithSource.forEach((doc) => {
        const displayName = getDisplayClassName(doc);
        const key = displayName || String(doc._id || '').trim();
        const aliases = [
            String(doc._id || '').trim(),
            String(doc.className || '').trim(),
            displayName
        ].filter(Boolean);
        const existing = grouped.get(key);

        if (!existing) {
            grouped.set(key, {
                ...doc,
                displayName,
                aliases: Array.from(new Set(aliases))
            });
            return;
        }

        const preferCurrentDoc = doc.__source === 'school_classes' && existing.__source !== 'school_classes';
        grouped.set(key, {
            ...(preferCurrentDoc ? doc : existing),
            displayName,
            aliases: Array.from(new Set([...(existing.aliases || []), ...aliases])),
            __source: preferCurrentDoc ? doc.__source : existing.__source
        });
    });

    return Array.from(grouped.values());
};

const resolveClassByAlias = async (value) => {
    const lookup = String(value || '').trim().toLowerCase();
    if (!lookup) return null;

    const classes = await loadClasses();
    return classes.find((schoolClass) => {
        const aliases = schoolClass.aliases || [];
        return aliases.some((alias) => String(alias || '').trim().toLowerCase() === lookup)
            || String(schoolClass.displayName || '').trim().toLowerCase() === lookup;
    }) || null;
};

const normalizeSession = (session) => ({
    id: String(session._id),
    teachingAssignmentId: String(session.teachingAssignmentId || session.assignmentId || ''),
    date: session.date,
    semester: session.semester,
    period: session.period,
    open: getSessionOpenState(session),
    qrToken: session.qrToken || '',
    previousQrToken: session.previousQrToken || '',
    latitude: session.latitude ?? null,
    longitude: session.longitude ?? null
});

const normalizeAttendance = (attendance) => ({
    id: String(attendance._id),
    attendanceSessionId: String(attendance.attendanceSessionId || attendance.sessionId || ''),
    studentId: String(attendance.studentId || ''),
    studentName: attendance.studentName || '',
    studentClass: attendance.studentClass || '',
    location: attendance.location || '',
    note: attendance.note || '',
    status: attendance.status || 'PRESENT',
    attendanceType: attendance.attendanceType || 'QR',
    checkInTime: attendance.checkInTime || attendance.time || null
});

const resolveAssignment = async (teachingAssignmentId) => {
    const assignment = await TeachingAssignment.findById(teachingAssignmentId).lean();
    if (!assignment) throw new Error('Assignment not found');
    return assignment;
};

const getSessionById = async (sessionId) => {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) throw new Error('Session not found');
    return session;
};

const getNormalizedSessionById = async (sessionId) => normalizeSession(await getSessionById(sessionId));

const findSessionByToken = async (token) => {
    const normalizedToken = String(token || '').trim();
    if (!normalizedToken) {
        throw new Error('Attendance code is required');
    }

    const sessions = await AttendanceSession.find({
        $or: [
            { qrToken: normalizedToken },
            { previousQrToken: normalizedToken }
        ]
    }).sort({ updatedAt: -1, createdAt: -1 });

    const activeSession = sessions.find((session) => getSessionOpenState(session));
    if (activeSession) {
        return normalizeSession(activeSession);
    }

    if (sessions.length > 0) {
        return normalizeSession(sessions[0]);
    }

    throw new Error('Attendance code not found');
};

const openSession = async (teachingAssignmentId, date, period, semester, latitude, longitude) => {
    const sessionDate = new Date(date);
    let session = await AttendanceSession.findOne({
        teachingAssignmentId,
        date: sessionDate,
        period
    });

    if (session) {
        setSessionOpenState(session, true);
        if (latitude !== undefined) session.latitude = latitude;
        if (longitude !== undefined) session.longitude = longitude;
        if (!session.qrToken) session.qrToken = generateToken();
        await session.save();
        return normalizeSession(session);
    }

    session = new AttendanceSession({
        teachingAssignmentId,
        date: sessionDate,
        period,
        semester,
        latitude,
        longitude,
        qrToken: generateToken()
    });
    setSessionOpenState(session, true);

    const saved = await session.save();
    return normalizeSession(saved);
};

const updateQrToken = async (sessionId, token) => {
    const session = await getSessionById(sessionId);
    session.previousQrToken = session.qrToken || '';
    session.qrToken = token || generateToken();
    await session.save();
    return normalizeSession(session);
};

const closeSession = async (sessionId) => {
    const session = await getSessionById(sessionId);
    setSessionOpenState(session, false);
    await session.save();
    return normalizeSession(session);
};

const validateSession = async (session, qrToken) => {
    if (!getSessionOpenState(session)) throw new Error('Session closed');

    const currentToken = String(session.qrToken || '').trim();
    const previousToken = String(session.previousQrToken || '').trim();
    const receivedToken = String(qrToken || '').trim();

    console.log(`Validating QR - received: ${receivedToken}, current: ${currentToken}, previous: ${previousToken}`);

    let match = receivedToken === currentToken || receivedToken === previousToken;
    
    if (!match) {
        console.warn('QR mismatch - possible race condition. Retrying once after 50ms...');
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Reload session to get latest tokens
        const reloadedSession = await getSessionById(session._id);
        const reloadedCurrent = String(reloadedSession.qrToken || '').trim();
        const reloadedPrevious = String(reloadedSession.previousQrToken || '').trim();
        
        console.log(`Retried - QR received: ${receivedToken}, current: ${reloadedCurrent}, previous: ${reloadedPrevious}`);
        match = receivedToken === reloadedCurrent || receivedToken === reloadedPrevious;
    }

    if (!match) {
        console.error(`QR validation failed - received: ${receivedToken}, current: ${currentToken}, previous: ${previousToken}`);
        throw new Error('Invalid QR token');
    }
};

const checkDuplicate = async (sessionId, studentId) => {
    const existing = await Attendance.findOne({
        attendanceSessionId: String(sessionId),
        studentId: String(studentId)
    });

    if (existing) throw new Error('Already checked in');
};

const resolveStudentRecord = async (studentId) => {
    const normalizedId = String(studentId || '').trim();
    let student = null;

    if (mongoose.Types.ObjectId.isValid(normalizedId)) {
        student = await Student.findById(normalizedId);
    }

    if (!student) {
        student = await Student.findOne({
            $or: [
                { userId: normalizedId },
                { studentCode: normalizedId }
            ]
        });
    }

    if (!student) throw new Error('Student not found');
    return student;
};

const resolveStudentClass = async (student, assignment) => {
    const studentKeys = [
        String(student._id),
        String(student.userId || '').trim(),
        String(student.studentCode || '').trim()
    ].filter(Boolean);

    const mappings = await StudentClass.find({
        studentId: { $in: studentKeys }
    }).lean();

    const targetClass = await resolveClassByAlias(assignment.classId);
    const targetAliases = new Set([
        String(assignment.classId || '').trim(),
        String(targetClass?._id || '').trim(),
        ...(targetClass?.aliases || [])
    ].filter(Boolean));

    const studentInClass = mappings.find((mapping) => targetAliases.has(String(mapping.classId || '').trim()));
    if (studentInClass) {
        return {
            classId: String(studentInClass.classId || '').trim(),
            className: targetClass?.displayName || getDisplayClassName(targetClass || {})
        };
    }

    const studentClassName = String(student.studentClass || '').trim();
    if (studentClassName && targetAliases.has(studentClassName)) {
        return {
            classId: String(assignment.classId || '').trim(),
            className: targetClass?.displayName || studentClassName
        };
    }

    const className = targetClass?.displayName || String(assignment.classId || '').trim();
    throw new Error(`Ban khong thuoc lop ${className}`);
};

const extractLatLon = (location) => {
    const value = String(location || '').trim();
    if (!value) return null;

    const parenthesized = value.match(/\((-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\)$/);
    if (parenthesized) {
        return [parseFloat(parenthesized[1]), parseFloat(parenthesized[2])];
    }

    const direct = value.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (direct) {
        return [parseFloat(direct[1]), parseFloat(direct[2])];
    }

    return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000;
};

const validateLocation = (session, location) => {
    if (session.latitude == null || session.longitude == null) return;

    const coords = extractLatLon(location);
    if (!coords) return;

    const distance = calculateDistance(session.latitude, session.longitude, coords[0], coords[1]);
    if (distance > 50) {
        throw new Error(`Ban o qua xa lop (${distance.toFixed(1)}m)`);
    }
};

const checkIn = async (sessionId, studentId, studentName, qrToken, location, note) => {
    const session = await getSessionById(sessionId);
    await validateSession(session, qrToken);
    await checkDuplicate(sessionId, studentId);

    const student = await resolveStudentRecord(studentId);
    const assignment = await resolveAssignment(session.teachingAssignmentId || session.assignmentId);
    const classInfo = await resolveStudentClass(student, assignment);

    validateLocation(session, location);

    const attendance = new Attendance({
        attendanceSessionId: String(sessionId),
        studentId: String(student._id),
        studentName: studentName || student.fullName || '',
        studentClass: classInfo.className || '',
        location: location || '',
        note: note || '',
        status: 'PRESENT',
        attendanceType: 'QR',
        checkInTime: new Date()
    });

    const saved = await attendance.save();
    return normalizeAttendance(saved);
};

const updateNote = async (attendanceId, note) => {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) throw new Error('Attendance not found');

    attendance.note = note || '';
    await attendance.save();
    return normalizeAttendance(attendance);
};

const getAttendancesBySession = async (sessionId) => {
    const attendances = await Attendance.find({
        attendanceSessionId: String(sessionId)
    }).sort({ createdAt: 1 }).lean();

    return attendances.map(normalizeAttendance);
};

const deleteAllBySession = async (sessionId) => (
    Attendance.deleteMany({ attendanceSessionId: String(sessionId) })
);

const getAbsentStudents = async (sessionId) => {
    const session = await getSessionById(sessionId);
    const assignment = await resolveAssignment(session.teachingAssignmentId || session.assignmentId);
    const targetClass = await resolveClassByAlias(assignment.classId);
    const targetAliases = new Set([
        String(assignment.classId || '').trim(),
        String(targetClass?._id || '').trim(),
        ...(targetClass?.aliases || [])
    ].filter(Boolean));

    const mappings = await StudentClass.find().lean();
    const mappedStudentIds = Array.from(new Set(
        mappings
            .filter((mapping) => targetAliases.has(String(mapping.classId || '').trim()))
            .map((mapping) => String(mapping.studentId || '').trim())
            .filter(Boolean)
    ));

    const students = await Student.find({
        $or: [
            { _id: { $in: mappedStudentIds.filter((value) => mongoose.Types.ObjectId.isValid(value)) } },
            { userId: { $in: mappedStudentIds } },
            { studentCode: { $in: mappedStudentIds } },
            { studentClass: { $in: Array.from(targetAliases) } }
        ]
    }).lean();

    const attendances = await getAttendancesBySession(sessionId);
    const presentIds = new Set(attendances.map((attendance) => String(attendance.studentId)));

    return students
        .filter((student) => !presentIds.has(String(student._id)))
        .map((student) => ({
            studentId: String(student._id),
            studentCode: student.studentCode || '',
            fullName: student.fullName || '',
            className: targetClass?.displayName || student.studentClass || ''
        }));
};

module.exports = {
    openSession,
    getSessionById,
    getNormalizedSessionById,
    findSessionByToken,
    updateQrToken,
    closeSession,
    checkIn,
    updateNote,
    getAttendancesBySession,
    deleteAllBySession,
    getAbsentStudents,
    normalizeSession,
    normalizeAttendance
};
