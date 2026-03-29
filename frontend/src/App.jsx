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

// SMS-merged project imports from ./sms subtree
import HomeSMS from "./sms/components/Home";
import ChooseUser from "./sms/components/ChooseUser";
import AdminSignIn from "./sms/components/AdminSignin";
import AdminSignup from "./sms/components/AdminSignup";
import StudentSignIn from "./sms/components/StudentSignin";
import TeacherSign from "./sms/components/TeacherSignin";

import AdminDashboard from "./sms/pages/Admin/Dashboard";
import StudentDashboardSMS from "./sms/pages/Students/Dashboard";
import TeacherDashboardSMS from "./sms/pages/Teachers/Dashboard";

import Classes from "./sms/pages/Admin/Classes";
import Exam from "./sms/pages/Admin/Exam";
import Attendance from "./sms/pages/Admin/Attendance";
import Performance from "./sms/pages/Admin/Performance";
import Teachers from "./sms/pages/Admin/Teachers";
import Students from "./sms/pages/Admin/Students";
import Assignments from "./sms/pages/Admin/Assignments";
import Library from "./sms/pages/Admin/Library";
import EventCalendar from "./sms/pages/Admin/EventCalendar";
import SettingsProfile from "./sms/pages/Admin/SettingsProfile";
import Announcement from "./sms/pages/Admin/Announcement";
import TeachingAssignments from "./sms/pages/Admin/TeachingAssignments";

import StudentAssignments from "./sms/pages/Students/Assignments";
import ExamSection from "./sms/pages/Students/Exam";
import PerformanceSection from "./sms/pages/Students/Performance";
import AttendanceSection from "./sms/pages/Students/Attendance";
import LibrarySection from "./sms/pages/Students/Library";
import AnnouncementSection from "./sms/pages/Students/Announcement";
import ProfileSection from "./sms/pages/Students/Profile";

import ClassesSection from "./sms/pages/Teachers/Classes";
import StudentSection from "./sms/pages/Teachers/Students";
import TeacherSectionSMS from "./sms/pages/Teachers/Teachers";
import CheckPerformanceSection from "./sms/pages/Teachers/Performance";
import EventSection from "./sms/pages/Teachers/Events";
import TeacherProfileSection from "./sms/pages/Teachers/Profile";
import CheckkAnnouncementSection from "./sms/pages/Teachers/Announcement";
import AssignmentSection from "./sms/pages/Teachers/Assignments";
import CheckAttendanceSection from "./sms/pages/Teachers/Attendance";
import CheckExamSection from "./sms/pages/Teachers/Exam";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teacher/timetable" element={<TeacherTimetable />} />
      <Route path="/login" element={<Login />} />

      {/* Backward-compatible old route */}
      <Route path="/student/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/classes" element={<Classes />} />
      <Route path="/admin/exams" element={<Exam />} />
      <Route path="/admin/attendance" element={<Attendance />} />
      <Route path="/admin/performance" element={<Performance />} />
      <Route path="/admin/teachers" element={<Teachers />} />
      <Route path="/admin/students" element={<Students />} />
      <Route path="/admin/assignments" element={<Assignments />} />
      <Route path="/admin/library" element={<Library />} />
      <Route path="/admin/communication" element={<Announcement />} />
      <Route path="/admin/events" element={<EventCalendar />} />
      <Route path="/admin/settings" element={<SettingsProfile />} />
      <Route path="/admin/teaching-assignments" element={<TeachingAssignments />} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentDashboardSMS />} />
      <Route path="/student/dashboard" element={<StudentDashboardSMS />} />
      <Route path="/student/assignments" element={<StudentAssignments />} />
      <Route path="/student/exams" element={<ExamSection />} />
      <Route path="/student/performance" element={<PerformanceSection />} />
      <Route path="/student/attendance" element={<AttendanceSection />} />
      <Route path="/student/library" element={<LibrarySection />} />
      <Route path="/student/communication" element={<AnnouncementSection />} />
      <Route path="/student/settings" element={<ProfileSection />} />
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={<TeacherDashboardSMS />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboardSMS />} />
      <Route path="/teacher/assignments" element={<AssignmentSection />} />
      <Route path="/teacher/exams" element={<CheckExamSection />} />
      <Route path="/teacher/performance" element={<CheckPerformanceSection />} />
      <Route path="/teacher/attendance" element={<CheckAttendanceSection />} />
      <Route path="/teacher/communication" element={<CheckkAnnouncementSection />} />
      <Route path="/teacher/events" element={<EventSection />} />
      <Route path="/teacher/settings" element={<TeacherProfileSection />} />

      {/* Database Management */}
      <Route path="/database" element={<DatabaseView />} />

      {/* Legacy/Secondary Entries */}
      <Route path="/sms" element={<HomeSMS />} />
      <Route path="/choose-user" element={<ChooseUser />} />
      <Route path="/admin-signIn" element={<AdminSignIn />} />
      <Route path="/admin-signUp" element={<AdminSignup />} />
      <Route path="/student-signIn" element={<StudentSignIn />} />
      <Route path="/teacher-signIn" element={<TeacherSign />} />



      <Route path="/attendance" element={<Navigate to="/student/scan" replace />} />
      <Route path="*" element={<div><h1>Path not found: {window.location.pathname}</h1></div>} />
    </Routes>
  );
}

