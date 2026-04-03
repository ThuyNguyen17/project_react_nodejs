const mongoose = require('mongoose');

const StudentClassSchema = new mongoose.Schema({
    studentId: { type: String },
    classId: { type: String },
    academicYearId: { type: String },
    seatRow: { type: Number },
    seatColumn: { type: Number },
    notes: { type: String }
}, { collection: 'student_classes', timestamps: true });

module.exports = mongoose.model('StudentClass', StudentClassSchema);
