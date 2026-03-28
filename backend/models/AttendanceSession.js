const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  // We generate string ids so code can create sessions without explicitly providing _id.
  _id: { type: String, required: false, default: () => new mongoose.Types.ObjectId().toString() },
  teachingAssignmentId: { type: String, required: true },
  date: { type: Date, required: true },
  period: { type: Number, required: false },
  semester: { type: Number, required: false },
  qrToken: { type: String, required: false },
  previousQrToken: { type: String, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  startTime: { type: Date, required: false, default: Date.now },
  endTime: { type: Date, required: false },
  room: { type: String, required: false },
  isClosed: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  open: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'attendance_sessions'
});

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
