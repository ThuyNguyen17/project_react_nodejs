const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: false },
  email: { type: String, required: false },
  address: { type: String, required: false }
});

const studentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  studentCode: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: false, enum: ['Male', 'Female', 'Other'] },
  contact: { type: contactSchema, required: false }
}, {
  timestamps: true,
  collection: 'students'
});

module.exports = mongoose.model('Student', studentSchema);
