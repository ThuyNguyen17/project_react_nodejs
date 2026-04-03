// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/announcementController');

// CREATE
router.post('/', controller.addAnnouncement);

// GET ALL
router.get('/getall', controller.getAllAnnouncements);

// FILTER
router.get('/audience/:targetAudience', controller.getAnnouncementsByAudience);
router.get('/role/:targetRole', controller.getAnnouncementsByRole);
router.get('/class/:classId', controller.getAnnouncementsByClass);
router.get('/class/:classId/role/:targetRole', controller.getAnnouncementsByClassAndRole);

// UPDATE + DELETE
router.put('/:id', controller.updateAnnouncement);
router.delete('/:id', controller.deleteAnnouncement);

module.exports = router;