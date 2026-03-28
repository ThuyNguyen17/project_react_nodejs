const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/:className/timetable', timetableController.getClassTimetable);

module.exports = router;
