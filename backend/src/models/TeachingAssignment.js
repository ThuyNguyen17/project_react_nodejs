const mongoose = require('mongoose');

const TeachingAssignmentSchema = new mongoose.Schema({
    teacherId: { type: String },
    subjectId: { type: String },
    classId: { type: String },
    academicYearId: { type: String },
    semester: { type: Number }
}, { collection: 'teaching_assignments', timestamps: true });

module.exports = mongoose.model('TeachingAssignment', TeachingAssignmentSchema);
