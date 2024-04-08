import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';

const Loginpage = () => {
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
      const response = await fetch('http://localhost:5000/api/login', { // Update the URL here
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
      // Redirect to dashboard or profile page
      // You can use window.location.href or react-router-dom for navigation
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
