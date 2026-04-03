// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceControllerReal');

// ==============================
// SESSION
// ==============================

router.post('/session/start', controller.startSession);
router.get('/session/:sessionId', controller.getSession);
router.post('/resolve-code', controller.resolveCode);
router.post('/session/:sessionId/token', controller.updateToken);
router.post('/session/:sessionId/close', controller.closeSession);

// ==============================
// ATTENDANCE
// ==============================

router.post('/check-in', controller.checkIn);
router.post('/record', controller.record);

router.put('/:attendanceId/note', controller.updateNote);

router.get('/session/:sessionId/attendances', controller.getAttendances);
router.delete('/session/:sessionId/clear', controller.clearAttendances);

// ==============================
// REPORT
// ==============================

router.get('/session/:sessionId/absent', controller.getAbsentStudents);
router.get('/session/:sessionId/missing', controller.getAbsentStudents);
router.get('/sessions/assignment/:assignmentId', controller.getSessionsByAssignment);

module.exports = router;
