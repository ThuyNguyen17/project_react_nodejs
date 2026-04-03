const mongoose = require('mongoose');
const SchoolClass = require('../models/SchoolClass');
const StudentClass = require('../models/StudentClass');
const Student = require('../models/Student');

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
    const db = mongoose.connection.db;
    const collectionNames = ['school_classes', 'classes', 'class', 'schoolclasses'];
    const extraClasses = [];

    for (const collectionName of collectionNames) {
        const docs = await db.collection(collectionName).find({}).toArray();
        if (docs.length > 0) {
            extraClasses.push(...docs);
        }
    }

    const mergedClasses = [...modelClasses, ...extraClasses];
    const deduped = new Map();

    mergedClasses.forEach((schoolClass) => {
        const displayName = getDisplayClassName(schoolClass);
        const existing = deduped.get(displayName);

        if (!existing) {
            deduped.set(displayName, {
                ...schoolClass,
                aliases: new Set([
                    String(schoolClass._id || '').trim(),
                    String(schoolClass.className || '').trim(),
                    displayName
                ].filter(Boolean))
            });
            return;
        }

        existing.aliases.add(String(schoolClass._id || '').trim());
        existing.aliases.add(String(schoolClass.className || '').trim());
        existing.aliases.add(displayName);

        if (String(existing._id || '').includes('69ca') && String(schoolClass._id || '').includes('69cd')) {
            deduped.set(displayName, {
                ...schoolClass,
                aliases: existing.aliases
            });
        }
    });

    return Array.from(deduped.values()).map((schoolClass) => ({
        ...schoolClass,
        aliases: Array.from(schoolClass.aliases || [])
    }));
};

exports.addClass = async (req, res) => {
    try {
        await SchoolClass.create(req.body);

        res.json({
            success: true,
            message: 'Class Created!'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await loadClasses();
        const students = await Student.find({}, { _id: 1, userId: 1, studentCode: 1, studentClass: 1 }).lean();
        const studentClasses = await StudentClass.find({}, { studentId: 1, classId: 1 }).lean();
        const validStudentKeys = new Set();

        students.forEach((student) => {
            validStudentKeys.add(String(student._id));
            validStudentKeys.add(String(student.userId || '').trim());
            validStudentKeys.add(String(student.studentCode || '').trim());
        });

        const result = classes.map((schoolClass) => {
            const displayName = getDisplayClassName(schoolClass);
            const aliases = Array.isArray(schoolClass.aliases)
                ? schoolClass.aliases
                : [
                    String(schoolClass._id || '').trim(),
                    String(schoolClass.className || '').trim(),
                    displayName
                ].filter(Boolean);
            const studentsByLabel = students.filter((student) => {
                const studentClass = String(student.studentClass || '').trim();
                return aliases.includes(studentClass);
            }).length;

            const studentsByMapping = studentClasses.filter((mapping) => {
                const classId = String(mapping.classId || '').trim();
                const studentId = String(mapping.studentId || '').trim();

                return aliases.includes(classId) && validStudentKeys.has(studentId);
            }).length;

            const studentCount = Math.max(studentsByLabel, studentsByMapping, 0);

            return {
                id: String(schoolClass._id),
                classId: String(schoolClass._id),
                className: schoolClass.className || '',
                grade: schoolClass.grade ?? schoolClass.gradeLevel ?? null,
                gradeLevel: schoolClass.gradeLevel ?? schoolClass.grade ?? null,
                displayName,
                studentCount,
                aliases
            };
        });

        res.json({
            success: true,
            classes: result
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getClassById = async (req, res) => {
    try {
        const schoolClass = await SchoolClass.findById(req.params.id);
        res.json(schoolClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await SchoolClass.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Class Deleted!'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        await SchoolClass.findByIdAndUpdate(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Class Updated!'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
