const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    userId: { type: String },
    teacherCode: { type: String },
    fullName: { type: String },
    phone: { type: String },
    email: { type: String }
}, { collection: 'teachers', timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
