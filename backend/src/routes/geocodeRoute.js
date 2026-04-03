// routes/geocodeRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/geocodeController');

// GET /api/geocode/reverse?lat=...&lon=...
router.get('/reverse', controller.reverseGeocode);

module.exports = router;