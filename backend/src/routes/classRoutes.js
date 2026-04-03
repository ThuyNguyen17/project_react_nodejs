// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/classTimetableController');

// GET timetable theo class
router.get('/:className/timetable', controller.getClassTimetable);

module.exports = router;