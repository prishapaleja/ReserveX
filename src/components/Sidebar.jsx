import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname;
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      name: 'Approvals',
      path: '/approvals',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      name: 'Rooms',
      path: '/rooms',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 17H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" />
          <path d="M22 7H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
          <path d="M12 2v20" />
          <path d="M6 10h4M6 20h4M14 10h4M14 20h4" />
        </svg>
      ),
    },
    {
      name: 'Academic',
      path: '/academic',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      name: 'Admin Control',
      path: '/admin-control',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      name: 'Communication',
      path: '/communication',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      name: 'Timetable',
      path: '/timetable',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="14" x2="8" y2="14" />
          <line x1="12" y1="14" x2="12" y2="14" />
          <line x1="16" y1="14" x2="16" y2="14" />
        </svg>
      ),
    },
    {
      name: 'Logout',
      path: '/login',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-[300px] min-w-[300px] min-h-screen bg-white flex flex-col justify-between py-10 font-manrope border-r border-[#EAEFF7]">
      <div className="px-10">
        <h1 className="font-averia text-[36px] text-[#232051] mb-12 font-bold tracking-tight">ReserveX</h1>

        <nav className="flex flex-col">
          {navItems
            .filter(item => {
              if (item.name === 'Admin Control' && user?.role !== 'ADMIN') return false;
              return true;
            })
            .map((item, index) => {
              const isActive = activeNav === item.path || (activeNav === '/' && item.path === '/dashboard');

              return (
                <div key={item.name} className={index !== 0 && index !== navItems.length - 1 ? 'border-b border-[#F4F5F8]' : ''}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.name == 'Logout') {
                        logoutAction();
                        navigate('/login');
                        return;
                      }
                      if (!item.disabled) navigate(item.path);
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-[18px] transition-colors cursor-pointer ${isActive
                      ? 'bg-[#232051] text-white rounded-2xl shadow-md my-1'
                      : 'text-[#848795] hover:text-[#232051] bg-transparent'
                      }`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-[#848795]'} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.name}
                    </span>
                  </button>
                </div>
              );
            })}
        </nav>
      </div>

      <div className="px-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#EAEFF7] flex items-center justify-center text-[#232051] bg-[#F9FAFC] shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#232051] font-bold text-[14px] leading-tight">{user?.name || 'Loading'}</span>
            <span className="text-[#848795] font-bold text-[10px] uppercase tracking-wider mt-[2px]">{user?.role || 'ReserveX User'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;