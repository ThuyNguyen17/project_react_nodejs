// routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/submissionController');

// SUBMIT
router.post('/submit', controller.submitAssignment);

// GET
router.get('/assignment/:assignmentId', controller.getSubmissionsByAssignment);
router.get('/student/:studentId', controller.getSubmissionsByStudent);
router.get('/assignment/:assignmentId/student/:studentId', controller.getSubmissionByAssignmentAndStudent);

// GRADE
router.post('/:submissionId/grade', controller.gradeSubmission);

module.exports = router;