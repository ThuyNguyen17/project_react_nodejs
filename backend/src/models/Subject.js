const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectCode: { type: String },
    subjectName: { type: String }
}, { collection: 'subjects', timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
