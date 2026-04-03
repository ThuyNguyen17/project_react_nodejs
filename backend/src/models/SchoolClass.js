const mongoose = require('mongoose');

const SchoolClassSchema = new mongoose.Schema({
    academicYearId: { type: String },
    gradeLevel: { type: Number },
    className: { type: String },
    homeroomTeacherId: { type: String }
}, { collection: 'classes', timestamps: true });

module.exports = mongoose.model('SchoolClass', SchoolClassSchema);
