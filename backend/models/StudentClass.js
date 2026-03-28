const mongoose = require('mongoose');

const studentClassSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  academicYearId: { type: String, required: false },
  studentId: { type: String, required: true },
  classId: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'student_classes'
});

module.exports = mongoose.model('StudentClass', studentClassSchema);
