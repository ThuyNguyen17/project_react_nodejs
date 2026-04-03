// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/classControllerReal');
const timetableController = require('../controllers/classTimetableControllerReal');

// CREATE
router.post('/', controller.addClass);

// GET
router.get('/getall', controller.getAllClasses);
router.get('/:className/timetable', timetableController.getClassTimetable);
router.get('/:id', controller.getClassById);

// UPDATE + DELETE
router.put('/:id', controller.updateClass);
router.delete('/:id', controller.deleteClass);

module.exports = router;
