import React from 'react';
import  { useState } from 'react';
import './App.css';
import './Login.css'
import LoginPage from './Components/Loginpage';
import NavBar from './Components/Navbar';
import RegistrationForm from './Components/RegistrationForm';
import UserDash from './Components/UserDash';

const App = () => {
  const [showRegistration, setShowRegistration] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setShowRegistration(false);
    setShowLogin(true);
  }
  const handleLogin = () => {
    
  
    setIsLoggedIn(true);
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
      <NavBar onLoginClick={handleLoginClick} />
      {showRegistration && <RegistrationForm onSubmit={handleSubmit} />}
      {showLogin && <LoginPage onLogin={handleLogin} />}
      {isLoggedIn && <UserDash />}
    </div>
    
  
  );
};

export default App;
