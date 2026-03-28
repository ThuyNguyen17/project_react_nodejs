const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Session routes
router.post('/session/start', attendanceController.startSession);
router.post('/session/:sessionId/token', attendanceController.updateToken);
router.get('/session/:sessionId/missing', attendanceController.getPendingStudents);
router.get('/session/:sessionId/attendances', attendanceController.getAttendances);
router.post('/session/:sessionId/close', attendanceController.closeSession);
router.delete('/session/:sessionId/clear', attendanceController.clearAttendances);

// Attendance routes
router.post('/record', attendanceController.recordAttendance);
router.put('/:attendanceId/note', attendanceController.updateNote);

module.exports = router;
