import React, { useState } from 'react';
import { TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';

const UserLoginForm = ({ onLogin, onShowRegistration }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'MEMBER', // Default role
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', formData);
      setMessage('Login successful!');
      console.log('Login response:', response.data);
      onLogin(response.data); // Pass user data to App.jsx
    } catch (error) {
      setMessage('Error logging in: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Login to Library System</h2>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Role</FormLabel>
          <RadioGroup
            name="role"
            value={formData.role}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="MEMBER" control={<Radio />} label="Member" />
            <FormControlLabel value="LIBRARIAN" control={<Radio />} label="Librarian" />
          </RadioGroup>
        </FormControl>
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