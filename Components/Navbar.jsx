import React from 'react';

const NavBar = ({ onLoginClick }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="https://imgs.search.brave.com/uEz12dN3xok4PdPDovpTuV7YKvdERivasgTjZqrCWzc/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9waWN0dXJlLWZh/cm0td2l0aC10cmFj/dG9yLWZpZWxkLXZl/Z2V0YWJsZXNfNzQx/MjEyLTgyMC5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw" alt="Logo" />
        <h1>AI FOR AGREE</h1>
      </div>
      <button onClick={onLoginClick}>Login</button>
    </nav>
  );
};

export default NavBar;
