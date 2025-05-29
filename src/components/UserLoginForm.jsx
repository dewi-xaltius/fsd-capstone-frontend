import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLoginForm = ({ setIsLoggedIn, setLoggedInUser, onShowRegistration }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            console.log("DEBUG: Attempting login with username:", formData.username); // ADDED LOG
            const response = await axios.post('http://localhost:8080/api/login', {
                username: formData.username,
                password: formData.password,
            });

            console.log("DEBUG: Login successful! Backend response:", response.data); // ADDED LOG

            const { jwt, username: loggedInUsername, role } = response.data;

            console.log("DEBUG: Value of JWT received from backend:", jwt); // ADDED LOG

            // --- CRITICAL LOCAL STORAGE STEPS ---
            localStorage.setItem('jwtToken', jwt);
            console.log("DEBUG: After localStorage.setItem('jwtToken'), value is:", localStorage.getItem('jwtToken')); // ADDED LOG
            
            localStorage.setItem('loggedInUser', JSON.stringify({ username: loggedInUsername, role }));
            console.log("DEBUG: After localStorage.setItem('loggedInUser'), value is:", localStorage.getItem('loggedInUser')); // ADDED LOG
            // --- END CRITICAL LOCAL STORAGE STEPS ---

            setIsLoggedIn(true);
            setLoggedInUser({ username: loggedInUsername, role });

            setMessage('Login successful!');
            console.log('DEBUG: Login successful, navigating...');

            if (role === 'ADMIN' || role === 'LIBRARIAN') {
                navigate('/admin-dashboard');
            } else if (role === 'MEMBER') {
                navigate('/member-dashboard');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error('DEBUG: Login error details:', error); // ADDED LOG
            if (error.response && error.response.data) {
                setMessage('Error logging in: ' + (error.response.data || 'Please check your credentials.'));
            } else {
                setMessage('Error logging in: Could not connect to the server or unknown error.');
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Login to Library System</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
            </form>
            <Typography style={{ marginTop: '10px' }}>
                Don't have an account?{' '}
                <Button onClick={onShowRegistration} color="primary">
                    Register
                </Button>
            </Typography>
            {message && (
                <Typography
                    color={message.includes('Error') ? 'error' : 'success'}
                    style={{ marginTop: '10px' }}
                >
                    {message}
                </Typography>
            )}
        </div>
    );
};

export default UserLoginForm;