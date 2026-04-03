// controllers/classController.js
const mongoose = require('mongoose');
const SchoolClass = require('../models/SchoolClass');

const getDisplayClassName = (classDoc) => {
    const className = String(classDoc.className || '').trim();
    const gradeLevel = classDoc.gradeLevel ?? classDoc.grade ?? '';

    if (!className) return String(gradeLevel || '').trim();
    if (gradeLevel !== '' && className.startsWith(String(gradeLevel))) {
        return className;
    }

    return `${gradeLevel || ''}${className}`.trim();
};

const loadClasses = async () => {
    const modelClasses = await SchoolClass.find().lean();
    if (modelClasses.length > 0) {
        return modelClasses;
    }

    const db = mongoose.connection.db;
    const legacyCollections = ['class', 'schoolclasses', 'classes'];

    for (const collectionName of legacyCollections) {
        const docs = await db.collection(collectionName).find({}).toArray();
        if (docs.length > 0) {
            return docs;
        }
    }

    return [];
};

// ==============================
// CREATE
// ==============================
exports.addClass = async (req, res) => {
    try {
        await SchoolClass.create(req.body);

        res.json({
            success: true,
            message: "Class Created!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET ALL (DTO)
// ==============================
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await SchoolClass.find();

        // 🔥 map sang DTO (giống SchoolClassDTO)
        const result = classes.map(c => ({
            id: c._id,
            className: c.className,
            grade: c.grade,
            studentCount: c.studentCount || 0
        }));

        res.json({
            success: true,
            classes: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ID
// ==============================
exports.getClassById = async (req, res) => {
    try {
        const schoolClass = await SchoolClass.findById(req.params.id);

        res.json(schoolClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// DELETE
// ==============================
exports.deleteClass = async (req, res) => {
    try {
        await SchoolClass.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Class Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// UPDATE
// ==============================
exports.updateClass = async (req, res) => {
    try {
        await SchoolClass.findByIdAndUpdate(req.params.id, req.body);

        res.json({
            success: true,
            message: "Class Updated!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
