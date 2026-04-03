import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BsPersonFill, BsPencilSquare, BsSave, BsX, BsTrash, BsPlus, BsGraphUp } from 'react-icons/bs';
import { API_BASE_URL } from '../api/config';

const ChartContainer = styled.div`
  padding: 24px 28px 30px;
  background: var(--color-bg-primary);
  border-radius: 22px;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
  min-height: 82vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: var(--color-text-primary);
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
`;

const HeaderNote = styled.p`
  margin: 10px 0 0;
  color: var(--color-text-placeholder);
  font-size: 0.95rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const ClassBadge = styled.div`
  background: linear-gradient(90deg, #5f7cf3 0%, #7a52c8 100%);
  color: white;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(102, 126, 234, 0.2);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(82px, 1fr));
  grid-template-rows: repeat(6, minmax(82px, 1fr));
  gap: 14px;
  background: #eef2f7;
  padding: 18px;
  border-radius: 18px;
  width: 100%;
  max-width: 700px;
  aspect-ratio: 1;
`;

const Seat = styled.div`
  aspect-ratio: 1;
  min-height: 82px;
  min-width: 82px;
  background: ${props => props.$isOccupied ? 'transparent' : (props.$isDropTarget ? '#cfd8e3' : '#dfe5eb')};
  border-radius: 12px;
  border: 1px solid ${props => props.$isOccupied ? 'transparent' : (props.$isDropTarget ? '#8ba3c7' : '#d9e0e8')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  transform: ${props => props.$isDropTarget ? 'scale(1.02)' : 'scale(1)'};
`;

const StudentCard = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 14px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$canDrag ? 'grab' : 'default'};
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 0.8rem;
  z-index: 10;
  position: relative;
  opacity: ${props => props.$isDragging ? 0.72 : 1};
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:active {
    cursor: ${props => props.$canDrag ? 'grabbing' : 'default'};
  }
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const StudentName = styled.div`
  font-weight: bold;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const StudentCode = styled.div`
  font-size: 0.7rem;
  opacity: 0.8;
`;

const NoteBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-bg-primary, #ffffff);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  z-index: 1000;
  width: 400px;
  max-width: 90vw;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 12px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 14px;
  border: 1px solid ${props => props.variant === 'secondary' ? '#e5e7eb' : 'transparent'};
  background: ${props => props.variant === 'secondary' ? '#ffffff' : '#667eea'};
  color: ${props => props.variant === 'secondary' ? 'var(--color-text-primary)' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  box-shadow: ${props => props.variant === 'secondary' ? '0 4px 10px rgba(15, 23, 42, 0.06)' : 'none'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 180px));
  gap: 28px;
  margin-top: 34px;
  justify-content: start;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 18px;
  }
