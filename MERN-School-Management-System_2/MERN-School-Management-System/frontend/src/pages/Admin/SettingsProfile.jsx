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
const SettingsProfile = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [adminInfo, setAdminInfo] = useState({
        username: "",
        userId: "",
        role: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setAdminInfo(user);
            setEditUsername(user.username || "");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const handleStartEdit = () => {
        setEditUsername(adminInfo.username || "");
        setEditPassword("");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditPassword("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!adminInfo.userId) return;

        const usernameToSave = (editUsername || "").trim();
        if (!usernameToSave) {
            alert("Username không được để trống");
            return;
        }

        try {
            setSaving(true);
            // password optional (if empty string -> keep existing password)
            await axios.put(`http://localhost:8080/api/users/${adminInfo.userId}`, {
                username: usernameToSave,
                password: editPassword
            });

            const updatedUser = {
                ...adminInfo,
                username: usernameToSave
            };
            setAdminInfo(updatedUser);

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                parsed.username = usernameToSave;
                localStorage.setItem("user", JSON.stringify(parsed));
            }

            setIsEditing(false);
            setEditPassword("");
            alert("Admin profile updated!");
        } catch (error) {
            console.error("Update admin profile error:", error);
            alert("Cập nhật profile thất bại: " + (error.response?.data?.message || error.message || ""));
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProfileContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <ProfileContent>
                    <ProfileHeader>Admin Profile Details</ProfileHeader>
                    <ProfileCard>
                        {!isEditing ? (
                            <>
                                <ProfileAvatar>
                                    {adminInfo.username ? adminInfo.username.charAt(0).toUpperCase() : 'A'}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Username</Label>
                                        <Value>{adminInfo.username || 'Loading...'}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>User ID</Label>
                                        <Value>{adminInfo.userId}</Value>
                                    </ProfileDetailRow>
                                    <ProfileDetailRow>
                                        <Label>Role</Label>
                                        <Value>{adminInfo.role}</Value>
                                    </ProfileDetailRow>
                                </ProfileDetails>
                                <ButtonContainer>
                                    <EditButton onClick={handleStartEdit} style={{ marginRight: '10px' }}>
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
                                    {(editUsername || "A").charAt(0).toUpperCase()}
                                </ProfileAvatar>
                                <ProfileDetails>
                                    <ProfileDetailRow>
                                        <Label>Username</Label>
                                        <Value style={{ textAlign: "right" }}>
                                            <input
                                                value={editUsername}
                                                onChange={(e) => setEditUsername(e.target.value)}
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
                                        <Label>Password</Label>
                                        <Value style={{ textAlign: "right" }}>
                                            <input
                                                type="password"
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                placeholder="(optional)"
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
                                        style={{ backgroundColor: "#6c757d" }}
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

export default SettingsProfile