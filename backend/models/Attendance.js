const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // We generate string ids so code can create attendance records without explicitly providing _id.
  _id: { type: String, required: false, default: () => new mongoose.Types.ObjectId().toString() },
  attendanceSessionId: { type: String, required: false },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentClass: { type: String, required: true },
  location: { type: String, required: false },
  qrToken: { type: String, required: false },
  note: { type: String, required: false },
  status: { type: String, required: true, enum: ['PRESENT', 'LATE', 'ABSENT'] },
  attendanceType: { type: String, required: false },
  checkInTime: { type: Date, required: false }
}, {
  timestamps: true,
  collection: 'attendances'
});

module.exports = mongoose.model('Attendance', attendanceSchema);
