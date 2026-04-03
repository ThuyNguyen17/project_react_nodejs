const mongoose = require('mongoose');

const ExamScheduleSchema = new mongoose.Schema({
    academicYearId: { type: String },
    classId: { type: String },
    subjectId: { type: String },
    semester: { type: Number },
    examDate: { type: Date },
    room: { type: String }
}, { collection: 'exam_schedules', timestamps: true });

module.exports = mongoose.model('ExamSchedule', ExamScheduleSchema);
