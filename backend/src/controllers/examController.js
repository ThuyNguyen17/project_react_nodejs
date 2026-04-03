// controllers/examController.js
const Exam = require('../models/Exam');

// 🔹 CREATE
exports.addExam = async (req, res) => {
    try {
        await Exam.create(req.body);

        res.json({
            success: true,
            message: "Exam Created!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET ALL
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find();

        res.json({
            success: true,
            exams
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 DELETE
exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;

        await Exam.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Exam Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 UPDATE
exports.updateExam = async (req, res) => {
    try {
        const { id } = req.params;

        await Exam.findByIdAndUpdate(id, req.body);

        res.json({
            success: true,
            message: "Exam Updated!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};