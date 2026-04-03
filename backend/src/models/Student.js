const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    phone: { type: String },
    email: { type: String },
    address: { type: String }
}, { _id: false });

const StudentSchema = new mongoose.Schema({
    userId: { type: String },
    studentCode: { type: String },
    fullName: { type: String },
    studentClass: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    contact: { type: ContactSchema }
}, { collection: 'students', timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
