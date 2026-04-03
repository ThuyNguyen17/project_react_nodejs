const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ override: true });

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// IMPORT CONTROLLERS & ROUTES
// Lưu ý: Kiểm tra chính xác tên file trong thư mục controllers và routes của bạn
const controller = require('./controllers/assignmentController'); // Thay đổi tên file nếu cần
const fileRoutes = require('./routes/fileRoutes'); // Bạn thiếu dòng này

const app = express();
const router = express.Router();

connectDB();

// Trust proxy for ngrok
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for local development
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.hostname === 'localhost';
  }
});

app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: true,
  credentials: false
}));

app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

const examRoutes = require('./routes/examRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const geocodeRoutes = require('./routes/geocodeRoute');
const academicYearRoutes = require('./routes/academicYearRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classRoutes = require('./routes/SchoolclassRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const studentClassRoutes = require('./routes/studentClassRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoute = require('./routes/userRoute');
const teacherRoute = require('./routes/teacherRoute');
const teachingAssignmentRoute = require('./routes/teachingAssignmentRoute');
const timetableRoute = require('./routes/timetableRoute');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const violationRoutes = require('./routes/violationRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
// ĐĂNG KÝ CÁC ROUTE VỚI APP
app.use('/api/v1/academic-years', academicYearRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/assignments', assignmentRoutes); 
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/geocode', geocodeRoutes);

app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/class', classRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/scores', scoreRoutes);
app.use('/api/v1/student-classes', studentClassRoutes);
app.use('/api/v1/students', studentRoutes);

app.use('/api/v1/users', userRoute);
app.use('/api/v1/teachers', teacherRoute);
app.use('/api/v1/teaching-assignments', teachingAssignmentRoute);
app.use('/api/v1/teacher', timetableRoute);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/violations', violationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Project Management Class API is running',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
