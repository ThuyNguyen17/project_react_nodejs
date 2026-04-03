import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recordAttendance } from '../../api/attendanceApi';
import { BASE_URL } from '../../api/config';
import { CheckCircle, AlertCircle, MapPin, Loader } from 'lucide-react';
import './AttendanceStudent.css';

/**
 * AttendanceStudent - Page that opens when student scans the QR code.
 * Flow:
 *   1. If not logged in → redirect to /login?redirect=/attendance?sessionId=...
 *   2. If logged in but not STUDENT → show error
 *   3. If logged in as STUDENT → auto-submit attendance with GPS location
 */
const AttendanceStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId');
  const token = queryParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [geoLoc, setGeoLoc] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  // ─── Auth check + auto-submit ────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      // 1. Validate QR params
      if (!sessionId || !token || sessionId === 'null' || token === 'null') {
        setStatus('error');
        setErrorMsg('Mã QR không hợp lệ hoặc đã hết hạn. Vui lòng quét lại mã mới nhất từ giáo viên.');
        return;
      }

      // 2. Check login
      const raw = localStorage.getItem('user');
      if (!raw) {
        // Not logged in → redirect to login with redirect back here
        const redirectUrl = encodeURIComponent(`/attendance?sessionId=${sessionId}&token=${token}`);
        navigate(`/login?redirect=${redirectUrl}`, { replace: true });
        return;
      }

      let user;
      try { user = JSON.parse(raw); } catch { user = null; }

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (user.role !== 'STUDENT') {
        setStatus('error');
        setErrorMsg('Tính năng điểm danh QR chỉ dành cho sinh viên.');
        return;
      }

      setStudentInfo(user);

      // 3. Get GPS location (non-blocking)
      const locStr = await getLocation();
      setGeoLoc(locStr);

      // 4. Resolve studentId
      let studentId = user.studentId;
      if (!studentId && user.userId) {
        try {
          const resp = await fetch(`${BASE_URL}/api/v1/students/by-user/${user.userId}`);
          if (resp.ok) {
            const data = await resp.json();
            studentId = data.id || data._id;
          }
        } catch (e) { /* silent */ }
      }

      if (!studentId) {
        setStatus('error');
        setErrorMsg('Không xác định được mã sinh viên. Vui lòng đăng nhập lại.');
        return;
      }

      // 5. Submit
      setStatus('submitting');
      try {
        await recordAttendance({
          sessionId,
          qrToken: token,
          studentId,
          studentName: user.fullName || user.username,
          studentClass: user.className || '',
          location: locStr || 'Không xác định được vị trí',
          note: ''
        });
        setStatus('success');
        if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
      } catch (err) {
        setStatus('error');
        setErrorMsg(
          err.response?.data?.message ||
          'Điểm danh thất bại. Phiên học có thể đã kết thúc hoặc bạn đã điểm danh rồi.'
        );
      }
    };

    init();
  }, [sessionId, token]);

  // ─── Helper: get GPS ────────────────────────────────────────────────
  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Thiết bị không hỗ trợ GPS');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          // Try reverse geocode via backend
          fetch(`${BASE_URL}/api/v1/geocode/reverse?lat=${lat}&lon=${lon}`)
            .then(r => r.json())
            .then(d => resolve(d?.address ? `${d.address} (${lat}, ${lon})` : `${lat}, ${lon}`))
            .catch(() => resolve(`${lat}, ${lon}`));
        },
        () => resolve('Không xác định được vị trí'),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="attendance-qr-page">
      <div className="attendance-qr-card">
        <div className="attendance-qr-logo">
          <span>S-Attendance</span>
        </div>

        {(status === 'loading' || status === 'submitting') && (
          <div className="attendance-qr-status">
            <Loader size={52} className="spin-icon" color="#0ea5e9" />
            <h2>{status === 'loading' ? 'Đang xác thực...' : 'Đang điểm danh...'}</h2>
            {geoLoc && (
              <div className="attendance-qr-loc">
                <MapPin size={14} />
                <span>{geoLoc}</span>
              </div>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="attendance-qr-status success">
            <CheckCircle size={64} color="#22c55e" />
            <h2>Điểm danh thành công!</h2>
            {studentInfo && <p>Xin chào, <strong>{studentInfo.fullName}</strong></p>}
            {geoLoc && (
              <div className="attendance-qr-loc">
                <MapPin size={14} />
                <span>{geoLoc}</span>
              </div>
            )}
            <div className="attendance-qr-actions">
              <button className="qr-btn qr-btn--primary" onClick={() => navigate('/student/history')}>
                Xem lịch sử điểm danh
              </button>
              <button className="qr-btn qr-btn--ghost" onClick={() => navigate('/student/dashboard')}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="attendance-qr-status error">
            <AlertCircle size={64} color="#ef4444" />
            <h2>Không thể điểm danh</h2>
            <p>{errorMsg}</p>
            <div className="attendance-qr-actions">
              <button className="qr-btn qr-btn--primary" onClick={() => window.location.reload()}>
                Thử lại
              </button>
              {localStorage.getItem('user') && (
                <button className="qr-btn qr-btn--ghost" onClick={() => navigate('/student/dashboard')}>
                  Về trang chủ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStudent;
