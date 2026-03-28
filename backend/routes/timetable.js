const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// Lấy TKB theo lớp + tuần
router.get('/class/:className', timetableController.getClassTimetable);

// Lấy theo ngày
router.get('/class/:className/:dayOfWeek', timetableController.getTimetableByDay);

// Lịch thi
router.get('/exams/:studentId', timetableController.getExamSchedule);

module.exports = router;