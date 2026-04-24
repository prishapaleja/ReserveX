import React from 'react';
import './TopBar.css';

const TopBar = ({ userName = 'Prisha Paleja', userRole = 'Teacher' }) => {
  return (
    <div className="topbar">
      {/* Left side: Search */}
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6884DE" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input placeholder="search for anything..." />
      </div>

      {/* Right side: Bell & Profile */}
      <div className="topbar-right">
        <button className="topbar-bell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A7BAEF" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        
        <div className="topbar-profile">
          <div className="topbar-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div className="topbar-user-info">
            <div className="topbar-name">{userName}</div>
            <div className="topbar-role">{userRole}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;