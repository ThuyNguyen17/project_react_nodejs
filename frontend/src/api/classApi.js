import axios from 'axios';
import { BASE_URL, API_BASE_URL } from './config';

// ===== CLASS APIs =====

// Get all classes
export const getAllClasses = async () => {
    const response = await axios.get(`${API_BASE_URL}/class/getall`);
    return response.data.classes || [];
};

// Get class by ID
export const getClassById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/classes/${id}`);
    return response.data;
};

// Create new class
export const createClass = async (classData) => {
    const response = await axios.post(`${API_BASE_URL}/class`, classData);
    return response.data;
};

// Update class
export const updateClass = async (id, classData) => {
    const response = await axios.put(`${API_BASE_URL}/class/${id}`, classData);
    return response.data;
};

// Delete class
export const deleteClass = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/class/${id}`);
    return response.data;
};

// Get classes by teacher ID - sử dụng teaching-assignments
export const getClassesByTeacher = async (teacherId) => {
    try {
        // Lấy teaching assignments của giáo viên
        const response = await axios.get(`${API_BASE_URL}/teaching-assignments/teacher/${teacherId}`);
        const assignments = response.data || [];
        
        // Trích xuất danh sách lớp từ assignments (dùng classId thay vì className sau refactor)
        const classIds = [...new Set(assignments.map(a => a.classId).filter(id => id))];
        
        // Lấy tất cả classes và filter theo className
        const allClassesResponse = await axios.get(`${API_BASE_URL}/class/getall`);
        const allClasses = allClassesResponse.data.classes || [];
        
        // Map classId với class objects
        const teacherClasses = classIds.map(classId => {
            // Tìm class object từ allClasses
            const classObj = allClasses.find(c => c.id === classId);
            
            const assignment = assignments.find(a => a.classId === classId);
            
            // Nếu tìm thấy class object, bổ sung thêm thông tin
            if (classObj) {
                const className = classObj.displayName || classObj.className || classId;
                return {
                    ...classObj,
                    id: classObj.id || classId,
                    name: className,
                    className: className,
                    subject: assignment?.subjectName || 'Chưa có môn',
                    room: classObj.room || 'L2-01',
                    studentCount: classObj.studentCount || 30
                };
            }
            
            // Nếu không tìm thấy, tạo object mới
            return {
                id: classId,
                name: classId,
                className: classId,
                subject: assignment?.subjectName || 'Chưa có môn',
                room: 'L2-01',
                studentCount: 30
            };
        });
        
        return teacherClasses;
    } catch (err) {
        console.error("Error fetching teacher classes:", err);
        return [];
    }
};

// ===== STUDENT APIs =====

// Get all students
export const getAllStudents = async () => {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data || [];
};

// Get student by ID
export const getStudentById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`);
    return response.data;
};

// Get students in class - sử dụng student_classes collection
export const getStudentsInClass = async (classId) => {
    try {
        // Lấy tất cả students
        const allStudentsResponse = await axios.get(`${API_BASE_URL}/students`);
        const allStudents = allStudentsResponse.data || [];
        
        // Lấy student_classes mapping
        const response = await axios.get(`${API_BASE_URL}/student-classes`);
        const studentClasses = response.data || [];
        
        // Lọc students thuộc classId
        const classStudentIds = studentClasses
            .filter(sc => sc.classId === classId || sc.classId === classId.toString())
            .map(sc => sc.studentId);
        
        const studentsInClass = allStudents.filter(s => 
            classStudentIds.includes(s.id) || classStudentIds.includes(s.userId)
        );
        
        // Format dữ liệu
        return studentsInClass.map(s => ({
            id: s.id,
            fullName: s.fullName,
            studentCode: s.studentCode || s.studentId || `HS${s.id?.slice(-3) || '000'}`,
            email: s.contact?.email || `${s.studentCode}@school.edu.vn`,
            phone: s.contact?.phone || 'N/A',
            dob: s.dateOfBirth || 'N/A'
        }));
    } catch (err) {
        console.error("Error fetching students in class:", err);
        return [];
    }
};

// Import students to class
export const importStudentsToClass = async (classId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    
    const response = await axios.post(`${API_BASE_URL}/students/import-with-class`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Export students from class
export const exportStudentsFromClass = async (classId) => {
    const response = await axios.get(`${API_BASE_URL}/students/export`, {
        responseType: 'blob'
    });
    return response.data;
};

// ===== TEACHER APIs =====

// Get all teachers
export const getAllTeachers = async () => {
    const response = await axios.get(`${API_BASE_URL}/teachers/getall`);
    return response.data.teachers || [];
};

// Get teacher by ID
export const getTeacherById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
    return response.data;
};
