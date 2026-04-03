// controllers/fileController.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = 'uploads/';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ==============================
// UPLOAD
// ==============================
exports.uploadFile = (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File is empty"
            });
        }

        if (file.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                message: "File size exceeds limit (10MB)"
            });
        }

        // create folder if not exists
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const originalName = file.originalname;
        const ext = path.extname(originalName);
        const uniqueName = uuidv4() + ext;

        const filePath = path.join(UPLOAD_DIR, uniqueName);

        fs.writeFileSync(filePath, file.buffer);

        res.json({
            success: true,
            message: "File uploaded successfully",
            fileName: uniqueName,
            originalFileName: originalName,
            fileUrl: `/api/v1/files/download/${uniqueName}`,
            fileType: file.mimetype,
            fileSize: file.size
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to upload file: " + err.message
        });
    }
};

// ==============================
// DOWNLOAD
// ==============================
exports.downloadFile = (req, res) => {
    try {
        const filePath = path.join(UPLOAD_DIR, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        res.download(filePath);

    } catch (err) {
        res.status(500).send('Download error');
    }
};

// ==============================
// DELETE
// ==============================
exports.deleteFile = (req, res) => {
    try {
        const filePath = path.join(UPLOAD_DIR, req.params.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                message: "File deleted successfully"
            });
        }

        res.json({
            success: false,
            message: "File not found"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete file: " + err.message
        });
    }
};