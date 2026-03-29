import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ClassesContainer,
    Content,
    ClassesContent,
    ClassHeader,
    ClassList,
    ClassItem,
    AddClassButton,
    AddClassForm,
    AddClassInput,
} from "../../styles/ClassesStyles";

const TeachingAssignments = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectName, setSubjectName] = useState('');

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
        fetchAssignments();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('/api/v1/teachers/getall');
            setTeachers(response.data.teachers || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/api/v1/class/getall');
            setClasses(response.data.classes || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('/api/v1/teaching-assignments/all');
            setAssignments(response.data || []);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        if (selectedTeacher && selectedClass && subjectName.trim()) {
            try {
                const teacherObj = teachers.find(t => (t._id || t.id) === selectedTeacher);
                const classObj = classes.find(c => (c._id || c.id) === selectedClass);
                
                await axios.post('/api/v1/teaching-assignments', {
                    teacherId: selectedTeacher,
                    className: `${classObj.gradeLevel}${classObj.className}`,
                    subjectName: subjectName
                });
                
                setSubjectName('');
                fetchAssignments();
                alert('Teaching assignment created!');
            } catch (error) {
                console.error('Error creating assignment:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        // Backend doesn't have a delete endpoint for this yet, but we'll show it in UI
        alert("Delete functionality not implemented in backend yet.");
    };

    return (
        <ClassesContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ClassesContent>
                    <ClassHeader>Teaching Assignments Management</ClassHeader>
                    <AddClassForm onSubmit={handleAddAssignment}>
                        <select 
                            value={selectedTeacher} 
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            required
                            style={{ padding: '10px', marginRight: '10px', borderRadius: '4px' }}
                        >
                            <option value="">Select Teacher...</option>
                            {teachers.map(t => <option key={t._id || t.id} value={t._id || t.id}>{t.fullName} ({t.teacherCode})</option>)}
                        </select>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)}
                            required
                            style={{ padding: '10px', marginRight: '10px', borderRadius: '4px' }}
                        >
                            <option value="">Select Class...</option>
                            {classes.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.gradeLevel}{c.className}</option>)}
                        </select>
                        <AddClassInput 
                            type="text"
                            placeholder="Subject Name (e.g. Mathematics)"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            required
                        />
                        <AddClassButton type="submit">Assign</AddClassButton>
                    </AddClassForm>

                    <ClassList>
                        {assignments.map((asgn) => {
                            const teacher = teachers.find(t => (t._id || t.id) === asgn.teacherId);
                            return (
                                <ClassItem key={asgn._id || asgn.id}>
                                    <strong>{teacher ? teacher.fullName : asgn.teacherId}</strong>: {asgn.className} - {asgn.subjectName}
                                </ClassItem>
                            );
                        })}
                    </ClassList>
                </ClassesContent>
            </Content>
        </ClassesContainer>
    );
};

export default TeachingAssignments;
