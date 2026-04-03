// controllers/eventController.js
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

// ==============================
// CREATE EVENT
// ==============================
exports.addEvent = async (req, res) => {
    try {
        let event = req.body;

        // 🔥 set default
        event.createdAt = new Date();
        event.updatedAt = new Date();
        event.status = event.status || 'PUBLISHED';

        // backward compatibility
        if (event.title && !event.events) {
            event.events = event.title;
        }

        const savedEvent = await Event.create(event);

        // 🔥 auto create notification
        await createNotificationForEvent(savedEvent);

        res.json({
            success: true,
            message: "Event Created!",
            event: savedEvent
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// CREATE NOTIFICATION
// ==============================
const createNotificationForEvent = async (event) => {
    let targetAudience = event.targetAudience || 'all';

    let targetRole;

    switch (targetAudience.toLowerCase()) {
        case 'teachers':
            targetRole = 'TEACHER';
            break;
        case 'students':
            targetRole = 'STUDENT';
            break;
        default:
            targetRole = 'ALL';
    }

    await Announcement.create({
        title: `Sự kiện mới: ${event.title}`,
        content:
            `Thông báo về sự kiện: ${event.title}\n` +
            `Thời gian: ${event.date || 'Chưa xác định'}\n` +
            `Địa điểm: ${event.location || 'Chưa xác định'}\n` +
            `Mô tả: ${event.description || 'Không có mô tả'}`,
        targetRole,
        classId: null,
        academicYearId: null
    });
};

// ==============================
// GET ALL
// ==============================
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.json({
            success: true,
            events
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ID
// ==============================
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        res.json({
            success: true,
            event
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// UPDATE
// ==============================
exports.updateEvent = async (req, res) => {
    try {
        let event = req.body;

        event.updatedAt = new Date();

        if (event.title && !event.events) {
            event.events = event.title;
        }

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            event,
            { new: true }
        );

        res.json({
            success: true,
            message: "Event Updated!",
            event: updated
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// DELETE
// ==============================
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Event Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// ACTIVE EVENTS
// ==============================
exports.getActiveEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'PUBLISHED' });

        res.json({
            success: true,
            events
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// BY TYPE
// ==============================
exports.getEventsByType = async (req, res) => {
    try {
        const events = await Event.find({
            eventType: req.params.eventType
        });

        res.json({
            success: true,
            events
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// BY AUDIENCE
// ==============================
exports.getEventsByAudience = async (req, res) => {
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

        const events = await Event.find({
            targetAudience: { $in: audiences }
        });

        res.json({
            success: true,
            events
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};