const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const TeachingAssignment = require('../models/TeachingAssignment');
const Timetable = require('../models/Timetable');

// Tạo dữ liệu test
router.post('/create-test-data', async (req, res) => {
  try {
    // Tạo giáo viên test
    const teacher = new Teacher({
      _id: 'teacher001',
      teacherId: 'teacher001',
      teacherCode: 'teacher001',
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'teacher001@school.edu'
    });

    await teacher.save();

    // Tạo phân công dạy
    const assignment = new TeachingAssignment({
      _id: 'assignment001',
      teacherId: 'teacher001',
      subjectName: 'Toán',
      className: '10A',
      academicYear: 2024,
      semester: 1
    });

    await assignment.save();

    // Tạo thời khóa biểu
    const timetable = new Timetable({
      _id: 'timetable001',
      teachingAssignmentId: 'assignment001',
      week: 1,
      dayOfWeek: 'MONDAY',
      period: 1,
      room: 'P101',
      note: 'Bình thường'
    });

    await timetable.save();

    // Tạo thêm vài tiết học
    const timetable2 = new Timetable({
      _id: 'timetable002',
      teachingAssignmentId: 'assignment001',
      week: 1,
      dayOfWeek: 'WEDNESDAY',
      period: 3,
      room: 'P102',
      note: 'Bình thường'
    });

    await timetable2.save();

    res.json({
      success: true,
      message: 'Test data created successfully',
      data: { teacher, assignment, timetable, timetable2 }
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
