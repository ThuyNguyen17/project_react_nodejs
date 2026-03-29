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

const Attendance = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/students');
            const students = response.data || [];
            initializeAttendanceData(students);
        } catch (error) {
            console.error('Error fetching students: ', error);
        }
    };

    const initializeAttendanceData = (students) => {
        const initialAttendanceData = students.map((student) => ({
            id: student._id || student.id,
            name: student.fullName,
            status: 'Present'
        }));
        setAttendanceData(initialAttendanceData)
    };

    const handleStatusChange = (id, status) => {
        const updatedData = attendanceData.map((record) => {
            if (record.id === id) {
                return { ...record, status }
            }
            return record
        });
        setAttendanceData(updatedData)
    };

    const handleSubmit = async () => {
        try {
            // Note: Currently pointing to a dummy endpoint as backend requires a session-based recording
            const response = await axios.post('http://localhost:8080/api/attendance/bulk', { attendanceData });
            alert("Attendance Submitted!");
        } catch (error) {
            console.error('Error submitting attendance data: ', error)
            alert("Submission failed (API endpoint may be missing)");
        }
    };

    return (
        <AttendanceContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AttendanceContent>
                    <AttendanceHeader>Attendance Management</AttendanceHeader>
                    <AttendanceList>
                        {attendanceData.map((student, index) => (
                            <React.Fragment key={student.id}>
                                <AttendanceItem>
                                    <StudentName>{student.name}</StudentName>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ student.status === "Present"}
                                            onChange={ () => handleStatusChange(student.id, "Present") }
                                        />
                                        Present
                                    </CheckboxLabel>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ student.status === "Absent"}
                                            onChange={ () => handleStatusChange(student.id, "Absent") }
                                        />
                                        Absent
                                    </CheckboxLabel>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            checked={ student.status === "Absent with Apology"}
                                            onChange={ () => handleStatusChange(student.id, "Absent with Apology") }
                                        />
                                        Absent with apology
                                    </CheckboxLabel>
                                </AttendanceItem>
                                { index !== attendanceData.length - 1 && <Divider /> }
                            </React.Fragment>
                        ))}
                    </AttendanceList>
                    <SubmitButton onClick={ handleSubmit }>Submit Changes</SubmitButton>
                </AttendanceContent>
            </Content>
        </AttendanceContainer>
    )
};

export default Attendance;