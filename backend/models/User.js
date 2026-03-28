const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['STUDENT', 'TEACHER', 'ADMIN'] },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
