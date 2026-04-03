// controllers/classTimetableController.js
const Timetable = require('../models/Timetable');
const TeachingAssignment = require('../models/TeachingAssignment');

exports.getClassTimetable = async (req, res) => {
    try {
        const { className } = req.params;
        const { week, year, semester } = req.query;

        console.log(
            `Fetching timetable for class: ${className}, week: ${week}, year: ${year}, semester: ${semester}`
        );

        // 🔥 1. Lấy teaching assignments theo class + semester
        const assignments = await TeachingAssignment.find({
            classId: className,
            semester: parseInt(semester)
        });

        const assignmentIds = assignments.map(a => a._id);

        // 🔥 2. Lấy timetable theo assignment + week
        const timetables = await Timetable.find({
            teachingAssignmentId: { $in: assignmentIds },
            week: parseInt(week)
        });

        console.log(`Found ${timetables.length} timetable entries`);

        res.json(timetables);

    } catch (err) {
        console.error(`Error fetching timetable:`, err);

        res.status(500).json([]); // giống Java trả empty list
    }
};