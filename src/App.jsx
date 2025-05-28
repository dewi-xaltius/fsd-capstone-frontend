import { useState } from 'react';
import MemberList from './components/MemberList';
import MemberDetails from './components/MemberDetails';
import './App.css';
import MemberSignUpForm from './components/MemberSignUpForm';
import UserRegistrationForm from './components/UserRegistrationForm';
import UserLoginForm from './components/UserLoginForm';

function App() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const handleBack = () => {
    setSelectedMember(null);
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
  };

  const handleBackFromRegistration = () => {
    setShowRegistration(false);
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <div className="App">
      <h1>Library Management System</h1>
      {loggedInUser ? (
        <div>
          <button onClick={handleLogout} style={{ marginBottom: '10px' }}>
            Logout
          </button>
          {loggedInUser.role === 'LIBRARIAN' ? (
            <div>
              <h2>Welcome, Librarian!</h2>
              <p>Placeholder for Book Management (to be implemented)</p>
              {selectedMember ? (
                <MemberDetails member={selectedMember} onBack={handleBack} />
              ) : (
                <>
                  <MemberList onSelectMember={handleSelectMember} />
                  <MemberSignUpForm />
                </>
              )}
            </div>
          ) : (
            <div>
              <h2>Welcome, Member!</h2>
              <p>View your profile and borrowed books (to be implemented)</p>
            </div>
          )}
        </div>
      ) : showRegistration ? (
        <UserRegistrationForm onBack={handleBackFromRegistration} />
      ) : (
        <UserLoginForm onLogin={handleLogin} onShowRegistration={handleShowRegistration} />
      )}
    </div>
  );
}

export default App;