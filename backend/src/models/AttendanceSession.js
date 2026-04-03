const mongoose = require('mongoose');

const AttendanceSessionSchema = new mongoose.Schema({
    teachingAssignmentId: { type: String },
    date: { type: Date },
    semester: { type: Number },
    period: { type: Number },
    open: { type: Boolean },
    qrToken: { type: String },
    previousQrToken: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
}, { collection: 'attendance_sessions', timestamps: true });

module.exports = mongoose.model('AttendanceSession', AttendanceSessionSchema);
