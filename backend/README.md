# Project Management Class - Node.js Backend

This is the Node.js version of the Project Management Class backend, converted from Java Spring Boot to Express.js with MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin, Student, Teacher roles
- **Student Management**: CRUD operations, Excel import/export
- **Assignment Management**: Create, manage assignments with different types (Essay, Quiz, Upload)
- **Attendance System**: QR code-based attendance tracking
- **Exam Management**: Schedule and manage exams
- **Announcements**: Create and manage announcements
- **Notifications**: System notifications
- **File Upload**: Support for file attachments

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **xlsx** - Excel file processing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/project_management_class
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register-admin` - Register admin user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user

### Students
- `GET /api/students` - Get all students (Admin/Teacher)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)
- `POST /api/students/login` - Student login with student code
- `POST /api/students/login-new` - Student login with username/password
- `POST /api/students/import` - Import students from Excel
- `GET /api/students/export` - Export students to Excel
- `GET /api/students/class/:className` - Get students by class

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher (Admin)
- `PUT /api/teachers/:id` - Update teacher (Admin)
- `DELETE /api/teachers/:id` - Delete teacher (Admin)

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Teacher/Admin)
- `PUT /api/assignments/:id` - Update assignment (Teacher/Admin)
- `DELETE /api/assignments/:id` - Delete assignment (Teacher/Admin)

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class (Admin)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create exam (Teacher/Admin)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (Teacher/Admin)

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification (Admin)

### File Upload
- `POST /api/file-upload` - Upload file

### Health Check
- `GET /api/health` - Health check endpoint

## Database Schema

### User
- username: String (unique)
- password: String (hashed)
- role: String (ADMIN, STUDENT, LECTURER, TEACHER)
- isActive: Boolean

### Student
- userId: ObjectId (ref: User)
- studentCode: String (unique)
- fullName: String
- dateOfBirth: Date
- gender: String
- contact: Object (phone, email, address)

### Teacher
- userId: ObjectId (ref: User)
- teacherCode: String (unique)
- fullName: String
- phone: String
- email: String

### Assignment
- title: String
- description: String
- deadline: Date
- maxScore: Number
- teacherId: ObjectId (ref: Teacher)
- classes: Array
- type: String (ESSAY, QUIZ, UPLOAD)
- status: String (DRAFT, PUBLISHED)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Rate limiting
- CORS configuration
- Security headers with helmet

## Default Credentials

After installation, you can register an admin user using:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

## Migration from Java Spring Boot

This Node.js version maintains API compatibility with the original Java Spring Boot backend. Key changes:

1. **Framework**: Spring Boot → Express.js
2. **Language**: Java → JavaScript/Node.js
3. **Database**: MongoDB with Spring Data → MongoDB with Mongoose
4. **Authentication**: Spring Security → JWT
5. **File Handling**: Spring MultipartFile → Multer
6. **Excel Processing**: Apache POI → XLSX library

All existing API endpoints and data structures have been preserved to ensure frontend compatibility.
