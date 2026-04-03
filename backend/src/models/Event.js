const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    events: { type: String },
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String },
    organizer: { type: String },
    organizerId: { type: String },
    eventType: { type: String },
    targetAudience: { type: String },
    status: { type: String },
    isActive: { type: Boolean, default: true },
    notes: { type: String },
    maxParticipants: { type: Number },
    currentParticipants: { type: Number }
}, { collection: 'events', timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
