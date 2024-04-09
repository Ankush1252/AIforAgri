import React, { useState } from 'react';
import './App.css';
import './Login.css';
import './UserDash.css';
import './style.css'

import LoginPage from './Components/Loginpage';
import NavBar from './Components/Navbar';
import RegistrationForm from './Components/RegistrationForm';
import UserDash from './Components/UserDash';

const App = () => {
  const [showRegistration, setShowRegistration] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [contactInfo,setContactInfo] =  useState('')

  const handleLoginClick = () => {
    setShowRegistration(false);
    
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleLogoClick = () => {
    setShowRegistration(true);
  };

  const handleLogin = (username, contactInfo) => {
    setIsLoggedIn(true);
    setUsername(username);
    setContactInfo(contactInfo)
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
      
        alert('Registration successful');
      } else {
      
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <NavBar onLoginClick={handleLoginClick} onLogoutClick={handleLogoutClick} onLogoClick={handleLogoClick} isLoggedIn={isLoggedIn} />
      {showRegistration && <RegistrationForm onSubmit={handleSubmit} />}
      {!showRegistration && !isLoggedIn && <LoginPage onLogin={handleLogin} />}
      {isLoggedIn && <UserDash userName={username} contactInfo={contactInfo} />}
    </div>
  );
};

export default App;
