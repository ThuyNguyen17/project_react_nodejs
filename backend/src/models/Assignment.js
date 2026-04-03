const mongoose = require('mongoose');

const ClassInfoSchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String }
});

const OptionSchema = new mongoose.Schema({
    id: { type: String },
    content: { type: String }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
    _id: { type: String },
    content: { type: String },
    type: { type: String },
    options: [OptionSchema],
    correctAnswers: [{ type: Number }],
    points: { type: Number }
});

const AttachmentSchema = new mongoose.Schema({
    id: { type: String },
    fileName: { type: String },
    name: { type: String },
    fileUrl: { type: String },
    fileType: { type: String },
    fileSize: { type: Number }
}, { _id: false });

const AssignmentSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    subjectId: { type: String },
    deadline: { type: Date },
    maxScore: { type: Number },
    teacherId: { type: String },
    classes: [ClassInfoSchema],
    submittedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    type: { type: String, enum: ['ESSAY', 'QUIZ', 'UPLOAD'], default: 'ESSAY' },
    questions: [QuestionSchema],
    attachments: [AttachmentSchema],
    status: { type: String },
    publishedAt: { type: Date },
    strictMode: { type: Boolean, default: false },
    isStrictMode: { type: Boolean, default: false }
}, { collection: 'assignments', timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
