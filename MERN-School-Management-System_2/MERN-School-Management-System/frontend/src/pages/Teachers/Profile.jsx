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

const TeacherProfileSection = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [teacherInfo, setTeacherInfo] = useState({
        name: "",
        email: "",
        phone: "N/A",
        address: "N/A",
        qualification: "Giảng viên"
    });
    const [teacherId, setTeacherId] = useState("");
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setTeacherId(user.teacherId || "");
            setTeacherInfo({
                name: user.fullName || "N/A",
                email: (user.username ? user.username + "@school.edu.vn" : "") || "N/A",
                phone: "N/A",
                address: "N/A",
                qualification: "Giảng viên"
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchCurrentTeacher = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const loginUser = JSON.parse(storedUser);
                const idToUse = loginUser.teacherId || loginUser.userId || loginUser.username;
                if (!idToUse) return;

                const response = await axios.get("http://localhost:8080/api/v1/teachers/getall");
                const teachers = response.data?.teachers || [];
                const found = teachers.find((t) => {
                    return (
                        (t.id && String(t.id) === String(loginUser.teacherId)) ||
                        (t.userId && String(t.userId) === String(loginUser.userId)) ||
                        (t.fullName && String(t.fullName) === String(loginUser.fullName))
                    );
                });
                if (!found) return;

                setCurrentTeacher(found);
                setTeacherId(found.id || loginUser.teacherId || "");
                setTeacherInfo((prev) => ({
                    ...prev,
                    name: found.fullName || prev.name,
                    email: found.email || prev.email,
                    phone: found.phone || prev.phone
                }));
            } catch (error) {
                console.error("Fetch teacher profile error:", error);
            }
        };

        fetchCurrentTeacher();
    }, []);

    const handleStartEdit = () => {
        if (!currentTeacher) return;
        setEditFullName(currentTeacher.fullName || "");
        setEditEmail(currentTeacher.email || "");
        setEditPhone(currentTeacher.phone || "");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaving(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentTeacher?.id) return;

        try {
            setSaving(true);
            const payload = {
                ...currentTeacher,
                fullName: editFullName,
                email: editEmail,
                phone: editPhone
            };

            await axios.put(`http://localhost:8080/api/v1/teachers/${currentTeacher.id}`, payload);

            setTeacherInfo((prev) => ({
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
            alert("Teacher profile updated!");
        } catch (error) {
            console.error("Update teacher profile error:", error);
            alert("Cập nhật profile thất bại: " + (error.response?.data?.message || error.message || ""));
        } finally {
            setSaving(false);
        }
    };

    return(
        <ProfileContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ProfileContent>
                    <ProfileHeader>Teacher Profile Details</ProfileHeader>
                    <ProfileCard>
                        {!isEditing ? (
                            <>
                                <ProfileAvatar>
                                    {teacherInfo.name ? teacherInfo.name.charAt(0).toUpperCase() : 'T'}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Name</Label>
                                        <Value>{teacherInfo.name}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Email</Label>
                                        <Value>{teacherInfo.email}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Phone</Label>
                                        <Value>{teacherInfo.phone || "N/A"}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Qualification</Label>
                                        <Value>{teacherInfo.qualification}</Value>
                                    </ProfileDetailRow>
                                </ProfileDetails>
                                <ButtonContainer>
                                    <EditButton
                                        onClick={handleStartEdit}
                                        style={{ marginRight: "10px" }}
                                        disabled={!currentTeacher}
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
                                    {(editFullName || teacherInfo.name || "T").charAt(0).toUpperCase()}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Name</Label>
                                        <Value style={{ textAlign: "right" }}>
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
                                        <Value style={{ textAlign: "right" }}>
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
                                        <Value style={{ textAlign: "right" }}>
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
    )
}

export default TeacherProfileSection