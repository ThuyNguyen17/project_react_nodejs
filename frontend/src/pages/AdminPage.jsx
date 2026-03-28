import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(stored);
      if (user?.role !== 'ADMIN') {
        if (user?.role === 'TEACHER') navigate('/teacher/timetable');
        else if (user?.role === 'STUDENT') navigate('/student/dashboard');
        else navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h1>admin</h1>
    </div>
  );
}

