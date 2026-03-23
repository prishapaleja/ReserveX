import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

const Dashboard = () => {
  const timetable = [
    { time: '8:00 am', subject: 'Open Elective – Digital Marketing Management', location: 'Class C3 · Classroom D3' },
    { time: '9:00 am', subject: 'Open Elective – Digital Marketing Management', location: 'Class C3 · Classroom D3' },
    { time: '10:00 am', subject: 'Break', location: null },
    { time: '11:00 am', subject: 'Artificial Intelligence', location: 'Class C1 · Classroom B1' },
    { time: '12:00 pm', subject: 'Operating Systems', location: 'Class C2 · Classroom B2' },
    { time: '1:00 pm', subject: 'Meeting', location: 'Staff Lounge' },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebar />

      <div className="main-content">
        <TopBar userName="Prisha Paleja" userRole="Teacher" />

        {/* Highlights */}
        <div className="highlights-section">
          <h2 className="section-title">Highlights</h2>
          <div className="highlights-grid">

            <div className="highlight-card">
              <div className="highlight-label">Upcoming Lectures</div>
              <div className="highlight-number">3</div>
            </div>

            <div className="highlight-card">
              <div className="highlight-label">Current Lecture</div>
              <div className="highlight-time-row">
                <span className="highlight-time">11:00 am</span>
                <span className="highlight-subject">Artificial Intelligence</span>
              </div>
              <div className="highlight-location">Class C1 · Classroom B1</div>
            </div>

            <div className="highlight-card">
              <div className="highlight-label">Next Lecture</div>
              <div className="highlight-time-row">
                <span className="highlight-time">12:00 pm</span>
                <span className="highlight-subject">Operating Systems</span>
              </div>
              <div className="highlight-location">Class C2 · Classroom B2</div>
            </div>

            <div className="highlight-card">
              <div className="highlight-label">Requests Pending</div>
              <div className="highlight-number">2</div>
            </div>

          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">

          {/* Today's Timetable */}
          <div>
            <div className="timetable-header">
              <h2 className="section-title-sm">Today's Timetable</h2>
              <div className="calendar-icon-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e50b4" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
            <div className="dark-card">
              {timetable.map((item, i) => (
                <div key={i} className="timetable-row">
                  <span className="timetable-time">{item.time}</span>
                  <div>
                    <div className="timetable-subject">{item.subject}</div>
                    {item.location && <div className="timetable-location">{item.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="section-title">Notifications</h2>
            <div className="notifications-card">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="notification-pill" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;