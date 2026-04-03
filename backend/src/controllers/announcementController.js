// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// 🔹 CREATE
exports.addAnnouncement = async (req, res) => {
    try {
        await Announcement.create(req.body);

        res.json({
            success: true,
            message: "Announcement Created!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET ALL
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find();

        res.json({
            success: true,
            announcements
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY AUDIENCE
exports.getAnnouncementsByAudience = async (req, res) => {
    try {
        const { targetAudience } = req.params;

        let audiences = ['all', 'All', 'ALL'];

        const lCase = targetAudience.toLowerCase();

        audiences.push(lCase);
        audiences.push(targetAudience.toUpperCase());
        audiences.push(lCase.charAt(0).toUpperCase() + lCase.slice(1));

        if (lCase.endsWith('s')) {
            audiences.push(lCase.slice(0, -1));
        } else {
            audiences.push(lCase + 's');
        }

        const announcements = await Announcement.find({
            targetAudience: { $in: audiences }
        });

        res.json({
            success: true,
            announcements
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY ROLE
exports.getAnnouncementsByRole = async (req, res) => {
    try {
        const { targetRole } = req.params;

        const announcements = await Announcement.find({ targetRole });

        res.json({
            success: true,
            announcements
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY CLASS
exports.getAnnouncementsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const announcements = await Announcement.find({ classId });

        res.json({
            success: true,
            announcements
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY CLASS + ROLE
exports.getAnnouncementsByClassAndRole = async (req, res) => {
    try {
        const { classId, targetRole } = req.params;

        const announcements = await Announcement.find({
            classId,
            targetRole
        });

        res.json({
            success: true,
            announcements
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 DELETE
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        await Announcement.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Announcement Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 UPDATE
exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        await Announcement.findByIdAndUpdate(id, req.body);

        res.json({
            success: true,
            message: "Announcement Updated!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};