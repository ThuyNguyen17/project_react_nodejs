const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/', teacherController.createTeacher);
router.get('/getall', teacherController.getAllTeachers);
router.delete('/:id', teacherController.deleteTeacher);
router.put('/:id', teacherController.updateTeacher);

module.exports = router;
