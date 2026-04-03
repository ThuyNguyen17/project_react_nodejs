const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/:teacherId/timetable', timetableController.getTimetable);
router.get('/:teacherId/timetable/week', timetableController.getByWeek);

module.exports = router;
