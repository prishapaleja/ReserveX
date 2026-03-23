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
        <div className="dashboard-logo">
          <img src="/reservex_logo.svg" alt="ReserveX Logo" style={{ height: '36px', width: 'auto' }} />
        </div>

        <div className="topbar-header">
          <TopBar userName="Prisha Paleja" userRole="Teacher" />
        </div>

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
          <div className="dark-card-wrapper">
            <div className="timetable-header">
              <h2 className="section-title-sm">Today's Timetable</h2>
            </div>
            <div className="dark-card">
              <div className="timeline-container">
                {timetable.map((item, i) => (
                  <div key={i} className="timetable-row">
                    <span className="timetable-time">{item.time}</span>
                    <div className="timetable-details">
                      <div className="timetable-subject">{item.subject}</div>
                      {item.location && <div className="timetable-location">{item.location}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dark-card-wrapper">
            <h2 className="section-title-sm" style={{ marginBottom: '16px' }}>Notifications</h2>
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