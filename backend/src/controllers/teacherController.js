const teacherService = require('../service/teacherService');

const toTeacherDto = (teacher) => ({
    id: String(teacher._id),
    teacherCode: teacher.teacherCode || '',
    fullName: teacher.fullName || '',
    phone: teacher.phone || '',
    email: teacher.email || '',
    userId: teacher.userId || ''
});

const createTeacher = async (req, res) => {
    try {
        const teacher = await teacherService.createTeacher(req.body);
        res.status(200).json({
            success: true,
            message: 'Teacher Created!',
            teacher: toTeacherDto(teacher)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await teacherService.getAllTeachers();
        res.status(200).json({
            success: true,
            teachers: teachers.map(toTeacherDto)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        await teacherService.deleteTeacher(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Teacher Deleted!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const teacher = await teacherService.updateTeacher(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Teacher Updated!',
            teacher: teacher ? toTeacherDto(teacher) : null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTeacher,
    getAllTeachers,
    deleteTeacher,
    updateTeacher
};
