import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const u = JSON.parse(stored);
      if (u) setUser(u);
    } catch {
      // ignore
    }
  }, []);

  const goToApp = () => {
    if (!user?.role) {
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN') navigate('/admin');
    else if (user.role === 'TEACHER') navigate('/teacher/timetable');
    else if (user.role === 'STUDENT') navigate('/student/dashboard');
    else navigate('/login');
  };

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">S-Attendance</h1>
        <img className="home-image" src="/vite.svg" alt="logo" />
        <p className="home-subtitle">
          Trang home demo. Vao dang nhap roi moi xem duoc noi dung.
        </p>

        {user ? (
          <div className="home-user">
            <div>Dang dang nhap: {user.fullName || user.username}</div>
            <div>Quyen: {user.role}</div>
          </div>
        ) : (
          <div className="home-user">Chua dang nhap</div>
        )}

        <div className="home-actions">
          <button className="home-btn primary" onClick={() => navigate('/login')}>
            Dang nhap
          </button>
          <button className="home-btn" onClick={goToApp}>
            Vao noi dung
          </button>
          <button className="home-btn" onClick={() => navigate('/database')}>
            Quan ly Database
          </button>
        </div>

        <div className="home-demo">
          <div>Demo tai khoan:</div>
          <div>Admin: admin / password123</div>
          <div>Giao vien: GV001..GV003 / password123</div>
          <div>Hoc sinh: HS001..HS008, HS999 / password123</div>
        </div>
      </div>
    </div>
  );
}

