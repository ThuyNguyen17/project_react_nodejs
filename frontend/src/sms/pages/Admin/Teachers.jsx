import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    TeachersContainer,
    Content,
    TeachersContent,
    TeachersHeader,
    TeacherList,
    TeacherItem,
    AddTeacherForm,
    AddTeacherInput,
    AddTeacherButton
} from "../../styles/TeachersStyles";

const Teachers = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [newTeacher, setNewTeacher] = useState({fullName: '', email: '', teacherCode: ''});
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try{
            const response = await axios.get('/api/v1/teachers/getall');
            setTeachers(response.data.teachers || []);
        }catch (error){
            console.error('Error fetching teachers: ', error);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if(newTeacher.fullName.trim() !== '' && newTeacher.email.trim() !== ''){
            try{
                await axios.post('/api/v1/teachers', newTeacher);
                fetchTeachers(); // Refresh list
                setNewTeacher({ fullName: '', email: '', teacherCode: '' });
            }catch (error){
                console.error("Error adding teacher: ", error);
            }
        }
    };

    const handleDeleteTeacher = async (id) => {
        try {
            await axios.delete(`/api/v1/teachers/${id}`);
            fetchTeachers();
        } catch (error) {
            console.error("Error deleting teacher: ", error);
        }
    };

    return(
        <TeachersContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <TeachersContent>
                    <TeachersHeader>Teachers</TeachersHeader>
                    <AddTeacherForm onSubmit={handleAddTeacher}>
                        <AddTeacherInput
                            type="text"
                            placeholder="Enter Teacher Full Name"
                            value={newTeacher.fullName}
                            onChange={(e) => setNewTeacher({...newTeacher, fullName: e.target.value})}
                            required
                        />
                        <AddTeacherInput
                            type="email"
                            placeholder="Enter Teacher Email"
                            value={newTeacher.email}
                            onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                            required
                        />
                        <AddTeacherInput
                            type="text"
                            placeholder="Enter Teacher Code"
                            value={newTeacher.teacherCode}
                            onChange={(e) => setNewTeacher({...newTeacher, teacherCode: e.target.value})}
                            required
                        />
                        <AddTeacherButton type="submit">Add Teacher</AddTeacherButton>
                    </AddTeacherForm>

                    <TeacherList>
                        {teachers.map((teacher) => (
                            <TeacherItem key={teacher._id || teacher.id}>
                                {teacher.fullName} - {teacher.email} - {teacher.teacherCode}
                                <button onClick={() => handleDeleteTeacher(teacher._id || teacher.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </TeacherItem>
                        ))}
                    </TeacherList>
                </TeachersContent>
            </Content>
        </TeachersContainer>
    )
}

export default Teachers;