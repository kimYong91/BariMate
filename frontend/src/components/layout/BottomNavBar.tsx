import React from 'react';
import '../../styles/BottomNavBar.css';

const BottomNavBar: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <div className="nav-item active"> {/* Mark Home as active for now */}
        <span className="icon">🏠</span>
        <span>Home</span>
      </div>
      <div className="nav-item">
        <span className="icon">⚙️</span>
        <span>Settings</span>
      </div>
      <div className="nav-item">
        <span className="icon">❤️</span>
        <span>Likes</span>
      </div>
      <div className="nav-item">
        <span className="icon">👤</span>
        <span>Profile</span>
      </div>
    </nav>
  );
};

export default BottomNavBar; 