const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  teacherCode: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false }
}, {
  timestamps: true,
  collection: 'teachers'
});

module.exports = mongoose.model('Teacher', teacherSchema);
