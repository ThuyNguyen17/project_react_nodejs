import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  Maximize,
  ShieldAlert,
  Clock,
  Lock,
  ChevronRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

/**
 * SeriousExamContainer
 * Wraps exam content with anti-cheat monitoring.
 * - Fullscreen enforcement
 * - Tab switch / window blur detection
 * - F12 / DevTools keystroke detection
 * - 3 violations → auto-submit
 */
const SeriousExamContainer = ({
  children,
  onClose,
  onAutoSubmit,
  title,
  assignmentId,
  userId,
  maxWarnings = 3,
  strictMode = true,
  isSubmitting = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [lastViolationMsg, setLastViolationMsg] = useState('');

  // Refs to avoid stale closures
  const containerRef = useRef(null);
  const warningsRef = useRef(0);
  const isLockedRef = useRef(false);
  const isStartedRef = useRef(false);
  const debounceRef = useRef({}); // keyed by violationType

  // ─── Log to backend ────────────────────────────────────────────────
  const logViolation = async (type, details) => {
    if (!userId || !assignmentId) return;
    try {
      await axios.post(`${BASE_URL}/api/v1/violations/log`, {
        userId,
        assignmentId,
        violationType: type,
        details
      });
    } catch (err) {
      console.error('Failed to log violation:', err);
    }
  };

  // ─── Trigger a warning (debounced per type, 2s cooldown) ───────────
  const triggerWarning = useCallback((type, reason) => {
    if (isLockedRef.current || isSubmitting) return;

    // 2-second cooldown per violation type
    const now = Date.now();
    if (debounceRef.current[type] && now - debounceRef.current[type] < 2000) return;
    debounceRef.current[type] = now;

    const newCount = warningsRef.current + 1;
    warningsRef.current = newCount;
    setWarnings(newCount);
    setLastViolationMsg(reason);
    logViolation(type, reason);

    if (newCount >= maxWarnings) {
      isLockedRef.current = true;
      setIsLocked(true);
      // Give state time to render before blocking alert
      setTimeout(() => {
        alert(`⚠️ BỊ KHÓA BÀI THI\nBạn đã vi phạm ${newCount}/${maxWarnings} lần.\nBài làm đang được nộp tự động...`);
        onAutoSubmit();
      }, 100);
    } else {
      alert(`⚠️ CẢNH BÁO VI PHẠM (${newCount}/${maxWarnings})\n${reason}\n\nVi phạm thêm ${maxWarnings - newCount} lần nữa sẽ bị nộp bài tự động!`);
    }
  }, [isSubmitting, maxWarnings, onAutoSubmit]);

  // ─── Event handlers ────────────────────────────────────────────────
  useEffect(() => {
    if (!strictMode || !isStarted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerWarning('TAB_SWITCH', 'Bạn đã chuyển tab hoặc rời khỏi trang thi!');
      }
    };

    const handleBlur = () => {
      triggerWarning('WINDOW_BLUR', 'Bạn đã rời khỏi cửa sổ làm bài!');
    };

    const handleKeyDown = (e) => {
      const blocked =
        e.key === 'F12' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'K', 'k', 'C', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'u'].includes(e.key)) ||
        e.key === 'PrintScreen';

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('KEYBOARD_SHORTCUT', `Phím tắt bị cấm: ${e.key}${e.ctrlKey ? ' (Ctrl)' : ''}${e.shiftKey ? ' (Shift)' : ''}`);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerWarning('CONTEXT_MENU', 'Chuột phải bị vô hiệu hóa trong lúc thi!');
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      triggerWarning('COPY_PASTE', 'Sao chép/dán bị cấm trong chế độ thi!');
    };

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && !isLockedRef.current) {
        triggerWarning('FULLSCREEN_EXIT', 'Bạn đã thoát chế độ toàn màn hình!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown, true); // capture phase
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [strictMode, isStarted, triggerWarning]);

  // ─── Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isStarted || isLocked || isSubmitting) return;
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isStarted, isLocked, isSubmitting]);

  // ─── Enter fullscreen ──────────────────────────────────────────────
  const enterFullscreen = () => {
    isStartedRef.current = true;
    setIsStarted(true);
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el?.msRequestFullscreen) el.msRequestFullscreen();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ─── Violation severity color ──────────────────────────────────────
  const violationColor = warnings === 0 ? '#22c55e' : warnings === 1 ? '#eab308' : '#ef4444';

  // ─── Pre-start screen ──────────────────────────────────────────────
  if (!isStarted && strictMode && !isLocked) {
    return (
      <div className="serious-exam-container-root" ref={containerRef}>
        <div className="serious-exam-prestart">
          <div className="prestart-card">
            <ShieldAlert size={64} color="#ef4444" />
            <h1>CHẾ ĐỘ THI NGHIÊM TÚC</h1>
            <div className="rules">
              <p><ChevronRight size={16} /> Phải làm bài ở trạng thái <strong>Toàn màn hình</strong>.</p>
              <p><ChevronRight size={16} /> <strong>Không</strong> được chuyển tab hoặc rời cửa sổ trình duyệt.</p>
              <p><ChevronRight size={16} /> <strong>Không</strong> được mở DevTools (F12), sao chép hoặc chuột phải.</p>
              <p><ChevronRight size={16} /> Vi phạm <strong>{maxWarnings} lần</strong> → Hệ thống tự nộp bài.</p>
            </div>
            <button className="start-exam-btn" onClick={enterFullscreen}>
              🚀 Bắt đầu làm bài &amp; Toàn màn hình
            </button>
            <button className="back-btn" onClick={onClose}>← Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main exam UI ──────────────────────────────────────────────────
  return (
    <div
      className="serious-exam-container-root"
      ref={containerRef}
      style={{
        background: isFullscreen ? 'var(--bg-main, #f8fafc)' : 'transparent',
        height: isFullscreen ? '100vh' : 'auto',
        overflowY: 'auto'
      }}
    >
      <div className="serious-exam-wrapper">
        {/* Header bar */}
        <div className="exam-header-bar">
          <div className="exam-title-area">
            <Lock size={18} />
            <span>{title} — Đang giám sát</span>
          </div>

          <div className="exam-stats-area">
            <div className="stat-pill warning" style={{ borderColor: violationColor, color: violationColor }}>
              <AlertTriangle size={16} color={violationColor} />
              <span>Vi phạm: {warnings}/{maxWarnings}</span>
            </div>
            <div className="stat-pill timer">
              <Clock size={16} />
              <span>{formatTime(timer)}</span>
            </div>
            {isFullscreen
              ? <div className="stat-pill safe"><ShieldCheck size={15} color="#22c55e" /><span>Toàn màn hình</span></div>
              : <div className="stat-pill danger"><Maximize size={15} color="#ef4444" /><span>Chưa toàn màn hình</span></div>
            }
          </div>

          <div className="user-area">
            {isLocked && <span className="locked-badge">🔒 Bị khóa</span>}
          </div>
        </div>

        {/* Violation banner (last violation) */}
        {lastViolationMsg && !isLocked && (
          <div className="violation-banner">
            <AlertTriangle size={16} />
            <span>Vi phạm gần nhất: {lastViolationMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="exam-main-content">
          {isLocked ? (
            <div className="locked-overlay">
              <div className="lock-message">
                <Lock size={48} />
                <h2>BÀI THI ĐÃ BỊ KHÓA</h2>
                <p>Bạn đã vi phạm quy chế thi <strong>{warnings}/{maxWarnings}</strong> lần.</p>
                <p>Bài làm đang được gửi tự động đến giáo viên...</p>
              </div>
            </div>
          ) : children}
        </div>
      </div>
    </div>
  );
};

export default SeriousExamContainer;
