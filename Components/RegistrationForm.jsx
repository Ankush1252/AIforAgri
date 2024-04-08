import React, { useState } from 'react';

const RegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    state: '',
    district: '',
    taluka: '',
    password: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      name: '',
      contactInfo: '',
      state: '',
      district: '',
      taluka: '',
      password: '',
      agree: false,
    });
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input
        type="text"
        name="contactInfo"
        placeholder="Contact Info"
        value={formData.contactInfo}
        onChange={handleChange}
        required
      />
      <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
      <input
        type="text"
        name="district"
        placeholder="District"
        value={formData.district}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="taluka"
        placeholder="Market"
        value={formData.taluka}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={() => setFormData({ ...formData, agree: !formData.agree })}
        />
        I agree to the terms and conditions
      </label>
      <button type="submit" disabled={!formData.agree}>
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;
