const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    attendanceSessionId: { type: String },
    studentId: { type: String },
    studentName: { type: String },
    studentClass: { type: String },
    location: { type: String },
    note: { type: String },
    status: { type: String, enum: ['PRESENT', 'LATE', 'ABSENT'] },
    attendanceType: { type: String },
    checkInTime: { type: Date }
}, { collection: 'attendances', timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
