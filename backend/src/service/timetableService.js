const mongoose = require('mongoose');
const Timetable = require('../models/Timetable');
const TeachingAssignment = require('../models/TeachingAssignment');
const Subject = require('../models/Subject');
const SchoolClass = require('../models/SchoolClass');

const getDisplayClassName = (schoolClass) => {
    const className = String(schoolClass.className || '').trim();
    const gradeLevel = schoolClass.gradeLevel ?? schoolClass.grade ?? '';

    if (!className) return String(gradeLevel || '').trim();
    if (gradeLevel !== '' && className.startsWith(String(gradeLevel))) {
        return className;
    }

    return `${gradeLevel || ''}${className}`.trim();
};

const loadClasses = async () => {
    const db = mongoose.connection.db;
    const docsWithSource = [];

    const modelClasses = await SchoolClass.find().lean();
    modelClasses.forEach((doc) => docsWithSource.push({ ...doc, __source: 'classes' }));

    for (const collectionName of ['school_classes', 'classes']) {
        const docs = await db.collection(collectionName).find({}).toArray();
        docs.forEach((doc) => docsWithSource.push({ ...doc, __source: collectionName }));
    }

    const grouped = new Map();

    docsWithSource.forEach((doc) => {
        const displayName = getDisplayClassName(doc);
        const key = displayName || String(doc._id || '').trim();
        const aliases = [
            String(doc._id || '').trim(),
            String(doc.className || '').trim(),
            displayName
        ].filter(Boolean);

        const existing = grouped.get(key);
        if (!existing) {
            grouped.set(key, {
                ...doc,
                displayName,
                aliases: Array.from(new Set(aliases))
            });
            return;
        }

        const mergedAliases = Array.from(new Set([...(existing.aliases || []), ...aliases]));
        const preferCurrentDoc = doc.__source === 'school_classes' && existing.__source !== 'school_classes';

        grouped.set(key, {
            ...(preferCurrentDoc ? doc : existing),
            displayName,
            aliases: mergedAliases,
            __source: preferCurrentDoc ? doc.__source : existing.__source
        });
    });

    return Array.from(grouped.values());
};

const matchesClassAlias = (schoolClass, value) => {
    const lookup = String(value || '').trim().toLowerCase();
    if (!lookup) return false;

    return (schoolClass.aliases || []).some((alias) => String(alias || '').trim().toLowerCase() === lookup)
        || String(schoolClass.displayName || '').trim().toLowerCase() === lookup;
};

const resolveClassById = async (classId) => {
    const classes = await loadClasses();
    return classes.find((item) => matchesClassAlias(item, classId)) || null;
};

const resolveClassByName = async (className) => {
    const classes = await loadClasses();
    return classes.find((item) => matchesClassAlias(item, className)) || null;
};

const resolveSubjectName = async (subjectId) => {
    if (!subjectId) return null;
    const subject = await Subject.findById(subjectId).lean();
    return subject ? subject.subjectName : null;
};

const formatTimetableItems = async (timetables, assignments, classNameFallback = '') => {
    const result = [];

    for (const timetable of timetables) {
        const assignment = assignments.find((item) => String(item._id) === String(timetable.teachingAssignmentId));
        if (!assignment) continue;

        const schoolClass = await resolveClassById(assignment.classId);
        const subjectName = await resolveSubjectName(assignment.subjectId);

        result.push({
            teachingAssignmentId: String(timetable.teachingAssignmentId),
            subject: subjectName || '',
            className: schoolClass ? getDisplayClassName(schoolClass) : classNameFallback,
            dayOfWeek: timetable.dayOfWeek,
            period: timetable.period,
            room: timetable.room,
            note: timetable.note || ''
        });
    }

    return result;
};

const getTeacherTimetableByRange = async (teacherId, startDate, endDate) => {
    const assignments = await TeachingAssignment.find({ teacherId }).lean();
    const assignmentIds = assignments.map((item) => String(item._id));

    if (assignmentIds.length === 0) return [];

    const timetables = await Timetable.find({
        teachingAssignmentId: { $in: assignmentIds },
        actualDate: { $gte: startDate, $lte: endDate }
    }).lean();

    return formatTimetableItems(timetables, assignments);
};

const getTeacherTimetableByWeek = async (teacherId, week, semester) => {
    const assignments = await TeachingAssignment.find({
        teacherId,
        ...(semester ? { semester: parseInt(semester, 10) } : {})
    }).lean();
    const assignmentIds = assignments.map((item) => String(item._id));

    if (assignmentIds.length === 0) return [];

    const timetables = await Timetable.find({
        teachingAssignmentId: { $in: assignmentIds },
        week: parseInt(week, 10)
    }).lean();

    return formatTimetableItems(timetables, assignments);
};

const getClassTimetable = async (className, week, year, semester) => {
    const targetClass = await resolveClassByName(className);
    if (!targetClass) return [];

    const classAliases = Array.from(new Set([
        ...(targetClass.aliases || []),
        String(targetClass._id || '').trim(),
        String(targetClass.displayName || '').trim()
    ].filter(Boolean)));

    const assignments = await TeachingAssignment.find({
        classId: { $in: classAliases },
        ...(semester ? { semester: parseInt(semester, 10) } : {})
    }).lean();
    const assignmentIds = assignments.map((item) => String(item._id));

    if (assignmentIds.length === 0) return [];

    const timetables = await Timetable.find({
        teachingAssignmentId: { $in: assignmentIds },
        week: parseInt(week, 10)
    }).lean();

    return formatTimetableItems(timetables, assignments, getDisplayClassName(targetClass));
};

module.exports = {
    getTeacherTimetableByRange,
    getTeacherTimetableByWeek,
    getClassTimetable
};
