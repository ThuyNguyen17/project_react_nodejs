# Class Management System - API Documentation

## 🔐 Authentication API

### Universal Login (Recommended)
**POST** `/api/students/login-new`

This endpoint handles both teacher and student login automatically based on the user's role.

**Request Body:**
```json
{
  "username": "GV001", // or "SV001"
  "password": "123456"
}
```

**Response (Teacher):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "TEACHER",
  "id": "T001",
  "teacherId": "GV001",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@school.edu.vn",
  "phone": "0901234567"
}
```

**Response (Student):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "STUDENT",
  "id": "S001",
  "studentId": "S001",
  "studentCode": "SV001",
  "fullName": "Lê Văn C",
  "email": "levanc@student.edu.vn",
  "phone": "0912345678"
}
```

### Teacher Login (Legacy)
**POST** `/api/teachers/login`

**Request Body:**
```json
{
  "teacherId": "GV001",
  "password": "123456"
}
```

### Student Login (Legacy)
**POST** `/api/students/login`

**Request Body:**
```json
{
  "username": "SV001",
  "password": "123456"
}
```

## 📅 Timetable API

### Get Teacher Timetable
**GET** `/api/teachers/{teacherId}/timetable`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `week` (optional): Week number (1-35)
- `year` (optional): Academic year
- `semester` (optional): Semester number (1-2)

**Response:**
```json
{
  "success": true,
  "timetable": [
    {
      "teachingAssignmentId": "TA001",
      "dayOfWeek": "MONDAY",
      "period": 1,
      "subject": "Toán",
      "className": "10A1",
      "room": "A101",
      "note": ""
    }
  ]
}
```

### Get Class Timetable
**GET** `/api/timetable/class/{className}`

**Query Parameters:**
- `week` (optional): Week number
- `year` (optional): Academic year
- `semester` (optional): Semester number

## 👥 Student API

### Get Student Subjects
**GET** `/api/students/{studentId}/subjects`

### Get Student Attendance
**GET** `/api/students/{studentId}/attendance/{assignmentId}`

### Get Students by Class
**GET** `/api/students/class/{className}`

## 🏫 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String, // = teacherCode hoặc studentCode
  password: String, // bcrypt hash
  role: String, // 'TEACHER' | 'STUDENT' | 'ADMIN'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Teacher Collection
```javascript
{
  _id: String,
  userId: ObjectId, // reference to User
  teacherCode: String, // unique, = username
  fullName: String,
  email: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Collection
```javascript
{
  _id: String,
  userId: ObjectId, // reference to User
  studentCode: String, // unique, = username
  fullName: String,
  dateOfBirth: Date,
  gender: String, // 'Male' | 'Female' | 'Other'
  contact: {
    phone: String,
    email: String,
    address: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### TeachingAssignment Collection
```javascript
{
  _id: String,
  teacherId: String, // teacherCode
  subjectName: String,
  className: String,
  academicYear: Number,
  semester: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Timetable Collection
```javascript
{
  _id: String,
  teachingAssignmentId: String, // reference to TeachingAssignment
  week: Number, // 1-35
  dayOfWeek: String, // MONDAY..SUNDAY
  period: Number, // 1-10
  room: String,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔑 JWT Token Structure

```javascript
{
  "userId": "ObjectId",
  "teacherId": "GV001" | "studentId": "S001",
  "studentCode": "SV001", // only for students
  "role": "TEACHER" | "STUDENT",
  "iat": 1744677114,
  "exp": 1744763514
}
```

## 🧪 Test Credentials & Data

### Login Credentials
| Type | Username | Password | Role | Class |
|------|----------|----------|------|-------|
| Teacher | GV001 | 123456 | TEACHER | - |
| Teacher | GV002 | 123456 | TEACHER | - |
| Student | SV001 | 123456 | STUDENT | 10A1 |
| Student | SV002 | 123456 | STUDENT | 10A2 |

### Sample Timetable Data
**GV001 teaches:**
- Toán - Class 10A1 (Monday P1, Wednesday P2, Friday P3) - Room A101
- Vật Lý - Class 10A1 (Tuesday P2, Thursday P4) - Room P201

**GV002 teaches:**
- Hóa Học - Class 10A2 (Monday P2, Wednesday P3, Friday P1) - Room P301
- Sinh Học - Class 10A2 (Tuesday P3, Thursday P2) - Room P401

### Test Results ✅
- **Teacher Timetable**: `GET /api/teachers/GV001/timetable?week=1&year=2024&semester=1` → 5 classes
- **Class Timetable**: `GET /api/timetable/class/10A1?week=1&year=2024&semester=1` → 5 classes
- **Authentication**: JWT tokens working correctly
- **Authorization**: Role-based access control working

## 🛡️ Authentication Middleware

Use the `authMiddleware` to protect routes:

```javascript
const { authMiddleware, requireTeacher, requireStudent } = require('../middleware/auth');

// Protect any route
router.get('/protected', authMiddleware, (req, res) => {
  // req.user contains user info
  // req.teacher or req.student contains role-specific info
});

// Teacher only routes
router.get('/teacher-only', authMiddleware, requireTeacher, (req, res) => {
  // Only accessible by teachers
});

// Student only routes
router.get('/student-only', authMiddleware, requireStudent, (req, res) => {
  // Only accessible by students
});
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/class_management
   JWT_SECRET=your-secret-key
   PORT=8080
   ```

3. **Seed database with test data:**
   ```bash
   node seed-users.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test the API:**
   ```bash
   node test-login.js
   ```
