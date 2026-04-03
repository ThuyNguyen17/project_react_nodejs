// routes/examRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/examController');

// CREATE
router.post('/', controller.addExam);

// GET
router.get('/getall', controller.getAllExams);

// UPDATE + DELETE
router.put('/:id', controller.updateExam);
router.delete('/:id', controller.deleteExam);

module.exports = router;