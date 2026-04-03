const Exam = require('../models/Exam');

const addExam = async (examData) => {
    const exam = new Exam(examData);
    return await exam.save();
};

const getAllExams = async () => {
    return await Exam.find();
};

const deleteExam = async (id) => {
    return await Exam.findByIdAndDelete(id);
};

const updateExam = async (id, examData) => {
    return await Exam.findByIdAndUpdate(id, examData, { new: true });
};

module.exports = {
    addExam,
    getAllExams,
    deleteExam,
    updateExam
};
