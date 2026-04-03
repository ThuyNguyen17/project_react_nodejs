const mongoose = require('mongoose');

const ClassInfoSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String }
}, { _id: false });

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    announcement: { type: String },
    teacherId: { type: String },
    academicYearId: { type: String },
    classId: { type: String },
    date: { type: Date },
    priority: { type: String },
    targetAudience: { type: String },
    targetRole: { type: String },
    classes: [ClassInfoSchema]
}, { collection: 'announcements', timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
