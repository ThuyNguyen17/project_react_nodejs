import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TeacherSignInContainer,
    FormContainer,
    InputField,
    SubmitButton
} from '../styles/TeacherSignInStyles';

const TeacherSignin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/students/login-new', {
                username,
                password
            });
            if (response.data && (response.data.role === 'LECTURER' || response.data.role === 'TEACHER')) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/teacher/dashboard');
            } else {
                alert('Tài khoản không phải Giảng viên hoặc thông tin không chính xác');
            }
        } catch (error) {
            console.error('Teacher Sign In error:', error);
            alert('Lỗi đăng nhập: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
        }
    };
    
    return (
        <TeacherSignInContainer>
            <h2>Teacher Sign In</h2>
            <FormContainer onSubmit={handleSignIn}>
                <InputField 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <InputField 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <SubmitButton type="submit">
                    Sign In
                </SubmitButton>
            </FormContainer>
        </TeacherSignInContainer>
    )
}

export default TeacherSignin;