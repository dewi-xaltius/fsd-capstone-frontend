import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const MemberSignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    address: '',
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '',
      // Ensure empty fields are set to an empty string
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/members', formData);
      setMessage('Member added successfully!');
      setFormData((prevData) => ({
        ...prevData,
        name: '',
        contactInfo: '',
        address: '',
      })); // Explicitly reset only the form fields
      console.log('Response:', response.data);
    } catch (error) {
      setMessage('Error adding member: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Sign Up New Member</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name || ''} // Fallback to empty string if undefined
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Info"
          name="contactInfo"
          value={formData.contactInfo || ''} // Fallback to empty string if undefined
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address || ''} // Fallback to empty string if undefined
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Sign Up
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

export default MemberSignUpForm;