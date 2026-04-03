const mongoose = require('mongoose');

const QuizAnswerSchema = new mongoose.Schema({
    questionIndex: { type: Number },
    selectedOptions: [{ type: Number }]
}, { _id: false });

const SubmittedFileSchema = new mongoose.Schema({
    id: { type: String },
    fileName: { type: String },
    fileUrl: { type: String },
    fileType: { type: String },
    fileSize: { type: Number }
}, { _id: false });

const SubmissionSchema = new mongoose.Schema({
    assignmentId: { type: String },
    studentId: { type: String },
    studentName: { type: String },
    content: { type: String },
    submittedAt: { type: Date },
    score: { type: Number, default: null },
    feedback: { type: String },
    status: { type: String, enum: ['submitted', 'graded'] },
    classId: { type: String },
    quizAnswers: [QuizAnswerSchema],
    submittedFiles: [SubmittedFileSchema]
}, { collection: 'submissions', timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
