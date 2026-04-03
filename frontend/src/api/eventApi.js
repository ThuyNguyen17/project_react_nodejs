import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/events`;

// Get all events
export const getAllEvents = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.events || [];
};

// Get active events
export const getActiveEvents = async () => {
    const response = await axios.get(`${API_URL}/active`);
    return response.data.events || [];
};

// Get events by audience
export const getEventsByAudience = async (targetAudience) => {
    const response = await axios.get(`${API_URL}/audience/${targetAudience}`);
    return response.data.events || [];
};

// Alias for TeacherScanner or StudentEvents if needed
export const getEventsForAudience = getEventsByAudience;

// Get event by ID
export const getEventById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new event
export const createEvent = async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Get events by type
export const getEventsByType = async (eventType) => {
    const response = await axios.get(`${API_URL}/type/${eventType}`);
    return response.data.events || [];
};
