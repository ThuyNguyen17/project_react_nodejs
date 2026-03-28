const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  teachingAssignmentId: { type: String, required: true },
  week: { type: Number, required: true }, // Tuần thứ bao nhiêu (1-35)
  dayOfWeek: { type: String, required: true }, // MONDAY..SUNDAY
  period: { type: Number, required: true }, // Tiết số (1-10)
  room: { type: String, required: false },
  note: { type: String, required: false } // Dạy bù, đổi phòng, nghỉ lễ...
}, {
  timestamps: true,
  collection: 'timetables'
});

module.exports = mongoose.model('Timetable', timetableSchema);
