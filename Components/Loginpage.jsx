import React, { useState } from 'react';
import ResetPassword from './ResetPassword';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showResetPassword, setShowResetPassword] = useState(false);

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

      if (response.ok) {
        const data = await response.json();
        alert(`Login successful. Welcome, ${data.name}`);
        // Pass both username and email to the onLogin function
        onLogin(data.name, formData.email);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleResetPassword = () => {
    setShowResetPassword(true);
  };

  const handleResetPasswordClose = () => {
    setShowResetPassword(false);
  };

  return (
    <div className="login-container">
      {!showResetPassword && (
        <form className="login-page" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={handleResetPassword} >Reset Password</button>
        </form>
      )}

      {showResetPassword && (
        <ResetPassword email={formData.email} onClose={handleResetPasswordClose} />
      )}
    </div>
  );
};

export default LoginPage;
