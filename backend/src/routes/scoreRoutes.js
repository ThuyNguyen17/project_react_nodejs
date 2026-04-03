// routes/scoreRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/scoreController');

// GET
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/student/:studentId', controller.getByStudentId);
router.get('/teaching-assignment/:teachingAssignmentId', controller.getByTeachingAssignmentId);

// CREATE
router.post('/', controller.create);

// UPDATE + DELETE
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;