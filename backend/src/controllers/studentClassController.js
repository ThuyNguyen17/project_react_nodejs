// controllers/studentClassController.js
const StudentClass = require('../models/StudentClass');

// ==============================
// GET ALL
// ==============================
exports.getAll = async (req, res) => {
    try {
        const data = await StudentClass.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY CLASS
// ==============================
exports.getByClassId = async (req, res) => {
    try {
        const data = await StudentClass.find({
            classId: req.params.classId
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY STUDENT
// ==============================
exports.getByStudentId = async (req, res) => {
    try {
        const data = await StudentClass.find({
            studentId: req.params.studentId
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// CREATE
// ==============================
exports.create = async (req, res) => {
    try {
        const saved = await StudentClass.create(req.body);

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
        await StudentClass.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};