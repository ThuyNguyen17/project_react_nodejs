const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
