import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/assignments`;
const SUBMISSION_API_URL = `${BASE_URL}/api/v1/submissions`;
const VIOLATION_API_URL = `${BASE_URL}/api/v1/violations`;

// Get all assignments
export const getAllAssignments = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.assignments || [];
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    // Normalize: backend returns raw document, normalize _id to id
    const data = response.data;
    if (data && !data.id && data._id) {
        data.id = data._id;
    }
    return data;
};

// Create new assignment
export const createAssignment = async (assignmentData) => {
    const response = await axios.post(API_URL, assignmentData);
    return response.data;
};

// Update assignment
export const updateAssignment = async (id, assignmentData) => {
    const response = await axios.put(`${API_URL}/${id}`, assignmentData);
    return response.data;
};

// Delete assignment
export const deleteAssignment = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Get assignments by teacher ID
export const getAssignmentsByTeacher = async (teacherId) => {
    const response = await axios.get(`${API_URL}/teacher/${teacherId}`);
    const assignments = response.data.assignments || [];
    // Normalize _id → id for each assignment
    return assignments.map(a => ({ ...a, id: a.id || a._id }));
};

// Get assignments by student ID (supports optional className for improved matching)
export const getAssignmentsByStudent = async (studentId, className) => {
    const response = await axios.get(`${API_URL}/student/${studentId}`, {
        params: { className }
    });
    const assignments = response.data.assignments || response.data || [];
    return Array.isArray(assignments)
        ? assignments.map(a => ({ ...a, id: a.id || a._id }))
        : [];
};

// Submit assignment - new endpoint
export const submitAssignment = async (submissionData) => {
    const response = await axios.post(`${SUBMISSION_API_URL}/submit`, submissionData);
    return response.data;
};

// Get submissions by assignment (for teacher)
export const getSubmissionsByAssignment = async (assignmentId) => {
    const response = await axios.get(`${SUBMISSION_API_URL}/assignment/${assignmentId}`);
    return response.data.submissions || [];
};

// Get my submission for an assignment (for student)
export const getMySubmission = async (assignmentId, studentId) => {
    const response = await axios.get(`${SUBMISSION_API_URL}/assignment/${assignmentId}/student/${studentId}`);
    return response.data.submission;
};

// Grade submission
export const gradeSubmission = async (submissionId, score, feedback) => {
    const response = await axios.post(`${SUBMISSION_API_URL}/${submissionId}/grade`, {
        score,
        feedback
    });
    return response.data;
};

// Get anti-cheat violations by assignment
export const getViolationsByAssignment = async (assignmentId) => {
    const response = await axios.get(`${VIOLATION_API_URL}/assignment/${assignmentId}`);
    return response.data || [];
};

