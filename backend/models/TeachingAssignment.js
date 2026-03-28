const mongoose = require('mongoose');

const teachingAssignmentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  teacherId: { type: String, required: true },
  subjectName: { type: String, required: true },
  className: { type: String, required: true },
  academicYear: { type: Number, required: true },
  semester: { type: Number, required: true }
}, {
  timestamps: true,
  collection: 'teaching_assignments'
});

module.exports = mongoose.model('TeachingAssignment', teachingAssignmentSchema);
