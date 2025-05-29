import React, { useState, useEffect } from 'react'; // <-- Add useEffect
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // <-- ADD THESE IMPORTS
import MemberList from './components/MemberList'; // Keep if used for Librarian/Admin
import MemberDetails from './components/MemberDetails'; // Keep if used for Librarian/Admin
import './App.css';
import MemberSignUpForm from './components/MemberSignUpForm'; // Keep if used for Librarian/Admin
import UserRegistrationForm from './components/UserRegistrationForm';
import UserLoginForm from './components/UserLoginForm';
import MemberDashboard from './components/MemberDashboard';

function App() {
    // We will use these states for managing login status globally
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null); // { username: "...", role: "..." }

    // This useEffect runs once when the component mounts
    // to check for an existing login session in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('loggedInUser');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsLoggedIn(true);
                setLoggedInUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                // Clear invalid data if parsing fails
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('loggedInUser');
                setIsLoggedIn(false);
                setLoggedInUser(null);
            }
        }
    }, []); // Empty dependency array means it runs only once on mount

    // Your existing handleSelectMember, handleBack etc. might still be used by MemberList/MemberDetails
    // Keep them if they are still needed for non-login related functionalities in other dashboards.
    // For now, I'll keep them as they are not directly related to JWT.
    const [selectedMember, setSelectedMember] = useState(null);
    
    const handleSelectMember = (member) => {
        setSelectedMember(member);
    };
    const handleBack = () => {
        setSelectedMember(null);
    };
    // handleShowRegistration and handleBackFromRegistration will be replaced by routing
    // You can remove them if UserRegistrationForm is routed directly.

    // This handleLogin function is no longer strictly needed in App.jsx
    // because UserLoginForm now handles local storage and updates setIsLoggedIn/setLoggedInUser directly.
    // const handleLogin = (user) => {
    //     setLoggedInUser(user);
    // };

    // This handleLogout function is updated to clear localStorage
    const handleLogout = () => {
        localStorage.removeItem('jwtToken'); // Remove JWT token
        localStorage.removeItem('loggedInUser'); // Remove stored user details
        setIsLoggedIn(false);
        setLoggedInUser(null);
    };

    // Helper component for logout button with navigation
    const LogoutButton = () => {
        const navigate = useNavigate();
        const doLogout = () => {
            handleLogout();
            navigate('/login'); // Redirect to login page after logout
        };
        return <button onClick={doLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>;
    };

    return (
        <Router> {/* Wrap your entire app in Router */}
            <div className="App" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
                <h1 style={{ color: '#333' }}>Library Management System</h1>
                <nav style={{ marginBottom: '20px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                        <li><Link to="/">Home</Link></li>
                        {!isLoggedIn && (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li> {/* Link to your registration form */}
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                {/* Dynamically show dashboard link based on role */}
                                {loggedInUser && loggedInUser.role === 'MEMBER' && (
                                    <li><Link to="/member-dashboard">Member Dashboard</Link></li>
                                )}
                                {/* Add links for Admin/Librarian if applicable */}
                                {loggedInUser && (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'LIBRARIAN') && (
                                    <li><Link to="/admin-dashboard">Admin/Librarian Dashboard</Link></li>
                                )}
                                <li><LogoutButton /></li> {/* Use the LogoutButton component */}
                            </>
                        )}
                    </ul>
                </nav>

                <Routes> {/* Define your routes here */}
                    {/* Public routes */}
                    <Route path="/" element={<h2>Welcome to the Library!</h2>} />
                    <Route 
                        path="/login" 
                        element={<UserLoginForm 
                            setIsLoggedIn={setIsLoggedIn} 
                            setLoggedInUser={setLoggedInUser} 
                            // onShowRegistration is a prop from your previous code, 
                            // but if you have a /register route, you might just link to it.
                            // If this prop is essential for a button inside UserLoginForm, keep it.
                            onShowRegistration={() => { /* Implement navigation to /register if needed */ }} 
                        />} 
                    />
                    <Route path="/register" element={<UserRegistrationForm /* Add props if needed */ />} />

                    {/* Protected Routes (Conditional rendering based on login status and role) */}
                    {/* Member Dashboard */}
                    {isLoggedIn && loggedInUser && loggedInUser.role === 'MEMBER' ? (
                        <Route path="/member-dashboard" element={<MemberDashboard loggedInUser={loggedInUser} />} />
                    ) : (
                        // If not logged in or not a member, redirect to login or show access denied
                        <Route path="/member-dashboard" element={<p>Please log in as a member to view this page.</p>} />
                        // For a better UX, you could use <Route path="/member-dashboard" element={<Navigate to="/login" replace />} />
                        // (requires 'Navigate' import from 'react-router-dom')
                    )}
                    
                    {/* Admin/Librarian Dashboard */}
                    {isLoggedIn && loggedInUser && (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'LIBRARIAN') ? (
                        <Route path="/admin-dashboard" element={
                            <div>
                                <h2>Welcome, {loggedInUser.username}! (Admin/Librarian Dashboard)</h2>
                                {/* Your existing Librarian-specific content goes here */}
                                {selectedMember ? (
                                    <MemberDetails member={selectedMember} onBack={handleBack} />
                                ) : (
                                    <>
                                        <MemberList onSelectMember={handleSelectMember} />
                                        <MemberSignUpForm /> {/* Assuming this is part of librarian functions */}
                                    </>
                                )}
                            </div>
                        } />
                    ) : (
                        <Route path="/admin-dashboard" element={<p>Access denied. Requires Admin/Librarian role.</p>} />
                    )}

                    {/* Fallback for unmatched paths */}
                    <Route path="*" element={<p>Page Not Found</p>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;