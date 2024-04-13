import React, { useState } from 'react';

const ResetPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
        alert('Password reset email sent. Check your inbox.');
      } else {
        throw new Error('Failed to send reset password email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('User is not Registered');
    }
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeOtp = (e) => {
    setOtp(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

//   const handleChangeSuccessMessage = (message) => {
//     setSuccessMessage(message);
//   };

  const handleClose = () => {
    onClose();
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reset-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (response.ok) {
        // handleChangeSuccessMessage('Password successfully reset.');
        alert('Password successfully reset');
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  return (
    
    <div className="reset-page">
      {!otpSent ? (
        <div className='form-group'>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Enter your email"
            required
          /><br/><br/>
          <button type='submit' onClick={handleSendOTP}>Send OTP</button>
        </div>
      ) : (
        <div className='form-group'>
            <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={handleChangeOtp}
            placeholder="Enter OTP"
            required
          />
          <br/><br/>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleChangeNewPassword}
            placeholder="Create new password"
            required
          />
          <br/><br/>
          <button type='submit' onClick={handleResetPassword}>Change Password</button>
        </div>
      )}
      <button className='btn' onClick={handleClose}>Close</button>
      {/* <p>{successMessage}</p> */}
    </div>
 
  );
};

export default ResetPassword;
