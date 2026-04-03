const mongoose = require('mongoose');

const AcademicYearSchema = new mongoose.Schema({
    name: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean },
    semester1Start: { type: Date },
    semester2Start: { type: Date }
}, { collection: 'academic_years', timestamps: true });

module.exports = mongoose.model('AcademicYear', AcademicYearSchema);
