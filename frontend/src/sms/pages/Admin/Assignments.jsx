import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    AssignmentsContainer,
    Content,
    AssignmentsContent,
    AssignmentsHeader,
    AssignmentList,
    AssignmentItem,
    AddAssignmentForm,
    AddAssignmentInput,
    AddAssignmentTextArea,
    AddAssignmentButton
} from "../../styles/AssignmentsStyles";

const Assignments = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [newAssignment, setNewAssignment] = useState({title: '', description: '', grade: '', deadline: ''});
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try{
            const response = await axios.get('/api/v1/assignments/getall');
            setAssignments(response.data.assignments || []);
        }catch (error){
            console.error('Error fetching assignments: ', error);
        }
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        const { title, description, grade, deadline } = newAssignment;
        if(title.trim() !== '' && description.trim() !== '' && grade.trim() !== '' && deadline.trim() !== ''){
            try{
                await axios.post('/api/v1/assignments', {
                    ...newAssignment,
                    deadline: new Date(deadline).toISOString().split('T')[0] // Format for backend LocalDate
                });
                fetchAssignments();
                setNewAssignment({ title: '', description: '', grade: '', deadline: ''});
            }catch (error){
                console.error("Error adding assignment: ", error);
            }
        }
    };

    const handleDeleteAssignment = async (id) => {
        try {
            await axios.delete(`/api/v1/assignments/${id}`);
            fetchAssignments();
        } catch (error) {
            console.error("Error deleting assignment: ", error);
        }
    };

    return(
        <AssignmentsContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AssignmentsContent>
                    <AssignmentsHeader>Assignments</AssignmentsHeader>
                    <AddAssignmentForm onSubmit={handleAddAssignment}>
                        <AddAssignmentInput
                            type="text"
                            placeholder="Enter Assignment Title"
                            value={newAssignment.title}
                            onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                            required
                        />
                        <AddAssignmentTextArea
                            placeholder="Enter Assignment Description"
                            value={newAssignment.description}
                            onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                            required
                        />
                        <AddAssignmentInput
                            type="text"
                            placeholder="Enter Grade (e.g. 10)"
                            value={newAssignment.grade}
                            onChange={(e) => setNewAssignment({...newAssignment, grade: e.target.value})}
                            required
                        />
                        <AddAssignmentInput
                            type="date"
                            placeholder="Enter Assignment Deadline"
                            value={newAssignment.deadline}
                            onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                            required
                        />
                        <AddAssignmentButton type="submit">Add Assignment</AddAssignmentButton>
                    </AddAssignmentForm>

                    <AssignmentList>
                        {Array.isArray(assignments) && assignments.map((assignment) => (
                            <AssignmentItem key={assignment._id || assignment.id}>
                                <strong>{assignment.title}: </strong>
                                {assignment.description}, {assignment.grade}, {assignment.deadline}
                                <button onClick={() => handleDeleteAssignment(assignment._id || assignment.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </AssignmentItem>
                        ))}
                    </AssignmentList>
                </AssignmentsContent>
            </Content>
        </AssignmentsContainer>
    )
}

export default Assignments