// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/fileController');

// dùng memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// UPLOAD
router.post('/upload', upload.single('file'), controller.uploadFile);

// DOWNLOAD
router.get('/download/:filename', controller.downloadFile);

// DELETE
router.delete('/:filename', controller.deleteFile);

module.exports = router;