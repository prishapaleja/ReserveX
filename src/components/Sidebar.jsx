import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Approvals',
      path: '/approvals',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'Rooms',
      path: '/rooms',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const bottomNav = [
    {
      name: 'Settings',
      path: '/settings',
      className: 'sidebar-btn',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Help',
      path: '/help',
      className: 'sidebar-btn',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Logout',
      path: '/login',
      className: 'sidebar-btn danger',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'Delete Account',
      path: null,
      className: 'sidebar-btn danger-strong',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
          <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 8l1 12h12L19 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onMouseEnter={() => setIsOpen(false)}
      />

      <div 
        className={`sidebar-container ${isOpen ? 'active' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div className="sidebar-hover-zone"></div>

        <div className="sidebar-pull-tab">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <div className="sidebar-panel">
          <div className="sidebar-panel-logo">
            <img src="/reservex_logo.svg" alt="ReserveX Logo" style={{ height: '36px', width: 'auto' }} />
          </div>

          <div className="sidebar-main-nav">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`sidebar-btn ${activeNav === item.path || (activeNav === '/' && item.path === '/dashboard') ? 'active' : ''}`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>

          <div className="sidebar-bottom-nav">
            {bottomNav.map(item => (
              <button
                key={item.name}
                className={item.className}
                onClick={() => item.path && navigate(item.path)}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;