const mongoose = require('mongoose');

const ClassInfoSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String }
}, { _id: false });

const ExamSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    subjectId: { type: String },
    examDate: { type: Date },
    duration: { type: Number },
    maxScore: { type: Number },
    teacherId: { type: String },
    classes: [ClassInfoSchema],
    completedCount: { type: Number },
    totalCount: { type: Number }
}, { collection: 'exams', timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);
