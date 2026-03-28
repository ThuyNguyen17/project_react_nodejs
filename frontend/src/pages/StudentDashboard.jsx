import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, History, LogOut, GraduationCap, User, CalendarDays } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(storedUser);
            if (!user) {
                navigate('/login');
                return;
            }
            if (user.role === 'TEACHER') {
                navigate('/teacher/timetable');
                return;
            }
            if (user.role === 'ADMIN') {
                navigate('/admin');
                return;
            }
            if (user.role !== 'STUDENT') {
                navigate('/login');
                return;
            }
            setStudent(user);
        } catch (e) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!student) return null;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>S-Attendance</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <User size={40} />
                        </div>
                        <div className="profile-info">
                            <h2>{student.fullName || 'Sinh viên'}</h2>
                            <p className="student-code">Mã SV: {student.studentCode}</p>
                            {student.className && (
                                <div className="class-badge">
                                    <GraduationCap size={16} />
                                    <span>Lớp: {student.className}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="actions-section">
                    <button className="action-card history-card" onClick={() => navigate('/student/timetable')}>
                        <div className="icon-wrapper">
                            <CalendarDays size={32} />
                        </div>
                        <div className="action-text">
                            <h3>Thời khóa biểu</h3>
                            <p>Xem lịch học theo tuần</p>
                        </div>
                    </button>

                    <button className="action-card scan-card" onClick={() => navigate('/student/scan')}>
                        <div className="icon-wrapper">
                            <QrCode size={32} />
                        </div>
                        <div className="action-text">
                            <h3>Quét Mã QR</h3>
                            <p>Điểm danh buổi học mới</p>
                        </div>
                    </button>

                    <button className="action-card history-card" onClick={() => navigate('/student/history')}>
                        <div className="icon-wrapper">
                            <History size={32} />
                        </div>
                        <div className="action-text">
                            <h3>Lịch Sử Điểm Danh</h3>
                            <p>Xem lại các môn đã học</p>
                        </div>
                    </button>
                </div>
            </main>

            <footer className="dashboard-footer">
                <p>&copy; 2026 S-Attendance System</p>
            </footer>
        </div>
    );
};

export default StudentDashboard;
