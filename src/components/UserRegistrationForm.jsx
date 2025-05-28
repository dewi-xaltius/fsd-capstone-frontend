import React, { useState } from 'react';
import { TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';

const UserRegistrationForm = ({ onBack }) => {
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
      const response = await axios.post('http://localhost:8080/api/users', formData);
      setMessage('User registered successfully!');
      setFormData({ username: '', password: '', role: 'MEMBER' }); // Reset form
      console.log('Response:', response.data);
    } catch (error) {
      setMessage('Error registering user: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Register New User</h2>
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
        <Button variant="contained" color="primary" type="submit">
          Register
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onBack}
          style={{ marginLeft: '10px' }}
        >
          Back
        </Button>
      </form>
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

export default UserRegistrationForm;