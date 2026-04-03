// controllers/scoreController.js
const Score = require('../models/Score');

// ==============================
// GET ALL
// ==============================
exports.getAll = async (req, res) => {
    try {
        const scores = await Score.find();
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ID
// ==============================
exports.getById = async (req, res) => {
    try {
        const score = await Score.findById(req.params.id);
        res.json(score);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY STUDENT
// ==============================
exports.getByStudentId = async (req, res) => {
    try {
        const scores = await Score.find({
            studentId: req.params.studentId
        });

        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY TEACHING ASSIGNMENT
// ==============================
exports.getByTeachingAssignmentId = async (req, res) => {
    try {
        const scores = await Score.find({
            teachingAssignmentId: req.params.teachingAssignmentId
        });

        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// CREATE
// ==============================
exports.create = async (req, res) => {
    try {
        const saved = await Score.create(req.body);

        res.json({
            success: true,
            data: saved
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// UPDATE
// ==============================
exports.update = async (req, res) => {
    try {
        const saved = await Score.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            data: saved
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// DELETE
// ==============================
exports.delete = async (req, res) => {
    try {
        await Score.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};