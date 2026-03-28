# Class Management Backend - Node.js

This is the Node.js backend for the class management system, converted from Java Spring Boot.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/class_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Students
- `POST /api/students/login` - Login with username and password
- `POST /api/students/login/code` - Login with student code
- `GET /api/students/:studentId/subjects` - Get student subjects
- `GET /api/students/:studentId/attendance/:assignmentId` - Get attendance details
- `GET /api/students/class/:className` - Get students by class

### Attendance
- `POST /api/attendance/session/start` - Start attendance session
- `GET /api/attendance/session/:sessionId/pending` - Get pending students
- `GET /api/attendance/session/:sessionId/attendance` - Get session attendance
- `POST /api/attendance/record` - Record attendance

### Timetable
- `GET /api/timetable/class/:className` - Get class timetable
- `GET /api/timetable/class/:className/:dayOfWeek` - Get timetable by day
- `GET /api/timetable/exams/:studentId` - Get exam schedule

## Database

This application uses MongoDB. Make sure MongoDB is running on your system before starting the server.

## Project Structure

```
backend/
├── controllers/     # Route controllers
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Custom middleware
├── server.js       # Main server file
└── package.json    # Dependencies and scripts
```
