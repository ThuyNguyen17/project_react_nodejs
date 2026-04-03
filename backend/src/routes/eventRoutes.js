// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');

// CREATE
router.post('/', controller.addEvent);

// GET
router.get('/getall', controller.getAllEvents);
router.get('/active', controller.getActiveEvents);
router.get('/type/:eventType', controller.getEventsByType);
router.get('/audience/:targetAudience', controller.getEventsByAudience);

// ⚠️ đặt dưới
router.get('/:id', controller.getEventById);

// UPDATE + DELETE
router.put('/:id', controller.updateEvent);
router.delete('/:id', controller.deleteEvent);

module.exports = router;