const timetableService = require('../service/timetableService');

exports.getClassTimetable = async (req, res) => {
    try {
        const { className } = req.params;
        const { week, year, semester } = req.query;

        const timetables = await timetableService.getClassTimetable(
            className,
            week,
            year,
            semester
        );

        res.json(timetables);
    } catch (err) {
        console.error('Error fetching timetable:', err);
        res.status(500).json([]);
    }
};
