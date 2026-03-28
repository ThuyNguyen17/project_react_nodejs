import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getClassTimetable } from "../api/timetableApi";
import { PERIODS, DAYS } from "../utils/timetableConstants";
import {
  getCurrentAcademicInfo,
  getCurrentWeek,
  generateAllSemesterOptions,
  generateWeeksForSemester,
} from "../utils/academicUtils";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableControls from "../components/timetable/TimetableControls";
import TimetablePagination from "../components/timetable/TimetablePagination";
import ScheduleCell from "../components/timetable/ScheduleCell";

export default function StudentTimetable() {
  const navigate = useNavigate();
  const currentAcademicInfo = getCurrentAcademicInfo();
  const currentWeekNum = getCurrentWeek(
    currentAcademicInfo.semester,
    currentAcademicInfo.academicYear
  );

  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    currentAcademicInfo.academicYear
  );
  const [selectedSemester, setSelectedSemester] = useState(
    currentAcademicInfo.semester || 1
  );
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNum);
  const [loading, setLoading] = useState(false);

  const className = student?.className || "";

  const semesterOptions = generateAllSemesterOptions(2, 1);
  const weekOptions = generateWeeksForSemester(selectedSemester, selectedAcademicYear);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      const user = JSON.parse(storedUser);
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.role === "TEACHER") {
        navigate("/teacher/timetable");
        return;
      }
      if (user.role === "ADMIN") {
        navigate("/admin");
        return;
      }
      if (user.role !== "STUDENT") {
        navigate("/login");
        return;
      }
      setStudent(user);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!className) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching timetable for:', { className, selectedWeek, selectedAcademicYear, selectedSemester });
        const data = await getClassTimetable(
          className,
          selectedWeek,
          selectedAcademicYear,
          selectedSemester
        );
        console.log('Timetable data received:', data);
        setTimetable(data || []);
      } catch (error) {
        console.error("Error fetching class timetable:", error);
        setTimetable([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [className, selectedWeek, selectedSemester, selectedAcademicYear]);

  const getScheduleForCell = useCallback(
    (dayKey, periodId) =>
      timetable.find((item) => item.dayOfWeek === dayKey && item.period === periodId),
    [timetable]
  );

  const handleFirstWeek = () => setSelectedWeek(1);
  const handlePreviousWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
  };
  const handleNextWeek = () => {
    if (selectedWeek < weekOptions.length) setSelectedWeek(selectedWeek + 1);
  };
  const handleLastWeek = () => setSelectedWeek(weekOptions.length);

  const handleYearSemesterChange = (e) => {
    const [year, sem] = e.target.value.split("-");
    setSelectedAcademicYear(parseInt(year));
    setSelectedSemester(parseInt(sem));
    setSelectedWeek(1);
  };

  const handleWeekChange = (e) => setSelectedWeek(parseInt(e.target.value));

  const renderCellContent = (day, period) => {
    const schedule = getScheduleForCell(day.key, period.id);
    if (!schedule) return null;
    return (
      <ScheduleCell
        subject={schedule.subject}
        studentClass={schedule.className}
        room={schedule.room}
        note={schedule.note}
      />
    );
  };

  const getCellClassName = (content) => (content ? "active-cell" : "empty-cell");

  return (
    <div className="timetable-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <TimetableControls
        options={{ semesterOptions, weekOptions }}
        values={{ selectedAcademicYear, selectedSemester, selectedWeek }}
        onChange={{
          onYearSemesterChange: handleYearSemesterChange,
          onWeekChange: handleWeekChange,
        }}
        onPrint={() => window.print()}
      />

      <div className="info-text">
        ( Chế độ học sinh: chỉ xem thời khóa biểu, không mở điểm danh. Lớp {className || 'N/A'} )
      </div>

      {!loading && timetable.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#fff',
          margin: '1rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>
            Không có dữ liệu thời khóa biểu
          </h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Không tìm thấy thời khóa biểu cho lớp {className} trong tuần {selectedWeek} 
            {selectedSemester && `, học kỳ ${selectedSemester}`}
            {selectedAcademicYear && `, năm học ${selectedAcademicYear}-${selectedAcademicYear + 1}`}
          </p>
        </div>
      )}

      {timetable.length > 0 && (
        <TimetableGrid
          periods={PERIODS}
          days={DAYS}
          renderCellContent={renderCellContent}
          getCellClassName={getCellClassName}
        />
      )}

      <TimetablePagination
        selectedWeek={selectedWeek}
        totalWeeks={weekOptions.length}
        onFirstWeek={handleFirstWeek}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onLastWeek={handleLastWeek}
      />
    </div>
  );
}
