const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true }, // e.g., "2023-2024"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'academic_years'
});

module.exports = mongoose.model('AcademicYear', academicYearSchema);
