import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TeacherTimetable from "./pages/TeacherTimetable";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentScanner from "./pages/StudentScanner";
import AttendanceHistory from "./pages/AttendanceHistory";
import SubjectAttendance from "./pages/SubjectAttendance";
import StudentTimetable from "./pages/StudentTimetable";
import DatabaseView from "./pages/DatabaseView";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teacher/timetable" element={<TeacherTimetable />} />

      <Route path="/login" element={<Login />} />

      {/* Backward-compatible old route */}
      <Route path="/student/login" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={<AdminPage />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/timetable" element={<StudentTimetable />} />
      <Route path="/student/scan" element={<StudentScanner />} />
      <Route path="/student/history" element={<AttendanceHistory />} />
      <Route path="/student/subject/:assignmentId" element={<SubjectAttendance />} />

      {/* Database Management */}
      <Route path="/database" element={<DatabaseView />} />

      <Route path="/attendance" element={<Navigate to="/student/scan" replace />} />
      <Route path="*" element={<div><h1>Path not found: {window.location.pathname}</h1></div>} />
    </Routes>
  );
}
