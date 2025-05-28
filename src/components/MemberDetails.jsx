import React, { useState } from 'react';
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

const MemberDetails = ({ member, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: member?.name || '',
    contactInfo: member?.contactInfo || '',
    address: member?.address || '',
  });
  const [message, setMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // New state for dialog

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '',
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: member?.name || '',
      contactInfo: member?.contactInfo || '',
      address: member?.address || '',
    });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/members/${member.id}`, formData);
      setMessage('Member updated successfully!');
      setIsEditing(false);
      console.log('Update response:', response.data);
    } catch (error) {
      setMessage('Error updating member: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    setOpenDialog(false); // Close dialog after confirmation
    try {
      await axios.delete(`http://localhost:8080/api/members/${member.id}`);
      setMessage('Member deleted successfully!');
      onBack(); // Return to the member list after deletion
    } catch (error) {
      setMessage('Error deleting member: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!member) return null;

  return (
    <div>
      <h2>Member Details</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Info (Email/Phone)"
            name="contactInfo"
            value={formData.contactInfo || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div>
          <p><strong>ID:</strong> {member.id}</p>
          <p><strong>Name:</strong> {member.name}</p>
          <p><strong>Address:</strong> {member.address || 'N/A'}</p>
          <p><strong>Contact Info:</strong> {member.contactInfo}</p>
          <p><strong>Registration Date:</strong> {member.registrationDate}</p>
          <p><strong>Membership Expiry Date:</strong> {member.membershipExpiryDate}</p>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEdit}
            style={{ marginRight: '10px' }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenDialog}
            style={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <button onClick={onBack}>Back to List</button>
        </div>
      )}
      {message && (
        <Typography
          color={message.includes('Error') ? 'error' : 'success'}
          style={{ marginTop: '10px' }}
        >
          {message}
        </Typography>
      )}
      {/* Added: Dialog for delete confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {member.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MemberDetails;