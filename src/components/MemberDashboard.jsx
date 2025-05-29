import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MemberDashboard({ loggedInUser }) {
    const [memberProfile, setMemberProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMemberProfile = async () => {
            if (!loggedInUser || !loggedInUser.username) {
                setLoading(false);
                setError('No logged in user found.');
                return;
            }

            // Retrieve JWT token from localStorage
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setLoading(false);
                setError('Authentication token not found. Please log in again.');
                return;
            }

            try {
                // Include the Authorization header with the Bearer token
                const response = await axios.get(`http://localhost:8080/api/members/byUsername/${loggedInUser.username}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // <--- THIS IS THE CRUCIAL LINE
                    }
                });
                setMemberProfile(response.data);
            } catch (err) {
                console.error('Failed to fetch member profile:', err);
                if (err.response && err.response.status === 403) {
                    setError('Access Denied. You do not have permission to view this profile. (Token invalid or insufficient rights)');
                } else if (err.response && err.response.status === 404) {
                    setError('Member profile not found.');
                } else if (err.response) {
                    // For other HTTP errors, display the backend message if available
                    setError(`Failed to load profile: ${err.response.status} - ${err.response.data || err.message}`);
                } else {
                    setError('Failed to load your profile. Please check network connection.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMemberProfile();
    }, [loggedInUser]); // Re-run effect if loggedInUser changes

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!memberProfile) {
        return <p>No profile data available.</p>;
    }

    // Ensure these fields match what your backend's Member DTO returns
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Your Profile</h2>
            <p><strong>Name:</strong> {memberProfile.name}</p>
            <p><strong>Address:</strong> {memberProfile.address}</p>
            <p><strong>Contact Info:</strong> {memberProfile.contactInfo}</p>
            <p><strong>Registration Date:</strong> {memberProfile.registrationDate}</p>
            <p><strong>Membership Expiry:</strong> {memberProfile.membershipExpiryDate}</p>
            {/* Add more fields as per your Member DTO/entity that is returned */}
        </div>
    );
}

export default MemberDashboard;