const Event = require('../models/Event');

const addEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save();
};

const getAllEvents = async () => {
    return await Event.find();
};

const getEventById = async (id) => {
    return await Event.findById(id);
};

const updateEvent = async (id, eventData) => {
    return await Event.findByIdAndUpdate(id, eventData, { new: true });
};

const deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id);
};

const getActiveEvents = async () => {
    return await Event.find({ isActive: true }).sort({ date: 1 });
};

const getEventsByType = async (eventType) => {
    return await Event.find({ eventType, isActive: true }).sort({ date: 1 });
};

const getEventsByAudiences = async (audiences) => {
    return await Event.find({ targetAudience: { $in: audiences }, isActive: true }).sort({ date: 1 });
};

module.exports = {
    addEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getActiveEvents,
    getEventsByType,
    getEventsByAudiences
};
