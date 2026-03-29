import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AdminDashboardContainer,
    Content,
    TopContent,
    BottomContent,
    Section,
    SectionTitle,
    CardContainer,
    Card,
    CardContent,
    CardTitle    
} from "../../styles/DashboardStyles";

const AdminDashboard = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0 });

    useEffect(() => {
        fetchEvents();
        fetchAnnouncements();
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const studentRes = await axios.get('http://localhost:8080/api/students');
            const teacherRes = await axios.get('http://localhost:8080/api/v1/teachers/getall');
            const classRes = await axios.get('http://localhost:8080/api/v1/class/getall');
            setCounts({
                students: Array.isArray(studentRes.data) ? studentRes.data.length : 0,
                teachers: teacherRes.data.teachers?.length || 0,
                classes: classRes.data.classes?.length || 0
            });
        } catch (error) {
            console.error('Error fetching counts: ', error);
        }
    }

    const fetchEvents = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/events/getall');
            setEvents(response.data.events || []);
        }catch (error){
            console.error('Error fetching events: ', error);
        }
    };

    const fetchAnnouncements = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/announcements/getall');
            setAnnouncements(response.data.announcements || []);
        }catch (error){
            console.error('Error fetching announcements: ', error);
        }
    };

    return(
        <AdminDashboardContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <TopContent>
                    <Section>
                        <SectionTitle>Overview Dashboard</SectionTitle>
                        <CardContainer>
                            <Card>
                                <CardTitle>Total Students</CardTitle>
                                <CardContent>{counts.students}</CardContent>
                            </Card>
                            <Card>
                                <CardTitle>Total Teachers</CardTitle>
                                <CardContent>{counts.teachers}</CardContent>
                            </Card>
                            <Card>
                                <CardTitle>Total Classes</CardTitle>
                                <CardContent>{counts.classes}</CardContent>
                            </Card>
                        </CardContainer>
                    </Section>

                    <Section>
                        <SectionTitle>Upcoming Events</SectionTitle>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {events.slice(0, 5).map(e => <li key={e._id || e.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{e.events}</li>)}
                        </ul>
                    </Section>
                </TopContent>

                <BottomContent>
                    <Section style={{ flex: 1 }}>
                        <SectionTitle>Latest Announcements</SectionTitle>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {announcements.slice(0, 5).map(a => (
                                <li key={a._id || a.id} style={{ padding: '10px' }}>
                                    <strong>{a.announcement}</strong>
                                </li>
                            ))}
                        </ul>
                    </Section>
                </BottomContent>
            </Content>
        </AdminDashboardContainer>
    )
};

export default AdminDashboard;