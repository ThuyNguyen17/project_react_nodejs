const timetableService = require('../service/timetableService');

const getTimetable = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { startDate, endDate, week, year, semester } = req.query;

        if (week && year) {
            const timetable = await timetableService.getTeacherTimetableByWeek(teacherId, week, semester);
            return res.status(200).json(timetable);
        }

        if (startDate && endDate) {
            const timetable = await timetableService.getTeacherTimetableByRange(teacherId, new Date(startDate), new Date(endDate));
            return res.status(200).json(timetable);
        }

        res.status(200).json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByWeek = async (req, res) => {
    const { teacherId } = req.params;
    const { week, semester } = req.query;
    try {
        const timetable = await timetableService.getTeacherTimetableByWeek(teacherId, week, semester);
        res.status(200).json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTimetable,
    getByWeek
};
