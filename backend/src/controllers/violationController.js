const Violation = require('../models/Violation');

// ==============================
// LOG VIOLATION
// ==============================
exports.logViolation = async (req, res) => {
    try {
        const violation = await Violation.create({
            ...req.body,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Vi phạm đã được ghi nhận!',
            violation
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ASSIGNMENT
// ==============================
exports.getViolationsByAssignment = async (req, res) => {
    try {
        const violations = await Violation.find({
            assignmentId: req.params.assignmentId
        }).sort({ timestamp: -1 });

        res.json(violations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY USER
// ==============================
exports.getViolationsByUser = async (req, res) => {
    try {
        const violations = await Violation.find({
            userId: req.params.userId
        }).sort({ timestamp: -1 });

        res.json(violations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
