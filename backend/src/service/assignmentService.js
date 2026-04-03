const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const announcementService = require('./announcementService');

const normalize = (s) => {
    if (!s) return '';
    return s.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
}

const createAssignmentNotifications = async (assignment) => {
    if (assignment.classes && assignment.classes.length > 0) {
        for (const classInfo of assignment.classes) {
            // Student notification
            await announcementService.createAnnouncement({
                title: `Bài tập mới: ${assignment.title}`,
                content: `Giáo viên đã giao bài tập mới: ${assignment.description}. Hạn nộp: ${assignment.deadline}`,
                classId: classInfo.id,
                targetRole: 'STUDENT'
            });

            // Teacher notification
            await announcementService.createAnnouncement({
                title: `Đã giao bài tập: ${assignment.title}`,
                content: `Bạn đã giao bài tập '${assignment.title}' cho lớp ${classInfo.name}`,
                classId: classInfo.id,
                targetRole: 'TEACHER'
            });
        }
    }
}

const addAssignment = async (assignmentData) => {
    const assignment = new Assignment({
        ...assignmentData,
        createdAt: new Date(),
        status: 'PUBLISHED'
    });
    const saved = await assignment.save();
    await createAssignmentNotifications(saved);
    return saved;
};

const getAllAssignments = async () => {
    return await Assignment.find();
};

const getAssignmentsByTeacher = async (teacherId) => {
    return await Assignment.find({ teacherId });
};

const getAssignmentsByStudent = async (studentIdInput, className) => {
    console.log(`[DEBUG] Searching assignments for Student Identifier: ${studentIdInput}, Class: ${className}`);

    // Find student by ID or userId
    let student = await Student.findById(studentIdInput);
    if (!student) {
        student = await Student.findOne({ userId: studentIdInput });
    }

    const classIdentifiers = new Set();
    if (className && className.trim() !== '') {
        classIdentifiers.add(className);
        classIdentifiers.add(normalize(className));
    }

    const studentPotentialIds = [studentIdInput];
    if (student) {
        console.log(`[DEBUG] Found student profile: ${student.fullName} (SID: ${student._id}, Code: ${student.studentCode})`);
        if (!studentPotentialIds.includes(student._id.toString())) studentPotentialIds.push(student._id.toString());
        if (student.studentCode && !studentPotentialIds.includes(student.studentCode)) studentPotentialIds.push(student.studentCode);
    }

    // Search class mappings
    for (const sId of studentPotentialIds) {
        const mappings = await StudentClass.find({ studentId: sId });
        console.log(`[DEBUG] Found ${mappings.length} mappings for id ${sId}`);
        for (const sc of mappings) {
            if (sc.classId) {
                classIdentifiers.add(sc.classId);
                classIdentifiers.add(normalize(sc.classId));
            }
        }
    }

    console.log(`[DEBUG] Final class identifiers for matching: ${Array.from(classIdentifiers)}`);

    const allAssignments = await Assignment.find();
    const result = allAssignments.filter(a => {
        if (!a.classes || a.classes.length === 0) return false;
        return a.classes.some(info => {
            const id = info.id;
            const name = info.name;

            if (id) {
                if (classIdentifiers.has(id) || classIdentifiers.has(normalize(id))) return true;
            }
            if (name) {
                if (classIdentifiers.has(name) || classIdentifiers.has(normalize(name))) return true;
            }
            return false;
        });
    });

    console.log(`[DEBUG] Returning ${result.length} assignments for student ${studentIdInput}`);
    return result;
}

const deleteAssignment = async (id) => {
    return await Assignment.findByIdAndDelete(id);
};

const updateAssignment = async (id, assignmentData) => {
    return await Assignment.findByIdAndUpdate(id, assignmentData, { new: true });
};

const getAssignmentById = async (id) => {
    return await Assignment.findById(id);
};

module.exports = {
    addAssignment,
    getAllAssignments,
    getAssignmentsByTeacher,
    getAssignmentsByStudent,
    deleteAssignment,
    updateAssignment,
    getAssignmentById
};
