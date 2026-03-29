import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StudentSignInContainer,
    FormContainer,
    InputField,
    SubmitButton
} from '../styles/StudentSignInStyles';

const StudentSignin = () => {
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
            if (response.data && response.data.role === 'STUDENT') {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/student/dashboard');
            } else {
                alert('Tài khoản không phải Sinh viên hoặc thông tin không chính xác');
            }
        } catch (error) {
            console.error('Student Sign In error:', error);
            alert('Lỗi đăng nhập: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
        }
    };
    
    return (
        <StudentSignInContainer>
            <h2>Student Sign In</h2>
            <FormContainer onSubmit={handleSignIn}>
                <InputField 
                    type="text"
                    placeholder="Username/Student Code"
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
        </StudentSignInContainer>
    )
}

export default StudentSignin;