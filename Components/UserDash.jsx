import React, { useState } from 'react';

function UserDash({ userName, email }) {
  const [activeTab, setActiveTab] = useState('crops');
  const [formData, setFormData] = useState({
    email: email,
    crop1: '',
    crop2: '',
    crop3: '',
    crop4: '',
    crop5: ''
  });
  const [cropHistory, setCropHistory] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      fetchCropHistory();
    } else if (tab === 'recommendation') {
      window.location.href = 'https://sad-jobs-occur.loca.lt/';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/saveCrops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save crop data');
      }

      setFormData({
        email: email,
        crop1: '',
        crop2: '',
        crop3: '',
        crop4: '',
        crop5: ''
      });

      alert('Crop data submitted successfully');
      console.log('Crop data saved successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCropHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cropHistory/${email}`);

      if (!response.ok) {
        throw new Error('Failed to fetch crop history');
      }

      const data = await response.json();
      setCropHistory(data);
    } catch (error) {
      console.error('Error fetching crop history:', error);
    }
  };

  const renderCropHistory = () => {
    return (
      <table className="crop-history-table">
        <thead>
          <tr>
            <th className="px-4 py-2">Crop 1</th>
            <th className="px-4 py-2">Crop 2</th>
            <th className="px-4 py-2">Crop 3</th>
            <th className="px-4 py-2">Crop 4</th>
            <th className="px-4 py-2">Crop 5</th>
          </tr>
        </thead>
        <tbody>
          {cropHistory.map((crop, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{crop.crop1}</td>
              <td className="border px-4 py-2">{crop.crop2}</td>
              <td className="border px-4 py-2">{crop.crop3}</td>
              <td className="border px-4 py-2">{crop.crop4}</td>
              <td className="border px-4 py-2">{crop.crop5}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  

  const renderContent = () => {
    switch (activeTab) {
      case 'crops':
        return (
          <div className="content">
            <form className="form1" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email"></label>
                <input type="hidden" id="email" name="email" value={formData.email}  />
              </div>
              <div className="form-group">
                <label htmlFor="crop1"> Add Recent Crops</label>
                <input type="text" id="crop1" name="crop1" value={formData.crop1} onChange={handleChange} placeholder="Crop 1" />
              </div>
              <div className="form-group">
                <label htmlFor="crop2"></label>
                <input type="text" id="crop2" name="crop2" value={formData.crop2} onChange={handleChange} placeholder="Crop 2" />
              </div>
              <div className="form-group">
                <label htmlFor="crop3"></label>
                <input type="text" id="crop3" name="crop3" value={formData.crop3} onChange={handleChange} placeholder="Crop 3" />
              </div>
              <div className="form-group">
                <label htmlFor="crop4"></label>
                <input type="text" id="crop4" name="crop4" value={formData.crop4} onChange={handleChange} placeholder="Crop 4" />
              </div>
              <div className="form-group">
                <label htmlFor="crop5"></label>
                <input type="text" id="crop5" name="crop5" value={formData.crop5} onChange={handleChange} placeholder="Crop 5" />
              </div>
              <button type="submit" >Submit</button>
            </form>
          </div>
        );
      case 'recommendation':
        return null;
      case 'history':
        return (
          <div className="content">
            <h1>Crop History</h1>
            {renderCropHistory()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="name-and-details">
        <h1>{userName}</h1>
      </div>
      <div className="user-data-screen">
        <div className="sidebar">
          <div className={`box ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => handleTabChange('crops')}>
            Cultivated Crops
          </div>
          <div className={`box ${activeTab === 'recommendation' ? 'active' : ''}`} onClick={() => handleTabChange('recommendation')}>
            Recommendation
          </div>
          <div className={`box ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')}>
            History
          </div>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </>
  );
}

export default UserDash;
