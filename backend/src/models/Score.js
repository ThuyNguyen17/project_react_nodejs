const mongoose = require('mongoose');

const ScoreItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['ORAL', 'QUIZ', 'MIDTERM', 'FINAL'] },
    value: { type: Number },
    weight: { type: Number },
    date: { type: Date }
}, { _id: false });

const ScoreSchema = new mongoose.Schema({
    studentId: { type: String },
    teachingAssignmentId: { type: String },
    semester: { type: Number },
    items: [ScoreItemSchema],
    academicYearId: { type: String }
}, { collection: 'scores', timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
