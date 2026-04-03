const attendanceService = require('../service/attendanceServiceReal');

const sendServiceError = (res, error) => {
    const message = error.message || 'Unknown error';

    if (message === 'Session not found' || message === 'Attendance not found' || message === 'Assignment not found' || message === 'Student not found' || message === 'Attendance code not found') {
        return res.status(404).json({ message });
    }

    if (
        message === 'Invalid QR token'
        || message === 'Attendance code is required'
        || message === 'Already checked in'
        || message === 'Session closed'
        || message.startsWith('Ban khong thuoc lop')
        || message.startsWith('Ban o qua xa lop')
    ) {
        return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
};

exports.startSession = async (req, res) => {
    try {
        const {
            teachingAssignmentId,
            assignmentId,
            date,
            period,
            semester,
            latitude,
            longitude
        } = req.body;

        const targetAssignmentId = String(teachingAssignmentId || assignmentId || '').trim();
        if (!targetAssignmentId || !date || !period) {
            return res.status(400).json({ message: 'teachingAssignmentId, date, period are required' });
        }

        const session = await attendanceService.openSession(
            targetAssignmentId,
            date,
            period,
            semester,
            latitude,
            longitude
        );

        res.json(session);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.getSession = async (req, res) => {
    try {
        const session = await attendanceService.getNormalizedSessionById(req.params.sessionId);
        res.json(session);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.resolveCode = async (req, res) => {
    try {
        const token = req.body.token || req.query.token;
        const session = await attendanceService.findSessionByToken(token);
        res.json(session);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.updateToken = async (req, res) => {
    try {
        const session = await attendanceService.updateQrToken(req.params.sessionId, req.body.token);
        res.json(session);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.closeSession = async (req, res) => {
    try {
        const session = await attendanceService.closeSession(req.params.sessionId);
        res.json({ success: true, session });
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.checkIn = async (req, res) => {
    try {
        const attendance = await attendanceService.checkIn(
            req.body.sessionId,
            req.body.studentId,
            req.body.studentName,
            req.body.qrToken,
            req.body.location,
            req.body.note
        );

        res.json(attendance);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.record = exports.checkIn;

exports.updateNote = async (req, res) => {
    try {
        const attendance = await attendanceService.updateNote(req.params.attendanceId, req.body.note);
        res.json(attendance);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.getAttendances = async (req, res) => {
    try {
        const attendances = await attendanceService.getAttendancesBySession(req.params.sessionId);
        res.json(attendances);
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.clearAttendances = async (req, res) => {
    try {
        await attendanceService.deleteAllBySession(req.params.sessionId);
        res.json({ success: true });
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.getAbsentStudents = async (req, res) => {
    try {
        const absent = await attendanceService.getAbsentStudents(req.params.sessionId);
        res.json({ absent });
    } catch (error) {
        sendServiceError(res, error);
    }
};

exports.getSessionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const AttendanceSession = require('../models/AttendanceSession');
        const Attendance = require('../models/Attendance');

        const sessions = await AttendanceSession.find({
            teachingAssignmentId: assignmentId
        }).sort({ date: -1, period: -1 }).lean();

        const result = [];
        for (const session of sessions) {
            const attendanceCount = await Attendance.countDocuments({
                attendanceSessionId: String(session._id)
            });
            result.push({
                ...attendanceService.normalizeSession(session),
                attendanceCount
            });
        }

        res.json(result);
    } catch (error) {
        sendServiceError(res, error);
    }
};
