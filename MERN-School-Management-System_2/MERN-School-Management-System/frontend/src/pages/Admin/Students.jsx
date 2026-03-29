import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    StudentsContainer,
    Content,
    StudentsContent,
    StudentsHeader,
    StudentsPageHeader,
    StudentsHeaderDescription,
    ActionRow,
    PrimaryButton,
    SecondaryButton,    DangerButton,    SectionCard,
    StudentList,
    StudentItem,
    StudentInfo,
    StudentName,
    StudentCode,
    StudentActions,
    FileLabel,
    AddStudentForm,
    AddStudentInput,
    AddStudentButton,
} from "../../styles/StudentsStyles";

const Students = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [newStudent, setNewStudent] = useState({fullName: '', studentCode: ''});
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/students');
            setStudents(response.data || []);
        }catch (error){
            console.error('Error fetching students: ', error);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if(newStudent.fullName.trim() !== '' && newStudent.studentCode.trim() !== ''){
            try{
                const response = await axios.post('http://localhost:8080/api/students', newStudent);
                setStudents([...students, response.data]);
                setNewStudent({ fullName: '', studentCode: '' });
                alert('Student added!');
            }catch (error){
                console.error("Error adding student: ", error);
            }
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        if (editingStudent.fullName.trim() !== '' && editingStudent.studentCode.trim() !== '') {
            try {
                await axios.put(`http://localhost:8080/api/students/${editingStudent._id}`, editingStudent);
                fetchStudents();
                setEditingStudent(null);
                alert('Student updated!');
            } catch (error) {
                console.error('Error updating student: ', error);
            }
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:8080/api/students/${id}`);
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student: ", error);
            }
        }
    };

    const handleFileSelection = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImportStudents = async (e) => {
        e.preventDefault();
        if (!importFile) {
            alert('Vui lòng chọn file Excel trước khi import.');
            return;
        }
        const formData = new FormData();
        formData.append('file', importFile);
        try {
            setImporting(true);
            await axios.post('http://localhost:8080/api/students/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImportFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
            fetchStudents();
            alert('Import học sinh thành công.');
        } catch (error) {
            console.error('Error importing students: ', error);
            alert('Import thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setImporting(false);
        }
    };

    const handleExportStudents = async () => {
        try {
            setExporting(true);
            const response = await axios.get('http://localhost:8080/api/students/export', {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting students: ', error);
            alert('Xuất file thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setExporting(false);
        }
    };

    return(
        <StudentsContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <StudentsContent>
                    <StudentsPageHeader>
                        <div>
                            <StudentsHeader>Students Management</StudentsHeader>
                            <StudentsHeaderDescription>
                                Quản lý sinh viên, nhập/xuất danh sách bằng file Excel và cập nhật thông tin nhanh chóng.
                            </StudentsHeaderDescription>
                        </div>
                        <ActionRow>
                            <SecondaryButton type="button" onClick={() => fileInputRef.current?.click()}>
                                Chọn file Excel
                            </SecondaryButton>
                            <PrimaryButton type="button" onClick={handleImportStudents} disabled={!importFile || importing}>
                                {importing ? 'Đang import...' : 'Import Excel'}
                            </PrimaryButton>
                            <PrimaryButton type="button" onClick={handleExportStudents} disabled={exporting}>
                                {exporting ? 'Đang xuất...' : 'Export Excel'}
                            </PrimaryButton>
                        </ActionRow>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls"
                            style={{ display: 'none' }}
                            onChange={handleFileSelection}
                        />
                    </StudentsPageHeader>
                    <FileLabel>{importFile ? importFile.name : 'Chưa chọn file Excel'}</FileLabel>
                    <SectionCard>
                    {editingStudent ? (
                        <AddStudentForm onSubmit={handleUpdateStudent}>
                            <h3>Edit Student</h3>
                            <AddStudentInput 
                                type="text"
                                placeholder="Full Name"
                                value={editingStudent.fullName}
                                onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                                required
                            />
                            <AddStudentInput 
                                type="text"
                                placeholder="Student Code"
                                value={editingStudent.studentCode}
                                onChange={(e) => setEditingStudent({ ...editingStudent, studentCode: e.target.value })}
                                required
                            />
                            <AddStudentButton type="submit">Update Student</AddStudentButton>
                            <AddStudentButton type="button" onClick={() => setEditingStudent(null)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</AddStudentButton>
                        </AddStudentForm>
                    ) : (
                        <AddStudentForm onSubmit={handleAddStudent}>
                            <h3>Add New Student</h3>
                            <AddStudentInput 
                                type="text"
                                placeholder="Enter Student Full Name"
                                value={newStudent.fullName}
                                onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                                required
                            />
                            <AddStudentInput 
                                type="text"
                                placeholder="Enter Student Code"
                                value={newStudent.studentCode}
                                onChange={(e) => setNewStudent({ ...newStudent, studentCode: e.target.value })}
                                required
                            />
                            <AddStudentButton type="submit">Add Student</AddStudentButton>
                        </AddStudentForm>
                    )}
                    </SectionCard>
                    <SectionCard>
                    <StudentList>
                        {Array.isArray(students) && students.map((student) => (
                            <StudentItem key={student._id || student.id}>
                                <StudentInfo>
                                    <StudentName>{student.fullName}</StudentName>
                                    <StudentCode>{student.studentCode}</StudentCode>
                                </StudentInfo>
                                <StudentActions>
                                    <SecondaryButton type="button" onClick={() => setEditingStudent(student)}>
                                        Edit
                                    </SecondaryButton>
                                    <DangerButton type="button" onClick={() => handleDeleteStudent(student._id || student.id)}>
                                        Delete
                                    </DangerButton>
                                </StudentActions>
                            </StudentItem>
                        ))}
                    </StudentList>
                    </SectionCard>
                </StudentsContent>
            </Content>
        </StudentsContainer>
    )
}

export default Students;