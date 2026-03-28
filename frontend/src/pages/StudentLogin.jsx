import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/studentApi';
import './StudentLogin.css';

const StudentLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const user = await login(username.trim(), password.trim());

            // Lưu toàn bộ thông tin user vào localStorage
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else if (user.role === 'TEACHER') {
                navigate('/teacher/timetable');
            } else {
                setError('Tài khoản không có quyền truy cập hệ thống');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Tài khoản hoặc mật khẩu không đúng';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>S-Attendance</h1>
                    <p>Hệ thống điểm danh thông minh</p>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Mã sinh viên / Tài khoản</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập mã sinh viên hoặc tài khoản"
                            autoFocus
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error-message">⚠ {error}</div>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
                <div className="login-footer">
                    <p>Dành cho Học sinh / Sinh viên và Giáo viên</p>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
