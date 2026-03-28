const express = require('express');
const router = express.Router();
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const SchoolClass = require('../models/SchoolClass');
const StudentClass = require('../models/StudentClass');
const Subject = require('../models/Subject');
const AcademicYear = require('../models/AcademicYear');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const TeachingAssignment = require('../models/TeachingAssignment');
const Timetable = require('../models/Timetable');
const { resetDatabase } = require('../scripts/databaseManager');

// Get all data with relationships
router.get('/all', async (req, res) => {
  try {
    await connectDB();
    
    const [
      users,
      teachers,
      students,
      classes,
      studentClasses,
      subjects,
      academicYears,
      attendances,
      attendanceSessions,
      teachingAssignments,
      timetables
    ] = await Promise.all([
      User.find({}),
      Teacher.find({}).populate('userId'),
      Student.find({}).populate('userId'),
      SchoolClass.find({}).populate('academicYearId').populate('homeroomTeacherId'),
      StudentClass.find({}),
      Subject.find({}),
      AcademicYear.find({}),
      Attendance.find({}),
      AttendanceSession.find({}),
      TeachingAssignment.find({}),
      Timetable.find({})
    ]);
    
    res.json({
      success: true,
      data: {
        users,
        teachers,
        students,
        classes,
        studentClasses,
        subjects,
        academicYears,
        attendances,
        attendanceSessions,
        teachingAssignments,
        timetables
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    await connectDB();
    
    const [
      userCount,
      teacherCount,
      studentCount,
      classCount,
      subjectCount,
      academicYearCount,
      attendanceCount,
      todayAttendanceSessions
    ] = await Promise.all([
      User.countDocuments({}),
      Teacher.countDocuments({}),
      Student.countDocuments({}),
      SchoolClass.countDocuments({}),
      Subject.countDocuments({}),
      AcademicYear.countDocuments({}),
      Attendance.countDocuments({}),
      AttendanceSession.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);
    
    const recentAttendances = await Attendance.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId');
    
    const upcomingSessions = await AttendanceSession.find({
      date: { $gte: new Date() },
      isActive: true
    })
    .sort({ date: 1 })
    .limit(5)
    .populate('teachingAssignmentId');
    
    res.json({
      success: true,
      data: {
        stats: {
          users: userCount,
          teachers: teacherCount,
          students: studentCount,
          classes: classCount,
          subjects: subjectCount,
          academicYears: academicYearCount,
          attendances: attendanceCount,
          todaySessions: todayAttendanceSessions
        },
        recentAttendances,
        upcomingSessions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset database (clear and seed)
router.post('/reset', async (req, res) => {
  try {
    const seedData = await resetDatabase();
    res.json({
      success: true,
      message: 'Database reset successfully',
      data: seedData
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get students with their classes
router.get('/students-with-classes', async (req, res) => {
  try {
    await connectDB();
    
    const studentClasses = await StudentClass.find({})
      .populate({
        path: 'studentId',
        populate: { path: 'userId' }
      })
      .populate('classId')
      .populate('academicYearId');
    
    res.json({
      success: true,
      data: studentClasses
    });
  } catch (error) {
    console.error('Error fetching students with classes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get teacher schedule
router.get('/teacher-schedule/:teacherId', async (req, res) => {
  try {
    await connectDB();
    
    const { teacherId } = req.params;
    
    const teachingAssignments = await TeachingAssignment.find({ teacherId });
    
    const timetables = await Timetable.find({
      teachingAssignmentId: { $in: teachingAssignments.map(ta => ta._id) }
    })
    .populate('teachingAssignmentId');
    
    res.json({
      success: true,
      data: {
        teachingAssignments,
        timetables
      }
    });
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get student attendance
router.get('/student-attendance/:studentId', async (req, res) => {
  try {
    await connectDB();
    
    const { studentId } = req.params;
    
    const attendances = await Attendance.find({ studentId })
      .populate('attendanceSessionId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: attendances
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
