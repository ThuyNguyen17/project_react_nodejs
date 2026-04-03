const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createTeacher = async (teacherData) => {
    const userData = {
        username: teacherData.teacherCode || (teacherData.fullName || '').replace(/\s+/g, '').toLowerCase(),
        password: await bcrypt.hash('123456', 10), // Default password
        role: 'TEACHER',
        isActive: true
    };
    
    const user = new User(userData);
    const savedUser = await user.save();

    const teacher = new Teacher({
        ...teacherData,
        userId: savedUser._id
    });
    
    return await teacher.save();
};

const getAllTeachers = async () => {
    return await Teacher.find();
};

const deleteTeacher = async (id) => {
    return await Teacher.findByIdAndDelete(id);
};

const updateTeacher = async (id, teacherData) => {
    return await Teacher.findByIdAndUpdate(id, teacherData, { new: true });
};

module.exports = {
    createTeacher,
    getAllTeachers,
    deleteTeacher,
    updateTeacher
};
