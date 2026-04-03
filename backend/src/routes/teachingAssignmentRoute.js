const express = require('express');
const router = express.Router();
const teachingAssignmentController = require('../controllers/teachingAssignmentControllerReal');

router.get('/teacher/:teacherId', teachingAssignmentController.getByTeacher);
router.post('/', teachingAssignmentController.create);
router.get('/all', teachingAssignmentController.getAll);
router.put('/:id', teachingAssignmentController.update);
router.delete('/:id', teachingAssignmentController.deleteAssignment);

module.exports = router;