`;

const ClassCard = styled(motion.div)`
  background: transparent;
  border: none;
  border-radius: 20px;
  padding: 22px 18px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.04);
  }
  
  h3 {
    margin: 0;
    color: var(--color-text-primary);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  p {
    margin: 10px 0 0;
    color: var(--color-text-placeholder);
    line-height: 1.45;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: var(--color-text-placeholder);
`;

const MainContent = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 12px;
  min-height: 650px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1.7;
  padding: 18px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const RightSection = styled.div`
  flex: 0.95;
  padding: 36px 18px 12px 34px;
  display: flex;
  flex-direction: column;
  border-left: 6px solid rgba(15, 23, 42, 0.08);
  min-height: 560px;

  @media (max-width: 1200px) {
    border-left: none;
    border-top: 6px solid rgba(15, 23, 42, 0.08);
    padding: 24px 12px 12px;
    min-height: auto;
  }
`;

const StudentList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border-hr);
    border-radius: 10px;
  }
`;

const StudentDropZone = styled.div`
  border-radius: 14px;
  transition: background 0.15s ease, border-color 0.15s ease;
  background: ${props => props.$isDropTarget ? 'rgba(102, 126, 234, 0.08)' : 'transparent'};
  border: 1px dashed ${props => props.$isDropTarget ? 'rgba(102, 126, 234, 0.45)' : 'transparent'};
`;

const StatsPanel = styled.div`
  margin-bottom: 18px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
`;

const StatsTitle = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 16px;
`;

const StatLine = styled.div`
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 8px;
`;

const ScoreInput = styled.input`
  width: 70px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  text-align: center;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ScoreItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
`;

const ScoreSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border-hr);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 14px;
`;

const GridLabel = styled.div`
  margin-bottom: 22px;
  text-align: center;
  
  .desk-label {
    background: #4b6cb7;
    color: white;
    padding: 12px 42px;
    border-radius: 6px;
    font-weight: 800;
    display: inline-block;
    letter-spacing: 0.02em;
  }
`;

const ClassroomSeatingChart = ({ role = 'teacher' }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  
  // Score management state
  const [editingScores, setEditingScores] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [scoreItems, setScoreItems] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [semester, setSemester] = useState(1);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [draggedStudentId, setDraggedStudentId] = useState(null);
  const [dragOverSeatId, setDragOverSeatId] = useState(null);
  const [isOverStudentPanel, setIsOverStudentPanel] = useState(false);

  const isAdmin = role === 'admin';
  const canManageSeats = role === 'admin' || role === 'teacher';
  
  const scoreTypes = [
    { value: 'ORAL', label: 'Miệng' },
    { value: 'QUIZ_15', label: '15 phút' },
    { value: 'ONE_PERIOD', label: '1 tiết' },
    { value: 'MIDTERM', label: 'Giữa kỳ' },
    { value: 'FINAL', label: 'Cuối kỳ' }
  ];

  useEffect(() => {
    fetchClasses();
    fetchCurrentTeacher();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/class/getall`);
      const classList = resp.data.classes || [];
      setClasses(classList);
    } catch (err) {
      console.error('Error fetching classes', err);
    }
  };

  const fetchStudents = async (className) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE_URL}/students/class/${encodeURIComponent(className)}`);
      setStudents(resp.data);
    } catch (err) {
      console.error('Error fetching students', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentSeat = async (studentId, payload) => {
    await axios.put(`${API_BASE_URL}/students/${studentId}/className/${encodeURIComponent(selectedClass)}/seating`, payload);
    setStudents(prev => prev.map((student) => (
      student.studentId === studentId ? { ...student, ...payload } : student
    )));
  };

  const assignStudentToSeat = async (student, seatRow, seatColumn) => {
    if (!canManageSeats) return;

    const occupied = students.find((item) => (
      item.seatRow === seatRow
      && item.seatColumn === seatColumn
      && item.studentId !== student.studentId
    ));

    if (occupied) return;

    try {
      await updateStudentSeat(student.studentId, { seatRow, seatColumn });
    } catch (err) {
      console.error('Error updating seat', err);
    }
  };

  const handleNativeDragStart = (student) => (event) => {
    if (!canManageSeats) return;
    setDraggedStudentId(student.studentId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', student.studentId);
  };

  const handleNativeDragEnd = () => {
    setDraggedStudentId(null);
    setDragOverSeatId(null);
    setIsOverStudentPanel(false);
  };

  const handleSeatDragOver = (seatId) => (event) => {
    if (!canManageSeats) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverSeatId(seatId);
    setIsOverStudentPanel(false);
  };

  const resolveSeatIdFromEvent = (event) => {
    const targetSeatId = event.target?.closest?.('[data-seat-id]')?.getAttribute('data-seat-id');
    if (targetSeatId) return targetSeatId;

    const pointedElement = document.elementFromPoint(event.clientX, event.clientY);
    return pointedElement?.closest?.('[data-seat-id]')?.getAttribute('data-seat-id') || null;
  };

  const handleGridDragOver = (event) => {
    if (!canManageSeats) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const seatId = resolveSeatIdFromEvent(event);
    setDragOverSeatId(seatId);
    setIsOverStudentPanel(false);
  };

  const handleGridDrop = async (event) => {
    if (!canManageSeats) return;
    event.preventDefault();

    const seatId = resolveSeatIdFromEvent(event);
    const studentId = event.dataTransfer.getData('text/plain');
    const student = students.find((item) => item.studentId === studentId);

    setDragOverSeatId(null);
    setIsOverStudentPanel(false);
    setDraggedStudentId(null);

    if (!seatId || !student) return;

    const [seatRow, seatColumn] = seatId.split('-').map(Number);
    await assignStudentToSeat(student, seatRow, seatColumn);
  };

  const handleSeatDrop = (seatRow, seatColumn, seatId) => async (event) => {
    if (!canManageSeats) return;
    event.preventDefault();

    const studentId = event.dataTransfer.getData('text/plain');
    const student = students.find((item) => item.studentId === studentId);

    setDragOverSeatId(null);
    setIsOverStudentPanel(false);
    setDraggedStudentId(null);

    if (!student) return;
    await assignStudentToSeat(student, seatRow, seatColumn);
  };

  const handleStudentPanelDragOver = (event) => {
    if (!canManageSeats) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverSeatId(null);
    setIsOverStudentPanel(true);
  };

  const handleStudentPanelDrop = async (event) => {
    if (!canManageSeats) return;
    event.preventDefault();

    const studentId = event.dataTransfer.getData('text/plain');
    const student = students.find((item) => item.studentId === studentId);

    setDragOverSeatId(null);
    setIsOverStudentPanel(false);
    setDraggedStudentId(null);

    if (!student || (student.seatRow === null && student.seatColumn === null)) return;
    await unassign(student);
  };

  const unassign = async (student) => {
    if (!canManageSeats) return;
    try {
      await updateStudentSeat(student.studentId, {
        seatRow: null,
        seatColumn: null
      });
    } catch (err) {
      console.error('Error unassigning seat', err);
    }
  };

  const openNoteModal = (student) => {
    setEditingNote(student);
    setNoteContent(student.notes || '');
  };

  const saveNote = async () => {
    try {
      await axios.put(`${API_BASE_URL}/students/${editingNote.studentId}/className/${encodeURIComponent(selectedClass)}/seating`, {
        notes: noteContent
      });
      
      setStudents(prev => prev.map(s => 
        s.studentId === editingNote.studentId ? { ...s, notes: noteContent } : s
      ));
      setEditingNote(null);
    } catch (err) {
      console.error('Error saving note', err);
    }
  };

  const fetchCurrentTeacher = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.teacherId) {
        setCurrentTeacher(user);
      }
    } catch (err) {
      console.error('Error fetching current teacher', err);
    }
  };

  // Score management functions
  const fetchAssignments = async () => {
    try {
      // Use teacher-specific endpoint if we have teacherId, otherwise get all
      let url = `${API_BASE_URL}/teaching-assignments/all`;
      if (currentTeacher?.teacherId) {
        url = `${API_BASE_URL}/teaching-assignments/teacher/${currentTeacher.teacherId}`;
      }
      const resp = await axios.get(url);
      // Filter assignments by class name
      const filtered = resp.data.filter(a => 
        a.className && a.className.toLowerCase().includes(selectedClass.toLowerCase())
      );
      setAssignments(filtered);
      return filtered;
    } catch (err) {
      console.error('Error fetching assignments', err);
      return [];
    }
  };

  const fetchStudentScores = async (studentId) => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/scores/student/${studentId}`);
      setStudentScores(resp.data || []);
    } catch (err) {
      console.error('Error fetching scores', err);
      setStudentScores([]);
    }
  };

  const openScoreModal = async (student) => {
    setViewingStudent(student);
    setEditingScores(true);
    setScoreItems([{ type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] }]);
    setCurrentAssignment(null);
    setSelectedAssignment('');
    
    // Fetch assignments and auto-detect based on teacher
    const classAssignments = await fetchAssignments();
    fetchStudentScores(student.studentId);
    
    // Debug
    console.log('Current teacher:', currentTeacher);
    console.log('Class assignments:', classAssignments);
    
    // Auto-select assignment based on current teacher
    if (classAssignments.length > 0) {
      let teacherAssignment = null;
      
      if (currentTeacher?.teacherId) {
        // Try match by teacherId first
        teacherAssignment = classAssignments.find(a => 
          a.teacherId === currentTeacher.teacherId
        );
      }
      
      // Fallback: match by teacher name
      if (!teacherAssignment && currentTeacher?.fullName) {
        teacherAssignment = classAssignments.find(a => 
          a.teacherName?.toLowerCase().includes(currentTeacher.fullName.toLowerCase()) ||
          currentTeacher.fullName.toLowerCase().includes(a.teacherName?.toLowerCase())
        );
      }
      
      // Fallback: if only one assignment for this class, use it
      if (!teacherAssignment && classAssignments.length === 1) {
        teacherAssignment = classAssignments[0];
      }
      
      if (teacherAssignment) {
        console.log('Found assignment:', teacherAssignment);
        setSelectedAssignment(teacherAssignment.id);
        setCurrentAssignment(teacherAssignment);
      } else {
        console.log('No matching assignment found');
      }
    }
  };

  const addScoreItem = () => {
    setScoreItems([...scoreItems, { 
      type: 'ORAL', 
      value: '', 
      weight: 1, 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeScoreItem = (index) => {
    setScoreItems(scoreItems.filter((_, i) => i !== index));
  };

  const updateScoreItem = (index, field, value) => {
    const updated = [...scoreItems];
    updated[index] = { ...updated[index], [field]: value };
    setScoreItems(updated);
  };

  const calculateAverage = (items) => {
    if (!items || items.length === 0) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    
    items.forEach(item => {
      if (item.value != null && item.weight != null) {
        weightedSum += item.value * item.weight;
        totalWeight += item.weight;
      }
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
  };

  const saveStudentScores = async () => {
    if (!selectedAssignment) {
      alert('Vui lòng chọn môn học');
      return;
    }
    
    try {
      const payload = {
        studentId: viewingStudent.studentId,
        teachingAssignmentId: selectedAssignment,
        semester: parseInt(semester),
        academicYearId: new Date().getFullYear().toString(),
        items: scoreItems.map(item => ({
          ...item,
          value: parseFloat(item.value) || 0,
          weight: parseFloat(item.weight) || 1
        }))
      };

      const existingScore = studentScores.find(s => 
        s.teachingAssignmentId === selectedAssignment && s.semester === parseInt(semester)
      );
      
      if (existingScore) {
        await axios.put(`${API_BASE_URL}/scores/${existingScore.id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/scores`, payload);
      }

      fetchStudentScores(viewingStudent.studentId);
      setEditingScores(false);
      setScoreItems([{ type: 'ORAL', value: '', weight: 1, date: new Date().toISOString().split('T')[0] }]);
    } catch (err) {
      console.error('Error saving scores', err);
      alert('Lỗi khi lưu điểm: ' + err.message);
    }
  };

  const renderGrid = () => {
    const seats = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const student = students.find(s => s.seatRow === r && s.seatColumn === c);
        seats.push(
          <Seat 
            key={`seat-${r}-${c}`} 
            $isOccupied={!!student}
            $isDropTarget={dragOverSeatId === `${r}-${c}`}
            data-seat-id={`${r}-${c}`}
            onDragOver={handleSeatDragOver(`${r}-${c}`)}
            onDragLeave={() => setDragOverSeatId((current) => (current === `${r}-${c}` ? null : current))}
            onDrop={handleSeatDrop(r, c, `${r}-${c}`)}
          >
            {student && (
              <StudentCard
                $canDrag={canManageSeats}
                $isDragging={draggedStudentId === student.studentId}
                draggable={canManageSeats}
                onDragStart={handleNativeDragStart(student)}
                onDragEnd={handleNativeDragEnd}
                initial={false}
              >
                <BsPersonFill size={20} />
                <StudentName title={student.fullName}>{student.fullName.split(' ').pop()}</StudentName>
                {canManageSeats && (
                  <div 
                    style={{position: 'absolute', top: 2, right: 2, cursor: 'pointer', opacity: 0.8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    onClick={(e) => { e.stopPropagation(); unassign(student); }}
                  >
                    <BsX size={14} />
                  </div>
                )}
                {student.notes && <NoteBadge onClick={(e) => { e.stopPropagation(); openNoteModal(student); }}>!</NoteBadge>}
                <div 
                  style={{position: 'absolute', bottom: 5, right: 5, cursor: 'pointer', opacity: 0.7}} 
                  onClick={(e) => { e.stopPropagation(); openNoteModal(student); }}
                >
                  <BsPencilSquare size={14}/>
                </div>
                <div 
                  style={{position: 'absolute', top: 5, left: 5, cursor: 'pointer', opacity: 0.8, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                  onClick={(e) => { e.stopPropagation(); openScoreModal(student); }}
                  title="Xem điểm"
                >
                  <BsGraphUp size={12}/>
                </div>
              </StudentCard>
            )}
            {!student && <span style={{fontSize: '0.6rem', opacity: 0.2}}>{r+1}-{c+1}</span>}
          </Seat>
        );
      }
    }
    return seats;
  };

  const unassignedStudents = students.filter(s => s.seatRow === null || s.seatColumn === null);
  const assignedStudentsCount = students.length - unassignedStudents.length;
  const pageTitle = isAdmin ? 'Quản lý Vị trí Chỗ ngồi' : 'Sơ đồ Lớp học';

  return (
    <ChartContainer>
      <Header>
        <div>
          <Title>{pageTitle}</Title>
          {!selectedClass && <HeaderNote>Nhấn để xem sơ đồ</HeaderNote>}
        </div>
        {selectedClass && (
          <HeaderActions>
            <ClassBadge>Lớp: {selectedClass}</ClassBadge>
            <Button variant="secondary" onClick={() => setSelectedClass('')}>
              <BsX /> Đổi lớp
            </Button>
          </HeaderActions>
        )}
      </Header>

      {!selectedClass ? (
        <SelectionGrid>
          {classes.map(c => {
            // Robust label logic: avoid prepending if className already starts with gradeLevel
            let label = "";
            const gLevel = c.gradeLevel ? String(c.gradeLevel) : "";
            const cName = c.className || "";
            
            if (c.displayName) {
              label = c.displayName;
            } else if (c.grade) {
              label = c.grade;
            } else if (gLevel && cName) {
              if (cName.startsWith(gLevel)) {
                label = cName;
              } else {
                label = gLevel + cName;
              }
            } else {
              label = cName || gLevel || 'Unnamed Class';
            }

            return (
              <ClassCard 
                key={c.id} 
                onClick={() => setSelectedClass(label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>{label}</h3>
                <p>Nhấn để xem sơ đồ</p>
              </ClassCard>
            );
          })}
          {classes.length === 0 && <EmptyState>Đang tải danh sách lớp học hoặc không có lớp nào...</EmptyState>}
        </SelectionGrid>
      ) : (
        <MainContent>
          <LeftSection>
            <GridLabel>
               <div className="desk-label">BÀN GIÁO VIÊN</div>
            </GridLabel>
            {loading ? (
              <EmptyState>Đang tải sơ đồ lớp...</EmptyState>
            ) : (
              <Grid
                id="seating-grid"
                onDragOver={handleGridDragOver}
                onDrop={handleGridDrop}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDragOverSeatId(null);
                  }
                }}
              >
                {renderGrid()}
              </Grid>
            )}
          </LeftSection>

          {canManageSeats && (
            <RightSection
              id="student-list-panel"
              onDragOver={handleStudentPanelDragOver}
              onDragLeave={() => setIsOverStudentPanel(false)}
              onDrop={handleStudentPanelDrop}
            >
              <h3 style={{marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10}}>
                <BsPersonFill /> Danh sách HS ({students.length})
              </h3>
              <StatsPanel>
                <StatsTitle>Thông tin lớp</StatsTitle>
                <StatLine>Tổng số: {students.length}</StatLine>
                <StatLine>Đã xếp chỗ: {assignedStudentsCount}</StatLine>
                <StatLine>Chưa xếp chỗ: {unassignedStudents.length}</StatLine>
              </StatsPanel>
              <p style={{fontSize: '0.92rem', opacity: 0.6, marginBottom: 18, lineHeight: 1.5}}>Kéo học sinh vào ô lưới ở bên trái để xếp chỗ. Kéo từ lưới về đây để bỏ xếp chỗ.</p>
              <StudentList>
                {unassignedStudents.map(s => (
                   <StudentDropZone key={s.studentId} style={{width: '100%', height: '80px'}} $isDropTarget={isOverStudentPanel}>
                      <StudentCard
                        $canDrag={canManageSeats}
                        $isDragging={draggedStudentId === s.studentId}
                        draggable={canManageSeats}
                        onDragStart={handleNativeDragStart(s)}
                        onDragEnd={handleNativeDragEnd}
                      >
                        <BsPersonFill size={18} />
                        <StudentName title={s.fullName}>{s.fullName.split(' ').pop()}</StudentName>
                        <StudentCode>{s.studentCode}</StudentCode>
                        <div 
                          style={{position: 'absolute', top: 2, right: 2, cursor: 'pointer', opacity: 0.8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                          onClick={(e) => { e.stopPropagation(); openScoreModal(s); }}
                          title="Xem điểm"
                        >
                          <BsGraphUp size={12}/>
                        </div>
                      </StudentCard>
                   </StudentDropZone>
                ))}
                {unassignedStudents.length === 0 && (
                  <div style={{gridColumn: 'span 2', textAlign: 'center', padding: 40, opacity: 0.5}}>
                    Tất cả học sinh đã được xếp chỗ.
                  </div>
                )}
              </StudentList>
            </RightSection>
          )}

        </MainContent>
      )}

      <AnimatePresence>
        {editingNote && (
          <>
            <Overlay 
              initial={{opacity: 0}} 
              animate={{opacity: 1}} 
              exit={{opacity: 0}} 
              onClick={() => setEditingNote(null)} 
            />
            <Modal
              initial={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              animate={{scale: 1, opacity: 1, x: '-50%', y: '-50%'}}
              exit={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
            >
              <h3>Ghi chú cho {editingNote.fullName}</h3>
              <TextArea 
                placeholder="Nhập ghi chú hoặc điểm số cho học sinh này..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
                <Button variant="secondary" onClick={() => setEditingNote(null)}>Hủy</Button>
                <Button onClick={saveNote}>Lưu ghi chú</Button>
              </div>
            </Modal>
          </>
        )}

        {editingScores && viewingStudent && (
          <>
            <Overlay 
              initial={{opacity: 0}} 
              animate={{opacity: 1}} 
              exit={{opacity: 0}} 
              onClick={() => setEditingScores(false)} 
            />
            <Modal
              initial={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              animate={{scale: 1, opacity: 1, x: '-50%', y: '-50%'}}
              exit={{scale: 0.8, opacity: 0, x: '-50%', y: '-50%'}}
              style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <h3>Quản lý điểm: {viewingStudent.fullName}</h3>
              
              {currentAssignment ? (
                <div style={{ marginBottom: '20px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                  <strong>Môn học:</strong> {currentAssignment.subjectName}
                  {currentAssignment.teacherName && (
                    <span style={{ color: 'var(--color-text-placeholder)', marginLeft: '10px' }}>({currentAssignment.teacherName})</span>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Môn học:</label>
                  <ScoreSelect 
                    value={selectedAssignment} 
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">Chọn môn học...</option>
                    {assignments.map(a => (
                      <option key={a.id} value={a.id}>{a.subjectName} - {a.teacherName}</option>
                    ))}
                  </ScoreSelect>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Học kỳ:</label>
                <ScoreSelect 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value={1}>Học kỳ 1</option>
                  <option value={2}>Học kỳ 2</option>
                </ScoreSelect>
              </div>

              <h4 style={{ marginBottom: '15px' }}>Nhập điểm:</h4>
              {scoreItems.map((item, index) => (
                <ScoreItemRow key={index}>
                  <ScoreSelect 
                    value={item.type} 
                    onChange={(e) => updateScoreItem(index, 'type', e.target.value)}
                  >
                    {scoreTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </ScoreSelect>
                  
                  <ScoreInput
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Điểm"
                    value={item.value}
                    onChange={(e) => updateScoreItem(index, 'value', e.target.value)}
                  />
                  
                  <ScoreInput
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Hệ số"
                    value={item.weight}
                    onChange={(e) => updateScoreItem(index, 'weight', e.target.value)}
                    style={{ width: '60px' }}
                  />
                  
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateScoreItem(index, 'date', e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border-hr)' }}
                  />
                  
                  <Button variant="secondary" onClick={() => removeScoreItem(index)} style={{ padding: '8px' }}>
                    <BsTrash />
                  </Button>
                </ScoreItemRow>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
                <Button onClick={addScoreItem}>
                  <BsPlus /> Thêm cột điểm
                </Button>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" onClick={() => { setEditingScores(false); setCurrentAssignment(null); }}>
                    <BsX /> Hủy
                  </Button>
                  <Button onClick={saveStudentScores}>
                    <BsSave /> Lưu điểm
                  </Button>
                </div>
              </div>

              {studentScores.length > 0 && (
                <>
                  <h4 style={{ marginBottom: '15px', marginTop: '20px', borderTop: '1px solid var(--color-border-hr)', paddingTop: '20px' }}>
                    Điểm đã lưu:
                  </h4>
                  {studentScores.map((score, idx) => {
                    const assignment = assignments.find(a => a.id === score.teachingAssignmentId);
                    return (
                      <div key={idx} style={{ marginBottom: '15px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                        <strong>{assignment?.subjectName || 'Unknown Subject'}</strong> - HK{score.semester}
                        <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
                          {score.items?.map((item, i) => (
                            <span key={i} style={{ marginRight: '15px' }}>
                              {scoreTypes.find(t => t.value === item.type)?.label}: {item.value}
                              {item.weight && item.weight !== 1 && (
                                <span style={{ color: 'var(--color-text-placeholder)' }}> (x{item.weight})</span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div style={{ marginTop: '5px', fontWeight: 'bold', color: '#667eea' }}>
                          TB: {calculateAverage(score.items)}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </Modal>
          </>
        )}
      </AnimatePresence>
    </ChartContainer>
  );
};

export default ClassroomSeatingChart;
