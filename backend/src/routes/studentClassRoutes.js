// routes/studentClassRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentClassController');
const StudentClass = require('../models/StudentClass');

// GET
router.get('/', controller.getAll);
router.get('/class/:classId', controller.getByClassId);
router.get('/student/:studentId', controller.getByStudentId);

// DEBUG: Check by username with multiple key attempts
router.get('/debug/:username', async (req, res) => {
    try {
        const Student = require('../models/Student');
        const SchoolClass = require('../models/SchoolClass');
        const User = require('../models/User');
        
        const username = req.params.username;
        
        // Find user
        const user = await User.findOne({ username });
        
        // Find student
        const student = await Student.findOne({ studentCode: username });
        
        // Try different studentId formats
        const attempts = [];
        
        // 1. Try with username directly
        let sc = await StudentClass.findOne({ studentId: username });
        attempts.push({ key: username, type: 'username', found: !!sc });
        
        // 2. Try with student _id
        if (student?._id) {
            const byStudentId = await StudentClass.findOne({ studentId: student._id.toString() });
            attempts.push({ key: student._id.toString(), type: 'student._id', found: !!byStudentId });
            if (!sc && byStudentId) sc = byStudentId;
        }
        
        // 3. Try with user _id
        if (user?._id) {
            const byUserId = await StudentClass.findOne({ studentId: user._id.toString() });
            attempts.push({ key: user._id.toString(), type: 'user._id', found: !!byUserId });
            if (!sc && byUserId) sc = byUserId;
        }
        
        // Get SchoolClass if found
        let schoolClassInfo = null;
        if (sc) {
            const schoolClass = await SchoolClass.findById(sc.classId);
            schoolClassInfo = {
                classId: sc.classId,
                schoolClassFound: !!schoolClass,
                gradeLevel: schoolClass?.gradeLevel,
                className: schoolClass?.className,
                fullClassName: schoolClass ? `${schoolClass.gradeLevel}${schoolClass.className}` : null
            };
        }
        
        res.json({
            username,
            userFound: !!user,
            userId: user?._id?.toString(),
            studentFound: !!student,
            studentId: student?._id?.toString(),
            attempts,
            studentClassFound: !!sc,
            studentClassData: sc,
            schoolClassInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE
router.post('/', controller.create);

// DELETE
router.delete('/:id', controller.delete);

module.exports = router;