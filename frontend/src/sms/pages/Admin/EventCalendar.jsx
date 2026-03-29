import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    EventCalendarContainer,
    Content,
    CalendarContainer,
    Events,
    Event,
    AddEventForm,
    EventInput,
    AddEventButton,
    ErrorText
} from "../../styles/EventCalendarStyles";

const EventCalendar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [events, setEvents] = useState([]);
    const [newEventText, setNewEventText] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try{
            const response = await axios.get('/api/v1/events/getall');
            setEvents(response.data.events || []);
        }catch (error){
            console.error('Error fetching events: ', error);
        }
    };

    const addEvent = async (e) => {
        e.preventDefault();
        try{
            await axios.post('/api/v1/events', {
                events: newEventText, // Matches backend 'events' field
            });
            setNewEventText('');
            fetchEvents();
        }catch (error){
            console.error("Error adding event: ", error);
            setError(error.response?.data?.error || 'Error adding event');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    return(
        <EventCalendarContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <h1>Event and Calendar</h1>               
                <div>Current Time: {new Date().toLocaleString()}</div>
                <CalendarContainer>
                    Calendar view placeholder
                </CalendarContainer>
                
                <AddEventForm onSubmit={addEvent}>
                    <h2>Add New Event</h2>
                    <EventInput 
                        type="text"
                        value={newEventText}
                        onChange={(e) => setNewEventText(e.target.value)}
                        placeholder="Enter event"
                        required
                    />
                    <AddEventButton type="submit">Add Event</AddEventButton>
                    {error && <ErrorText>{error}</ErrorText>}
                </AddEventForm>

                <Events>
                    <h2>Event List</h2>
                    {Array.isArray(events) && events.map((event) => (
                        <Event key={event._id || event.id}>
                            {event.events}
                            <button onClick={() => handleDelete(event._id || event.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </Event>
                    ))}
                </Events>
            </Content>
        </EventCalendarContainer>
    )
}

export default EventCalendar