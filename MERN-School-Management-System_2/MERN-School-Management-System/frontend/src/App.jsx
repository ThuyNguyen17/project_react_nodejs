import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "../src/components/Home";
import ChooseUser from "../src/components/ChooseUser";
import AdminSignIn from "./components/AdminSignin";
import AdminSignup from "./components/AdminSignup";
import StudentSignIn from "./components/StudentSignin";
import TeacherSign from "./components/TeacherSignin";

import AdminDashboard from "./pages/Admin/Dashboard";
import StudentDashboard from "./pages/Students/Dashboard";
import TeacherDashboard from "./pages/Teachers/Dashboard";

import Classes from "./pages/Admin/Classes";
import Exam from "./pages/Admin/Exam";
import Attendance from "./pages/Admin/Attendance";
import Performance from "./pages/Admin/Performance";
import Teachers from "./pages/Admin/Teachers";
import Students from "./pages/Admin/Students";
import Assignments from "./pages/Admin/Assignments";
import Library from "./pages/Admin/Library";
import EventCalendar from "./pages/Admin/EventCalendar";
import SettingsProfile from "./pages/Admin/SettingsProfile";
import Announcement from "./pages/Admin/Announcement";
import TeachingAssignments from "./pages/Admin/TeachingAssignments";

import StudentAssignments from "./pages/Students/Assignments";
import ExamSection from "./pages/Students/Exam";
import PerformanceSection from "./pages/Students/Performance";
import AttendanceSection from "./pages/Students/Attendance";
import LibrarySection from "./pages/Students/Library";
import AnnouncementSection from "./pages/Students/Announcement";
import ProfileSection from "./pages/Students/Profile";

import ClassesSection from "./pages/Teachers/Classes";
import StudentSection from "./pages/Teachers/Students";
import TeacherSection from "./pages/Teachers/Teachers";
import CheckPerformanceSection from "./pages/Teachers/Performance";
import EventSection from "./pages/Teachers/Events";
import TeacherProfileSection from "./pages/Teachers/Profile";
import CheckkAnnouncementSection from "./pages/Teachers/Announcement";
import AssignmentSection from "./pages/Teachers/Assignments";
import CheckAttendanceSection from "./pages/Teachers/Attendance";
import CheckExamSection from "./pages/Teachers/Exam";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-user" element={<ChooseUser />} />
        {/* All the sign in pages routes */}
        <Route exact path="/admin-signIn" element={<AdminSignIn />} />
        <Route exact path="/admin-signUp" element={<AdminSignup />} />
        <Route exact path="/student-signIn" element={<StudentSignIn />} />
        <Route exact path="/teacher-signIn" element={<TeacherSign />} />
        
        {/* All the dashboard pages routes */}
        <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
        <Route exact path="/student/dashboard" element={<StudentDashboard />} />
        <Route exact path="/teacher/dashboard" element={<TeacherDashboard />} />

        {/* Admin sections here */}
        <Route exact path="/admin/classes" element={<Classes />} />
        <Route exact path="/admin/exams" element={<Exam />} />
        <Route exact path="/admin/attendance" element={<Attendance />} />
        <Route exact path="/admin/performance" element={<Performance />} />
        <Route exact path="/admin/teachers" element={<Teachers />} />
        <Route exact path="/admin/students" element={<Students />} />
        <Route exact path="/admin/assignments" element={<Assignments />} />
        <Route exact path="/admin/library" element={<Library />} />
        <Route exact path="/admin/communication" element={<Announcement />} />
        <Route exact path="/admin/events" element={<EventCalendar />} />
        <Route exact path="/admin/settings" element={<SettingsProfile />} />
        <Route exact path="/admin/teaching-assignments" element={<TeachingAssignments />} />
        
        {/* Student sections here */}
        <Route exact path="/student/assignments" element={<StudentAssignments />} />
        <Route exact path="/student/exams" element={<ExamSection />} />
        <Route exact path="/student/performance" element={<PerformanceSection />} />
        <Route exact path="/student/attendance" element={<AttendanceSection />} />
        <Route exact path="/student/library" element={<LibrarySection />} />
        <Route exact path="/student/communication" element={<AnnouncementSection />} />
        <Route exact path="/student/settings" element={<ProfileSection />} />

        {/* Teacher sections here */}
        <Route exact path="/teacher/classes" element={<ClassesSection />} />
        <Route exact path="/teacher/students" element={<StudentSection />} />
        <Route exact path="/teacher/teachers" element={<TeacherSection />} />
        <Route exact path="/teacher/assignments" element={<AssignmentSection />} />
        <Route exact path="/teacher/exams" element={<CheckExamSection />} />
        <Route exact path="/teacher/performance" element={<CheckPerformanceSection />} />
        <Route exact path="/teacher/attendance" element={<CheckAttendanceSection />} />
        <Route exact path="/teacher/communication" element={<CheckkAnnouncementSection />} />
        <Route exact path="/teacher/events" element={<EventSection />} />
        <Route exact path="/teacher/settings" element={<TeacherProfileSection />} />
      </Routes>
    </Router>
  )
}

export default App