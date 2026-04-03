const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

const calculateQuizScore = (submission, assignment) => {
    if (!submission.quizAnswers || !assignment.questions) return 0;

    let totalScore = 0;
    const questions = assignment.questions;
    const studentAnswers = submission.quizAnswers;

    questions.forEach((question, index) => {
        const studentAnswer = studentAnswers.find(sa => sa.questionIndex === index);
        if (!studentAnswer) return;

        const correctAnswers = question.correctAnswers;
        const selectedOptions = studentAnswer.selectedOptions;

        if (correctAnswers && selectedOptions) {
            const allCorrectSelected = correctAnswers.every(ca => selectedOptions.includes(ca));
            const noExtraSelected = selectedOptions.every(so => correctAnswers.includes(so));

            if (allCorrectSelected && noExtraSelected) {
                totalScore += (question.points || 1);
            }
        }
    });

    return totalScore;
}

const submitAssignment = async (submissionData) => {
    const submission = new Submission({
        ...submissionData,
        submittedAt: new Date(),
        status: 'submitted'
    });

    const assignment = await Assignment.findById(submission.assignmentId);
    if (assignment && assignment.type === 'QUIZ') {
        const autoScore = calculateQuizScore(submission, assignment);
        submission.score = autoScore;
        submission.status = 'graded';
        submission.feedback = 'Đã chấm điểm tự động';
    } else {
        submission.score = null;
        submission.feedback = null;
    }

    const saved = await submission.save();

    if (assignment) {
        assignment.submittedCount = (assignment.submittedCount || 0) + 1;
        await assignment.save();
    }

    return saved;
};

const getSubmissionsByAssignment = async (assignmentId) => {
    return await Submission.find({ assignmentId });
};

const getSubmissionsByStudent = async (studentId) => {
    return await Submission.find({ studentId });
};

const gradeSubmission = async (submissionId, score, feedback) => {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error('Submission not found');
    
    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    return await submission.save();
};

const getSubmissionByAssignmentAndStudent = async (assignmentId, studentId) => {
    return await Submission.findOne({ assignmentId, studentId });
};

module.exports = {
    submitAssignment,
    getSubmissionsByAssignment,
    getSubmissionsByStudent,
    gradeSubmission,
    getSubmissionByAssignmentAndStudent
};
