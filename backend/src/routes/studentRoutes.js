// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');
const Student = require('../models/Student');

// LOGIN
router.post('/login-new', controller.loginNew);

// SUBJECT + ATTENDANCE
router.get('/:studentId/subjects', controller.getSubjects);
router.get('/:studentId/subjects/:assignmentId/attendance', controller.getAttendanceDetails);

// IMPORT EXPORT
router.post('/import', controller.importStudents);
router.post('/import-with-class', controller.importStudentsWithClass);
router.get('/export', controller.exportStudents);

// CLASS
router.get('/class/:className', controller.getStudentsByClass);

// USER
router.get('/by-user/:userId', controller.getStudentByUserId);

// SEATING
router.put('/:studentId/className/:className/seating', controller.updateStudentSeating);

// CRUD
router.get('/', controller.getAllStudents);
router.get('/:id', controller.getStudentById);
router.post('/', controller.createStudent);
router.put('/:id', controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;
