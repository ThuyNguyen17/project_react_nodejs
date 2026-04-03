const Assignment = require('../models/Assignment');

// 🔹 CREATE
exports.addAssignment = async (req, res) => {
    try {
        const data = req.body;

        // Normalize strictMode from either field name sent by frontend
        const strictMode = data.strictMode || data.isStrictMode || false;

        const assignment = await Assignment.create({
            ...data,
            strictMode,
            isStrictMode: strictMode,
            submittedCount: 0,
            totalCount: data.totalCount || 0,
            publishedAt: new Date()
        });

        res.json({
            success: true,
            message: "Assignment Created!",
            assignment
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY ID
exports.getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET ALL
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();

        res.json({
            success: true,
            assignments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY TEACHER
exports.getAssignmentsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const assignments = await Assignment.find({ teacherId });

        res.json({
            success: true,
            assignments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET BY STUDENT — filter by className inside classes array
exports.getAssignmentsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { className } = req.query;

        let filter = {};

        // If className is provided, filter assignments sent to that class
        if (className) {
            filter = {
                'classes.name': { $regex: className.trim(), $options: 'i' }
            };
        }

        const assignments = await Assignment.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            assignments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 DELETE
exports.deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        await Assignment.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Assignment Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 UPDATE
exports.updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Normalize strictMode
        const strictMode = data.strictMode || data.isStrictMode || false;

        await Assignment.findByIdAndUpdate(id, {
            ...data,
            strictMode,
            isStrictMode: strictMode
        }, { new: true });

        res.json({
            success: true,
            message: "Assignment Updated!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};