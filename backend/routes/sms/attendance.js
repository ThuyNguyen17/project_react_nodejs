const express = require('express');
const { getModel } = require('../../models/dynamicModel');

const router = express.Router();
const Attendance = getModel('attendance');
const AttendanceSession = getModel('attendanceSession');

router.post('/bulk', async (req, res) => {
  const { attendanceData } = req.body;
  if (!Array.isArray(attendanceData)) {
    return res.status(400).json({ message: 'attendanceData must be an array' });
  }
  const docs = attendanceData.map((item) => ({ ...item }));
  await Attendance.insertMany(docs);
  res.json({ message: 'Attendance records created', count: docs.length });
});

router.post('/session/start', async (req, res) => {
  const session = new AttendanceSession({ ...req.body, startedAt: new Date(), closed: false });
  await session.save();
  res.status(201).json(session);
});

router.post('/session/:id/token', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  const session = await AttendanceSession.findByIdAndUpdate(
    req.params.id,
    { token, tokenCreatedAt: new Date() },
    { new: true, runValidators: false }
  );
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

router.post('/session/:id/close', async (req, res) => {
  const session = await AttendanceSession.findByIdAndUpdate(
    req.params.id,
    { closed: true, closedAt: new Date() },
    { new: true, runValidators: false }
  );
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

router.get('/student/:studentId', async (req, res) => {
  const records = await Attendance.find({ studentId: req.params.studentId });
  res.json(records);
});

router.get('/session/:sessionId/attendances', async (req, res) => {
  const records = await Attendance.find({ sessionId: req.params.sessionId });
  res.json(records);
});

module.exports = router;
