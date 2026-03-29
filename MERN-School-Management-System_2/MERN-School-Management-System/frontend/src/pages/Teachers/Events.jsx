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

const EventSection = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/events/getall');
            setEvents(response.data.events || []);
        }catch (error){
            console.error('Error fetching events: ', error);
        }
    };

    const addEvent = async (e) => {
        e.preventDefault();
        if(!newEvent.trim()) return;
        try{
            await axios.post('http://localhost:8080/api/v1/events', {
                event: newEvent,
            });
            setNewEvent('');
            fetchEvents();
            alert('Event added!');
        }catch (error){
            console.error("Error adding event: ", error);
            setError('Error adding event. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event: ', error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/v1/events/${editingEvent.id}`, editingEvent);
            setEditingEvent(null);
            fetchEvents();
            alert('Event updated!');
        } catch (error) {
            console.error('Error updating event: ', error);
        }
    };

    return(
        <EventCalendarContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <h1>Event and Calendar</h1>               
                <CalendarContainer>
                    <p>Coming Soon: Interactive Calendar Integration</p>
                </CalendarContainer>

                {editingEvent ? (
                    <AddEventForm onSubmit={handleUpdate}>
                        <h2>Edit Event</h2>
                        <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                            <EventInput 
                                type="text"
                                value={editingEvent.event}
                                onChange={(e) => setEditingEvent({ ...editingEvent, event: e.target.value })}
                            />
                            <AddEventButton type="submit">Update</AddEventButton>
                            <AddEventButton type="button" onClick={() => setEditingEvent(null)} style={{ backgroundColor: '#6c757d' }}>Cancel</AddEventButton>
                        </div>
                    </AddEventForm>
                ) : (
                    <AddEventForm onSubmit={addEvent}>
                        <h2>Add New Event</h2>
                        <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                            <EventInput 
                                type="text"
                                value={newEvent}
                                onChange={(e) => setNewEvent(e.target.value)}
                                placeholder="Describe the event..."
                            />
                            <AddEventButton type="submit">Add Event</AddEventButton>
                        </div>
                    </AddEventForm>
                )}
                {error && <ErrorText>{error}</ErrorText>}

                <Events>
                    <h2>Upcoming Events</h2>
                    {events.length > 0 ? events.map((item, index) => (
                        <Event key={item.id || index}>
                            <div>{item.event}</div>
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => setEditingEvent(item)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </Event>
                    )) : <p>No events scheduled.</p>}
                </Events>
            </Content>
        </EventCalendarContainer>
    )
}

export default EventSection