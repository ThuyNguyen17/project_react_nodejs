const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'STUDENT', 'TEACHER'] },
    isActive: { type: Boolean, default: true }
}, { collection: 'users', timestamps: true });

module.exports = mongoose.model('User', UserSchema);
