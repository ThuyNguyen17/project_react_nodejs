const AcademicYear = require('../models/AcademicYear');

// 🔹 GET all
exports.getAllAcademicYears = async (req, res) => {
    try {
        const data = await AcademicYear.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET active
exports.getActiveAcademicYear = async (req, res) => {
    try {
        const year = await AcademicYear.findOne({ active: true });

        if (!year) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(year);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔥 GET semester start (QUAN TRỌNG)
exports.getSemesterStart = async (req, res) => {
    try {
        const { semester } = req.query;

        const year = await AcademicYear.findOne({ active: true });

        if (!year) {
            return res.status(400).json({ message: 'No active academic year' });
        }

        let startDate;

        if (parseInt(semester) === 1) {
            startDate = year.startDate;
        } else if (parseInt(semester) === 2) {
            const date = new Date(year.startDate);
            date.setMonth(date.getMonth() + 5);
            startDate = date;
        } else {
            return res.status(400).json({ message: 'Invalid semester' });
        }

        res.json({ startDate });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};