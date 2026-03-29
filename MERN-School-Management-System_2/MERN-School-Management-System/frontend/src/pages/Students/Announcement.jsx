import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AnnouncementContainer,
    SidebarContainer,
    Content,    
    AnnouncementHeader,
    AnnouncementList,
    AnnouncementItem,
    AnnouncementTitle,
    AnnouncementContent
} from "../../styles/AnnouncementStyles";

const AnnouncementSection = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

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

    return(
        <AnnouncementContainer>
            <SidebarContainer>
                <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            </SidebarContainer>
            <Content isOpen={isOpen}>
                <AnnouncementHeader>Announcements</AnnouncementHeader>
                <AnnouncementList>
                    {announcements.map((item) => (
                        <AnnouncementItem key={item.id}>
                            <AnnouncementTitle>{item.announcement}</AnnouncementTitle>
                        </AnnouncementItem>
                    ))}
                </AnnouncementList>
            </Content>
        </AnnouncementContainer>
    )
}

export default AnnouncementSection