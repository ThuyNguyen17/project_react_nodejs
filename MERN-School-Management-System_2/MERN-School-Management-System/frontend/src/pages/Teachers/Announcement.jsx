import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AnnouncementContainer,
    Content,
    Title,
    AnnouncementForm,
    FormGroup,
    Label,
    TextArea,
    Button,
    AnnouncementList,
    AnnouncementItem,
    AnnouncementContent
} from "../../styles/AnnouncementStyles";

const AnnouncementSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/announcements/getall');
            setAnnouncements(response.data.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements: ', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/v1/announcements', {
                announcement: announcementText
            });
            setAnnouncementText('');
            fetchAnnouncements();
            alert('Announcement sent!');
        } catch (error) {
            console.error("Error adding Announcement: ", error);
            alert('Failed to send announcement.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this announcement?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                console.error('Error deleting announcement: ', error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/v1/announcements/${editingAnnouncement.id}`, editingAnnouncement);
            setEditingAnnouncement(null);
            fetchAnnouncements();
            alert('Announcement updated!');
        } catch (error) {
            console.error('Error updating announcement: ', error);
        }
    };

    return (
        <AnnouncementContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <Title>Announcement Management</Title>
                
                {editingAnnouncement ? (
                    <AnnouncementForm onSubmit={handleUpdate}>
                        <FormGroup>
                            <Label>Edit Announcement</Label>
                            <TextArea
                                value={editingAnnouncement.announcement}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, announcement: e.target.value })}
                                required
                                rows={4}
                            />
                        </FormGroup>
                        <Button type="submit">Update</Button>
                        <Button type="button" onClick={() => setEditingAnnouncement(null)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</Button>
                    </AnnouncementForm>
                ) : (
                    <AnnouncementForm onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="announcement">New Announcement</Label>
                            <TextArea
                                id='announcement'
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                                required
                                rows={4}
                                placeholder="Type your announcement here..."
                            />
                        </FormGroup>
                        <Button type="submit">Send Announcement</Button>
                    </AnnouncementForm>
                )}

                <Title as="h3" style={{ marginTop: '30px' }}>Past Announcements</Title>
                <AnnouncementList>
                    {announcements.map((item) => (
                        <AnnouncementItem key={item.id}>
                            <AnnouncementContent>{item.announcement}</AnnouncementContent>
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => setEditingAnnouncement(item)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </AnnouncementItem>
                    ))}
                </AnnouncementList>
            </Content>
        </AnnouncementContainer>
    );
};

export default AnnouncementSection;