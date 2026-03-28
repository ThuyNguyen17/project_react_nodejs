const mongoose = require('mongoose');

const schoolClassSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: false },
  gradeLevel: { type: Number, required: true }, // 6-9 (THCS) | 10-12 (THPT)
  className: { type: String, required: true }, // A | B | C
  homeroomTeacherId: { type: String, ref: 'Teacher', required: false }
}, {
  timestamps: true,
  collection: 'classes'
});

module.exports = mongoose.model('SchoolClass', schoolClassSchema);
