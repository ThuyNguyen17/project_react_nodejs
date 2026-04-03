const mongoose = require('mongoose');
const TeachingAssignment = require('../models/TeachingAssignment');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const SchoolClass = require('../models/SchoolClass');

const ASSIGNMENT_COLLECTIONS = ['teaching_assignments', 'teachingassignments', 'teaching-assignments'];
const CLASS_COLLECTIONS = ['school_classes', 'classes', 'class', 'schoolclasses'];

const getDisplayClassName = (classDoc) => {
    const className = String(classDoc.className || '').trim();
    const gradeLevel = classDoc.gradeLevel ?? classDoc.grade ?? '';

    if (!className) return String(gradeLevel || '').trim();
    if (gradeLevel !== '' && className.startsWith(String(gradeLevel))) {
        return className;
    }

    return `${gradeLevel || ''}${className}`.trim();
};

const normalizeAssignment = (assignment) => ({
    id: String(assignment._id),
    teacherId: assignment.teacherId ? String(assignment.teacherId) : '',
    classId: assignment.classId ? String(assignment.classId) : '',
    subjectId: assignment.subjectId ? String(assignment.subjectId) : '',
    academicYearId: assignment.academicYearId ? String(assignment.academicYearId) : '',
    semester: assignment.semester ?? null,
    rawClassName: assignment.className || '',
    rawSubjectName: assignment.subjectName || ''
});

const listAssignments = async () => {
    const db = mongoose.connection.db;
    const items = [];
    const seen = new Set();

    for (const collectionName of ASSIGNMENT_COLLECTIONS) {
        const docs = await db.collection(collectionName).find({}).sort({ createdAt: -1, _id: -1 }).toArray();
        for (const doc of docs) {
            const key = String(doc._id);
            if (seen.has(key)) continue;
            seen.add(key);
            items.push(doc);
        }
    }

    return items;
};

const listClasses = async () => {
    const modelClasses = await SchoolClass.find().lean();
    const db = mongoose.connection.db;
    const merged = [...modelClasses];
    const seen = new Set(modelClasses.map((item) => String(item._id)));

    for (const collectionName of CLASS_COLLECTIONS) {
        const docs = await db.collection(collectionName).find({}).toArray();
        docs.forEach((doc) => {
            const key = String(doc._id);
            if (seen.has(key)) return;
            seen.add(key);
            merged.push(doc);
        });
    }

    return merged;
};

const listTeachers = async () => Teacher.find().lean();
const listSubjects = async () => Subject.find().lean();

const buildLookups = async () => {
    const [teachers, classes, subjects] = await Promise.all([
        listTeachers(),
        listClasses(),
        listSubjects()
    ]);

    return {
        teacherMap: new Map(teachers.map((teacher) => [String(teacher._id), teacher])),
        classMap: new Map(classes.map((schoolClass) => [String(schoolClass._id), schoolClass])),
        subjectMap: new Map(subjects.map((subject) => [String(subject._id), subject]))
    };
};

const buildAssignmentDto = (assignment, lookups) => {
    const normalized = normalizeAssignment(assignment);
    const teacher = lookups.teacherMap.get(normalized.teacherId);
    const schoolClass = lookups.classMap.get(normalized.classId);
    const subject = lookups.subjectMap.get(normalized.subjectId);

    return {
        ...normalized,
        teacherName: teacher?.fullName || '',
        teacherCode: teacher?.teacherCode || '',
        className: schoolClass ? getDisplayClassName(schoolClass) : normalized.rawClassName || '',
        subjectName: subject?.subjectName || normalized.rawSubjectName || ''
    };
};

const resolveClassId = async ({ classId, className }) => {
    if (classId) return String(classId);

    const classes = await listClasses();
    const lookupName = String(className || '').trim().toLowerCase();
    const schoolClass = classes.find((item) => {
        const rawClassName = String(item.className || '').trim().toLowerCase();
        return lookupName && (rawClassName === lookupName || getDisplayClassName(item).toLowerCase() === lookupName);
    });

    return schoolClass ? String(schoolClass._id) : '';
};

const resolveSubjectId = async ({ subjectId, subjectName }) => {
    if (subjectId) return String(subjectId);

    const normalizedSubjectName = String(subjectName || '').trim();
    if (!normalizedSubjectName) return '';

    let subject = await Subject.findOne({ subjectName: normalizedSubjectName });
    if (!subject) {
        subject = await Subject.create({ subjectName: normalizedSubjectName });
    }

    return String(subject._id);
};

const findAssignmentDocument = async (id) => {
    const db = mongoose.connection.db;

    for (const collectionName of ASSIGNMENT_COLLECTIONS) {
        const collection = db.collection(collectionName);
        const query = mongoose.Types.ObjectId.isValid(id)
            ? { _id: new mongoose.Types.ObjectId(id) }
            : { _id: id };
        const doc = await collection.findOne(query);
        if (doc) {
            return { collectionName, doc, query };
        }
    }

    return null;
};

const getByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const [assignments, lookups] = await Promise.all([
            listAssignments(),
            buildLookups()
        ]);

        const result = assignments
            .filter((assignment) => String(assignment.teacherId || '') === String(teacherId))
            .map((assignment) => buildAssignmentDto(assignment, lookups));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const teacherId = String(req.body.teacherId || '').trim();
        const classId = await resolveClassId(req.body);
        const subjectId = await resolveSubjectId(req.body);

        if (!teacherId) {
            return res.status(400).json({ message: 'teacherId is required' });
        }

        if (!classId) {
            return res.status(400).json({ message: 'classId or className is required' });
        }

        if (!subjectId) {
            return res.status(400).json({ message: 'subjectId or subjectName is required' });
        }

        const assignment = await TeachingAssignment.create({
            teacherId,
            classId,
            subjectId,
            academicYearId: req.body.academicYearId || '',
            semester: req.body.semester ?? 1
        });

        res.status(200).json(buildAssignmentDto(assignment.toObject(), await buildLookups()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const [assignments, lookups] = await Promise.all([
            listAssignments(),
            buildLookups()
        ]);

        res.status(200).json(assignments.map((assignment) => buildAssignmentDto(assignment, lookups)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await findAssignmentDocument(id);

        if (!existing) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const teacherId = String(req.body.teacherId || existing.doc.teacherId || '').trim();
        const classId = await resolveClassId({
            classId: req.body.classId || existing.doc.classId,
            className: req.body.className
        });
        const subjectId = await resolveSubjectId({
            subjectId: req.body.subjectId || existing.doc.subjectId,
            subjectName: req.body.subjectName
        });

        const updatePayload = {
            teacherId,
            classId,
            subjectId,
            academicYearId: req.body.academicYearId ?? existing.doc.academicYearId ?? '',
            semester: req.body.semester ?? existing.doc.semester ?? 1,
            updatedAt: new Date()
        };

        let updated;
        if (existing.collectionName === 'teaching_assignments') {
            updated = await TeachingAssignment.findByIdAndUpdate(id, updatePayload, { new: true, lean: true });
        } else {
            await mongoose.connection.db.collection(existing.collectionName).updateOne(existing.query, { $set: updatePayload });
            updated = { ...existing.doc, ...updatePayload, _id: existing.doc._id };
        }

        res.status(200).json(buildAssignmentDto(updated, await buildLookups()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await findAssignmentDocument(id);

        if (!existing) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (existing.collectionName === 'teaching_assignments') {
            await TeachingAssignment.findByIdAndDelete(id);
        } else {
            await mongoose.connection.db.collection(existing.collectionName).deleteOne(existing.query);
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getByTeacher,
    create,
    getAll,
    update,
    deleteAssignment
};
