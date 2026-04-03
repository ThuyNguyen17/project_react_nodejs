const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    teachingAssignmentId: { type: String },
    week: { type: Number },
    dayOfWeek: { type: String, enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] },
    period: { type: Number },
    room: { type: String },
    note: { type: String },
    actualDate: { type: Date }
}, { collection: 'timetables', timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
