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
    AssignmentTitle,
    AddAssignmentButton,
    AddAssignmentForm,
    AddAssignmentInput,
    AddAssignmentTextArea
} from "../../styles/AssignmentsStyles";

const AssignmentSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', grade: '', deadline: '' });
    const [assignments, setAssignments] = useState([]);
    const [editingAssignment, setEditingAssignment] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/assignments/getall');
            setAssignments(response.data.assignments || []);
        } catch (error) {
            console.error('Error fetching assignments: ', error);
        }
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        const { title, description, grade, deadline } = newAssignment;
        if (!title.trim() || !description.trim() || !grade.trim() || !deadline.trim()) {
            alert('Please fill in all fields (Title, Description, Grade, Deadline) before adding an assignment.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/v1/assignments', newAssignment);
            fetchAssignments();
            setNewAssignment({ title: '', description: '', grade: '', deadline: '' });
            alert('Assignment created successfully!');
        } catch (error) {
            console.error("Error adding assignment: ", error);
            alert('Failed to create assignment. Please check your backend connection.');
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/assignments/${id}`);
                fetchAssignments();
            } catch (error) {
                console.error('Error deleting assignment: ', error);
            }
        }
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/v1/assignments/${editingAssignment.id}`, editingAssignment);
            setEditingAssignment(null);
            fetchAssignments();
            alert('Assignment updated successfully!');
        } catch (error) {
            console.error('Error updating assignment: ', error);
        }
    };

    return (
        <AssignmentsContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <AssignmentsContent>
                    <AssignmentsHeader>Assignments Management</AssignmentsHeader>
                    
                    {editingAssignment ? (
                        <AddAssignmentForm onSubmit={handleUpdateAssignment}>
                            <h3>Edit Assignment</h3>
                            <AddAssignmentInput
                                type="text"
                                value={editingAssignment.title}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                value={editingAssignment.description}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                value={editingAssignment.grade}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, grade: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                value={editingAssignment.deadline}
                                onChange={(e) => setEditingAssignment({ ...editingAssignment, deadline: e.target.value })}
                            />
                            <AddAssignmentButton type="submit">Update</AddAssignmentButton>
                            <AddAssignmentButton type="button" onClick={() => setEditingAssignment(null)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</AddAssignmentButton>
                        </AddAssignmentForm>
                    ) : (
                        <AddAssignmentForm onSubmit={handleAddAssignment}>
                            <AddAssignmentInput
                                type="text"
                                placeholder="Enter Assignment Title"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                placeholder="Enter Assignment Description"
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                placeholder="Enter Assignment Grade"
                                value={newAssignment.grade}
                                onChange={(e) => setNewAssignment({ ...newAssignment, grade: e.target.value })}
                            />
                            <AddAssignmentInput
                                type="text"
                                placeholder="Enter Assignment Deadline"
                                value={newAssignment.deadline}
                                onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                            />
                            <AddAssignmentButton type="submit">Add Assignment</AddAssignmentButton>
                        </AddAssignmentForm>
                    )}

                    <AssignmentList>
                        {assignments.map((assignment) => (
                            <AssignmentItem key={assignment.id}>
                                <div>
                                    <strong>{assignment.title}</strong>: {assignment.description} (Grade: {assignment.grade}, Deadline: {assignment.deadline})
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => setEditingAssignment(assignment)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDeleteAssignment(assignment.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </AssignmentItem>
                        ))}
                    </AssignmentList>
                </AssignmentsContent>
            </Content>
        </AssignmentsContainer>
    )
}

export default AssignmentSection