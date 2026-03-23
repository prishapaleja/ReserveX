import React from 'react';
import './TopBar.css';

const TopBar = ({ userName = 'Prisha Paleja', userRole = 'Teacher' }) => {
  return (
    <div className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(30,50,120,0.6)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input placeholder="search for anything..." />
      </div>

      {/* Bell */}
      <button className="topbar-icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(30,50,120,0.7)" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      </button>

      {/* Profile */}
      <div className="topbar-profile">
        <div className="topbar-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(30,50,120,0.6)">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div>
          <div className="topbar-name">{userName}</div>
          <div className="topbar-role">{userRole}</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;