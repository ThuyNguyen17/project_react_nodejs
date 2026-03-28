const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'subjects'
});

module.exports = mongoose.model('Subject', subjectSchema);
