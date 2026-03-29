import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminSignInContainer,
    FormContainer,
    InputField,
    SubmitButton
} from '../styles/AdminSignInStyles';

const AdminSignin = () => {
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
            if (response.data && response.data.role === 'ADMIN') {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/admin/dashboard');
            } else {
                alert('Tài khoản không phải Admin hoặc thông tin không chính xác');
            }
        } catch (error) {
            console.error('Admin Sign In error:', error);
            alert('Lỗi đăng nhập: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
        }
    };
    
    return (
        <AdminSignInContainer>
            <h2>Admin Sign In</h2>
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
                <p style={{ marginTop: '20px' }}>
                    Don't have an account? <span 
                        style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/admin-signUp')}
                    >Register here</span>
                </p>
            </FormContainer>
        </AdminSignInContainer>
    )
}

export default AdminSignin;