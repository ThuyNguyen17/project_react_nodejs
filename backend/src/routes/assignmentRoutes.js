// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignmentController');

// CREATE
router.post('/', controller.addAssignment);

// SPECIFIC ROUTES FIRST (before dynamic /:id)
router.get('/getall', controller.getAllAssignments);
router.get('/teacher/:teacherId', controller.getAssignmentsByTeacher);
router.get('/student/:studentId', controller.getAssignmentsByStudent);

// DYNAMIC ROUTE (after specific routes)
router.get('/:id', controller.getAssignmentById);

// UPDATE + DELETE
router.put('/:id', controller.updateAssignment);
router.delete('/:id', controller.deleteAssignment);

module.exports = router;