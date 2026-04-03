
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');

exports.startSession = async (req, res) => {
    try {
        const {
            assignmentId,
            date,
            period,
            semester,
            latitude,
            longitude
        } = req.body;

        const session = await AttendanceSession.create({
            assignmentId,
            date,
            period,
            semester,
            latitude,
            longitude,
            isOpen: true
        });

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET SESSION
exports.getSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 UPDATE QR TOKEN
exports.updateToken = async (req, res) => {
    try {
        const { token } = req.body;

        const session = await AttendanceSession.findByIdAndUpdate(
            req.params.sessionId,
            { qrToken: token },
            { new: true }
        );

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 CLOSE SESSION
exports.closeSession = async (req, res) => {
    try {
        await AttendanceSession.findByIdAndUpdate(
            req.params.sessionId,
            { isOpen: false }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ==============================
// ATTENDANCE
// ==============================

// 🔹 CHECK-IN
exports.checkIn = async (req, res) => {
    try {
        const {
            sessionId,
            studentId,
            studentName,
            qrToken,
            location,
            note
        } = req.body;

        const session = await AttendanceSession.findById(sessionId);

        if (!session || !session.isOpen) {
            return res.status(400).json({ message: 'Session closed or not found' });
        }

        // 🔥 Check token
        if (session.qrToken !== qrToken) {
            return res.status(400).json({ message: 'Invalid QR token' });
        }

        // 🔥 Check duplicate
        const exists = await Attendance.findOne({ sessionId, studentId });
        if (exists) {
            return res.status(400).json({ message: 'Already checked in' });
        }

        const attendance = await Attendance.create({
            sessionId,
            studentId,
            studentName,
            location,
            note,
            time: new Date()
        });

        res.json(attendance);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 Alias /record
exports.record = exports.checkIn;


// 🔹 UPDATE NOTE
exports.updateNote = async (req, res) => {
    try {
        const { note } = req.body;

        const attendance = await Attendance.findByIdAndUpdate(
            req.params.attendanceId,
            { note },
            { new: true }
        );

        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// 🔹 GET ATTENDANCES BY SESSION
exports.getAttendances = async (req, res) => {
    try {
        const data = await Attendance.find({
            sessionId: req.params.sessionId
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// 🔹 CLEAR ALL
exports.clearAttendances = async (req, res) => {
    try {
        await Attendance.deleteMany({
            sessionId: req.params.sessionId
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ==============================
// REPORT
// ==============================

// 🔹 ABSENT
exports.getAbsentStudents = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const attendances = await Attendance.find({ sessionId });

        const presentIds = attendances.map(a => a.studentId);

        // ⚠️ giả định bạn có danh sách lớp
        // 👉 cần query từ Class hoặc Assignment
        // tạm thời trả list có mặt

        res.json({
            present: presentIds,
            absent: [] // bạn sẽ tính sau
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};