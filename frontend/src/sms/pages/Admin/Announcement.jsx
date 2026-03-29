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

const Announcement = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/v1/announcements/getall');
            setAnnouncements(response.data.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements: ', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/announcements', {
                announcement: announcementText
            });
            setAnnouncementText('');
            fetchAnnouncements();
        } catch (error) {
            console.error("Error adding Announcement: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error("Error deleting Announcement: ", error);
        }
    };

    return (
        <AnnouncementContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <Title>Announcement</Title>
                <AnnouncementForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="announcement">Announcement Message</Label>
                        <TextArea
                            id='announcement'
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            required
                            rows={4}
                        />
                    </FormGroup>
                    <Button type="submit">Send Announcement</Button>
                </AnnouncementForm>

                <h2>Announcement List</h2>
                <AnnouncementList>
                    {Array.isArray(announcements) && announcements.map((ann) => (
                        <AnnouncementItem key={ann._id || ann.id}>
                            <AnnouncementContent>{ann.announcement}</AnnouncementContent>
                            <button onClick={() => handleDelete(ann._id || ann.id)} style={{ marginTop: '5px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}>Delete</button>
                        </AnnouncementItem>
                    ))}
                </AnnouncementList>
            </Content>
        </AnnouncementContainer>
    )
}

export default Announcement