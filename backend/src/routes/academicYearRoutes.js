const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');

router.get('/', academicYearController.getAllAcademicYears);

router.get('/active', academicYearController.getActiveAcademicYear);

// 🔥 giống /semester-start?semester=1
router.get('/semester-start', academicYearController.getSemesterStart);

module.exports = router;