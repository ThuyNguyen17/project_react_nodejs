import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminSignInContainer,
    FormContainer,
    InputField,
    SubmitButton
} from '../styles/AdminSignInStyles';

const AdminSignup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/register-admin', {
                username,
                password
            });
            if (response.data.success) {
                alert('Đăng ký Admin thành công! Vui lòng đăng nhập.');
                navigate('/admin-signIn');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Admin Sign Up error:', error);
            setMessage('Lỗi đăng ký: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
        }
    };
    
    return (
        <AdminSignInContainer>
            <h2 style={{ marginTop: '50px' }}>Admin Sign Up</h2>
            <FormContainer onSubmit={handleSignup}>
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
                    Register
                </SubmitButton>
                {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
                <p style={{ marginTop: '20px' }}>
                    Already have an account? <span 
                        style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/admin-signIn')}
                    >Sign In</span>
                </p>
            </FormContainer>
        </AdminSignInContainer>
    )
}

export default AdminSignup;
