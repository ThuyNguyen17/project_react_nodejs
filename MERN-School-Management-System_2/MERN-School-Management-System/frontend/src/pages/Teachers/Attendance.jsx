import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AttendanceContainer,
    Content,
    AttendanceContent,
    AttendanceHeader,
    AttendanceList,
    AttendanceItem,
    StudentName,
    CheckboxLabel,
    Divider,
    SubmitButton
} from "../../styles/AttendanceStyles";

const CheckAttendanceSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [currentSession, setCurrentSession] = useState(null);
    const [checkins, setCheckins] = useState([]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        fetchAssignments();
        return () => clearInterval(timer);
    }, [timer]);

    const fetchAssignments = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8080/api/v1/teaching-assignments/teacher/${user.teacherId || user.userId}`);
                setAssignments(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching assignments: ', error);
        }
    };

    const startSession = async () => {
        if (!selectedAssignment) return alert("Vui lòng chọn lớp học!");
        try {
            const response = await axios.post('http://localhost:8080/api/attendance/session/start', {
                assignmentId: selectedAssignment,
                date: new Date().toISOString().split('T')[0],
                period: 1, // Defaulting to 1 for demo
                semester: 1
            });
            setCurrentSession(response.data);
            generateToken(response.data.id);
            startMonitoring(response.data.id);
        } catch (error) {
            console.error('Error starting session: ', error);
        }
    };

    const generateToken = async (sessionId) => {
        const token = Math.random().toString(36).substring(2, 10).toUpperCase();
        try {
            const response = await axios.post(`http://localhost:8080/api/attendance/session/${sessionId}/token`, { token });
            setCurrentSession(response.data);
        } catch (error) {
            console.error('Error generating token:', error);
        }
    };

    const startMonitoring = (sessionId) => {
        const t = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/attendance/session/${sessionId}/attendances`);
                setCheckins(response.data);
            } catch (error) {
                console.error('Error fetching attendances:', error);
            }
        }, 5000);
        setTimer(t);
    };

    const closeSession = async () => {
        if (!currentSession) return;
        try {
            await axios.post(`http://localhost:8080/api/attendance/session/${currentSession.id}/close`);
            clearInterval(timer);
            setTimer(null);
            alert("Session closed!");
            setCurrentSession(null);
            setCheckins([]);
        } catch (error) {
            console.error('Error closing session:', error);
        }
    };

    return (
        <AttendanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AttendanceContent>
                    <AttendanceHeader>Attendance Management</AttendanceHeader>
                    
                    {!currentSession ? (
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3>Start New Session</h3>
                            <select 
                                onChange={(e) => setSelectedAssignment(e.target.value)}
                                style={{ padding: '10px', width: '300px', marginBottom: '15px', borderRadius: '4px' }}
                            >
                                <option value="">Select a Class...</option>
                                {assignments.map(a => (
                                    <option key={a.id} value={a.id}>{a.className} - {a.subjectName}</option>
                                ))}
                            </select>
                            <br />
                            <SubmitButton onClick={startSession}>Start Session</SubmitButton>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                                <h3>Active Session</h3>
                                <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#4b83b5', textAlign: 'center', padding: '20px', border: '2px dashed #4b83b5', margin: '20px 0' }}>
                                    {currentSession.qrToken || "WAITING..."}
                                </div>
                                <p style={{ textAlign: 'center' }}>Học sinh quét mã QR hoặc nhập mã này để điểm danh.</p>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <SubmitButton onClick={() => generateToken(currentSession.id)}>Refresh Token</SubmitButton>
                                    <SubmitButton onClick={closeSession} style={{ backgroundColor: '#dc3545' }}>Close Session</SubmitButton>
                                </div>
                            </div>

                            <div style={{ flex: '1.5', minWidth: '400px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                                <h3>Checked-in Students ({checkins.length})</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                            <th style={{ padding: '10px' }}>Tên</th>
                                            <th style={{ padding: '10px' }}>Lớp</th>
                                            <th style={{ padding: '10px' }}>Giờ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkins.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px' }}>{c.studentName}</td>
                                                <td style={{ padding: '10px' }}>{c.studentClass}</td>
                                                <td style={{ padding: '10px' }}>{c.checkInTime}</td>
                                            </tr>
                                        ))}
                                        {checkins.length === 0 && (
                                            <tr>
                                                <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Chưa có sinh viên nào điểm danh.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </AttendanceContent>
            </Content>
        </AttendanceContainer>
    );
}

export default CheckAttendanceSection;