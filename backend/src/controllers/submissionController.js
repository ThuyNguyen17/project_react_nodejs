// controllers/submissionController.js
const Submission = require('../models/Submission');

// ==============================
// SUBMIT ASSIGNMENT
// ==============================
exports.submitAssignment = async (req, res) => {
    try {
        const submission = req.body;

        // 🔥 check nếu đã nộp rồi thì update (giống LMS thật)
        const existing = await Submission.findOne({
            assignmentId: submission.assignmentId,
            studentId: submission.studentId
        });

        let saved;

        if (existing) {
            saved = await Submission.findByIdAndUpdate(
                existing._id,
                submission,
                { new: true }
            );
        } else {
            saved = await Submission.create({
                ...submission,
                submittedAt: new Date(),
                status: "submitted"
            });
        }

        res.json({
            success: true,
            message: "Bài tập đã được nộp!",
            submission: saved
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ASSIGNMENT
// ==============================
exports.getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({
            assignmentId: req.params.assignmentId
        });

        res.json({
            success: true,
            submissions
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY STUDENT
// ==============================
exports.getSubmissionsByStudent = async (req, res) => {
    try {
        const submissions = await Submission.find({
            studentId: req.params.studentId
        });

        res.json({
            success: true,
            submissions
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY ASSIGNMENT + STUDENT
// ==============================
exports.getSubmissionByAssignmentAndStudent = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            assignmentId: req.params.assignmentId,
            studentId: req.params.studentId
        });

        res.json({
            success: true,
            submission
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GRADE SUBMISSION
// ==============================
exports.gradeSubmission = async (req, res) => {
    try {
        const { score, feedback } = req.body;

        const updated = await Submission.findByIdAndUpdate(
            req.params.submissionId,
            {
                score,
                feedback,
                status: "graded"
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Đã chấm điểm!",
            submission: updated
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};