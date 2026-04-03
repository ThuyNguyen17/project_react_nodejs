// routes/violationRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/violationController');

// LOG a new violation - supports both POST / and POST /log
router.post('/', controller.logViolation);
router.post('/log', controller.logViolation);

// GET violations for an assignment (teacher view)
router.get('/assignment/:assignmentId', controller.getViolationsByAssignment);

// GET violations for a user
router.get('/user/:userId', controller.getViolationsByUser);

module.exports = router;
