import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    ProfileContainer,
    Content,
    ProfileContent,
    ProfileHeader,
    ProfileCard,
    ProfileAvatar,
    ProfileDetails,
    ProfileDetailRow,
    Label,
    Value,
    ButtonContainer,
    EditButton
} from "../../styles/SettingsProfileStyles";

const ProfileSection = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [studentProfile, setStudentProfile] = useState({
        name: "",
        studentCode: "",
        grade: "",
        school: "Trường THPT Chuyên ABC",
        email: "",
        phone: "N/A"
    });
    const [studentId, setStudentId] = useState("");
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Fallback to studentCode if studentId is missing
            const idToUse = user.studentId || user.studentCode || "";
            setStudentId(idToUse);
            setStudentProfile({
                name: user.fullName || "N/A",
                studentCode: user.studentCode || "N/A",
                grade: user.className || "N/A",
                school: "Trường THPT Chuyên ABC",
                email: (user.username ? user.username + "@school.edu.vn" : "") || "N/A",
                phone: "N/A"
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchCurrentStudent = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const loginUser = JSON.parse(storedUser);
            const idOrCode = loginUser.studentId || loginUser.studentCode || loginUser.userId;
            if (!idOrCode) return;

            try {
                const response = await axios.get(`http://localhost:8080/api/students/${encodeURIComponent(idOrCode)}`);
                const found = response.data;
                if (found) {
                    setCurrentStudent(found);
                    setStudentId(found.id || idOrCode);
                    setStudentProfile((prev) => ({
                        ...prev,
                        name: found.fullName || prev.name,
                        studentCode: found.studentCode || prev.studentCode,
                        email: found.contact?.email || prev.email,
                        phone: found.contact?.phone || prev.phone
                    }));
                    return;
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Fetch student profile error:", error);
                }
            }

            try {
                const listResponse = await axios.get('http://localhost:8080/api/students');
                const allStudents = listResponse.data || [];
                const foundByStudent = allStudents.find((student) =>
                    student.studentCode === loginUser.studentCode ||
                    student.id === loginUser.studentId ||
                    student._id === loginUser.studentId ||
                    student.userId === loginUser.userId
                );
                if (foundByStudent) {
                    setCurrentStudent(foundByStudent);
                    setStudentId(foundByStudent.id || loginUser.studentId || loginUser.studentCode || loginUser.userId);
                    setStudentProfile((prev) => ({
                        ...prev,
                        name: foundByStudent.fullName || prev.name,
                        studentCode: foundByStudent.studentCode || prev.studentCode,
                        email: foundByStudent.contact?.email || prev.email,
                        phone: foundByStudent.contact?.phone || prev.phone
                    }));
                    return;
                }
            } catch (listError) {
                console.error("Fallback fetch student profile error:", listError);
            }
        };

        fetchCurrentStudent();
    }, []);

    const handleStartEdit = () => {
        if (!currentStudent) {
            alert("Chưa tải được thông tin học sinh, vui lòng thử lại sau vài giây.");
            return;
        }
        setEditFullName(currentStudent.fullName || "");
        setEditEmail(currentStudent.contact?.email || "");
        setEditPhone(currentStudent.contact?.phone || "");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaving(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Support both id and _id for wide compatibility
        const idToUpdate = currentStudent?.id || currentStudent?._id;
        if (!idToUpdate) {
            alert("Lỗi: Không tìm thấy ID học sinh để cập nhật.");
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...currentStudent,
                fullName: editFullName,
                contact: {
                    ...(currentStudent.contact || {}),
                    email: editEmail,
                    phone: editPhone
                }
            };

            await axios.put(`http://localhost:8080/api/students/${idToUpdate}`, payload);

            setStudentProfile((prev) => ({
                ...prev,
                name: editFullName,
                email: editEmail,
                phone: editPhone
            }));

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                parsed.fullName = editFullName;
                localStorage.setItem("user", JSON.stringify(parsed));
            }

            setIsEditing(false);
            alert("Student profile updated successfully!");
        } catch (error) {
            console.error("Update student profile error:", error);
            const errMsg = error.response?.data?.message || error.message || "Unknown error";
            alert("Cập nhật profile thất bại: " + errMsg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProfileContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ProfileContent>
                    <ProfileHeader>Student Profile Details</ProfileHeader>
                    <ProfileCard>
                        {!isEditing ? (
                            <>
                                <ProfileAvatar>
                                    {studentProfile.name ? studentProfile.name.charAt(0).toUpperCase() : 'S'}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Full Name</Label>
                                        <Value>{studentProfile.name}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Student Code</Label>
                                        <Value>{studentProfile.studentCode}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Class</Label>
                                        <Value>{studentProfile.grade}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>School</Label>
                                        <Value>{studentProfile.school}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Email</Label>
                                        <Value>{studentProfile.email}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Phone</Label>
                                        <Value>{studentProfile.phone || "N/A"}</Value>
                                    </ProfileDetailRow>
                                </ProfileDetails>
                                <ButtonContainer>
                                    <EditButton
                                        onClick={handleStartEdit}
                                        style={{ marginRight: "10px" }}
                                    >
                                        Edit Profile
                                    </EditButton>
                                    <EditButton onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>
                                        Logout
                                    </EditButton>
                                </ButtonContainer>
                            </>
                        ) : (
                            <form onSubmit={handleSave}>
                                <ProfileAvatar>
                                    {(editFullName || studentProfile.name || "S").charAt(0).toUpperCase()}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Full Name</Label>
                                        <Value>
                                            <input
                                                value={editFullName}
                                                onChange={(e) => setEditFullName(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 320,
                                                    padding: "10px 12px",
                                                    borderRadius: 8,
                                                    border: "1px solid #ccc"
                                                }}
                                                required
                                            />
                                        </Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Email</Label>
                                        <Value>
                                            <input
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 320,
                                                    padding: "10px 12px",
                                                    borderRadius: 8,
                                                    border: "1px solid #ccc"
                                                }}
                                            />
                                        </Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Phone</Label>
                                        <Value>
                                            <input
                                                value={editPhone}
                                                onChange={(e) => setEditPhone(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 320,
                                                    padding: "10px 12px",
                                                    borderRadius: 8,
                                                    border: "1px solid #ccc"
                                                }}
                                            />
                                        </Value>
                                    </ProfileDetailRow>
                                </ProfileDetails>
                                <ButtonContainer>
                                    <EditButton
                                        type="submit"
                                        disabled={saving}
                                        style={{ backgroundColor: saving ? "#5a9acb" : "#28a745" }}
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </EditButton>
                                    <EditButton
                                        type="button"
                                        onClick={handleCancelEdit}
                                        style={{ backgroundColor: "#6c757d", marginLeft: "10px" }}
                                    >
                                        Cancel
                                    </EditButton>
                                </ButtonContainer>
                            </form>
                        )}
                    </ProfileCard>
                </ProfileContent>
            </Content>
        </ProfileContainer>
    );
};

export default ProfileSection