// Loginpage.jsx
import React, { useState } from 'react';

const Loginpage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    contactInfo: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      // Login successful
      const data = await response.json();
      alert(`Login successful. Welcome, ${data.name}`);
  
      setFormData({
        contactInfo: '',
        password: '',
      });
  
      // Pass both username and contactInfo to the onLogin function
      onLogin(data.name, formData.contactInfo);
  
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };
  

  return (
    <form className="login-page" onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="contactInfo">Contact Number</label>
        <input type="text" id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Loginpage;
