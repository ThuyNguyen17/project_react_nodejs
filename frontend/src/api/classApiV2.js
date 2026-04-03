import axios from 'axios';
import { API_BASE_URL } from './config';

export const getAllClasses = async () => {
    const response = await axios.get(`${API_BASE_URL}/class/getall`);
    return response.data.classes || [];
};

export const getStudentsInClass = async (classIdOrName) => {
    const response = await axios.get(`${API_BASE_URL}/students/class/${encodeURIComponent(classIdOrName)}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((s) => ({
        id: s.id || s.studentId || String(s._id || ''),
        studentId: s.studentId || s.id || String(s._id || ''),
        fullName: s.fullName || '',
        studentCode: s.studentCode || '',
        email: s.email || s.contact?.email || '',
        phone: s.phone || s.contact?.phone || '',
        address: s.address || s.contact?.address || '',
        dob: s.dob || s.dateOfBirth || null,
        gender: s.gender || '',
        seatRow: s.seatRow ?? null,
        seatColumn: s.seatColumn ?? null,
        contact: s.contact || {}
    }));
};

export const importStudentsToClass = async (classId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);

    const response = await axios.post(`${API_BASE_URL}/students/import-with-class`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const exportStudentsFromClass = async (classIdOrName) => {
    const response = await axios.get(`${API_BASE_URL}/students/export`, {
        params: {
            className: classIdOrName
        },
        responseType: 'blob'
    });
    return response.data;
};

/**
 * Download a CSV import template for students.
 * Columns: Mã SV, Họ tên, Email, SĐT, Địa chỉ, Giới tính, Ngày sinh
 */
export const downloadImportTemplate = () => {
    const headers = [
        'Mã sinh viên',
        'Họ và tên',
        'Email',
        'Số điện thoại',
        'Địa chỉ',
        'Giới tính',
        'Ngày sinh (YYYY-MM-DD)'
    ].join(',');

    const example = [
        'SV001',
        'Nguyễn Văn A',
        'nguyenvana@example.com',
        '0901234567',
        '"123 Đường ABC, TP.HCM"',
        'Nam',
        '2000-01-15'
    ].join(',');

    const csvContent = `${headers}\n${example}`;
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_import_sinhvien.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
