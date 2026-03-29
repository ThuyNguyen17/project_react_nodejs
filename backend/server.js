const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
// app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/debug-body', (req, res) => {
  console.log('=== DEBUG BODY ===');
  console.log('Body:', req.body);
  res.json({ body: req.body });
});

app.get('/', (req, res) => {
  res.json({ message: 'Class Management API is running' });
});

// Import routes
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const timetableRoutes = require('./routes/timetable');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const geocodeRoutes = require('./routes/geocode');
const testDataRoutes = require('./routes/testData');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth');
const v2UsersRoutes = require('./routes/sms/users');
const v2StudentsRoutes = require('./routes/sms/students');
const v2AttendanceRoutes = require('./routes/sms/attendance');
const genericResourceRoutes = require('./routes/sms/genericResource');

app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/test', testDataRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);

// V2 and Generic Routes from merged project
app.use('/api/v2/users', v2UsersRoutes);
app.use('/api/v2/students', v2StudentsRoutes);
app.use('/api/v2/attendance', v2AttendanceRoutes);
app.use('/api/v1', genericResourceRoutes); // Generic resource route matches what the secondary frontend expects

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
