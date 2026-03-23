import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';
import './Approvals.css';

const Approvals = () => {
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
          <h2 className="section-title">Student Requests</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-label">Requests Pending</div>
              <div className="highlight-number">2</div>
            </div>
            <div className="highlight-card">
              <div className="highlight-label">Approved Today</div>
              <div className="highlight-number">8</div>
            </div>
            <div className="highlight-card">
              <div className="highlight-label">Rejected Today</div>
              <div className="highlight-number">2</div>
            </div>
            <div className="highlight-card">
              <div className="highlight-label">Total Requests</div>
              <div className="highlight-number">12</div>
            </div>
          </div>
        </div>

        {/* Requests Row */}
        <div className="requests-row">
          <div className="approvals-block">
            <h2 className="section-title-sm" style={{ marginBottom: '16px' }}>Requests</h2>
            <div className="dark-card requests-card flex-row">
              <div className="request-list">
                <div className="request-pill active">
                  <div className="pill-content"></div>
                  <div className="pill-actions">
                    <span className="tick">✓</span>
                    <span className="cross">✕</span>
                  </div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="request-pill">
                    <div className="pill-content"></div>
                    <div className="pill-actions">
                      <span className="tick">✓</span>
                      <span className="cross">✕</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="request-panel">
                <div className="panel-buttons">
                  <button className="white-pill-btn">Approve</button>
                  <button className="white-pill-btn">Decline</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Requests Row */}
        <div className="requests-row mt-40">
          <div className="approvals-block">
            <div className="section-header-flex">
              <h2 className="section-title-sm">My Requests</h2>
              <button className="white-pill-btn-small">+ New Request</button>
            </div>
            <div className="dark-card requests-card flex-row">
              <div className="request-list">
                <div className="request-pill active">
                  <div className="pill-content"></div>
                  <div className="pill-dot yellow"></div>
                </div>
                <div className="request-pill">
                  <div className="pill-content"></div>
                  <div className="pill-dot green"></div>
                </div>
                <div className="request-pill">
                  <div className="pill-content"></div>
                  <div className="pill-dot red"></div>
                </div>
                <div className="request-pill">
                  <div className="pill-content"></div>
                  <div className="pill-dot green"></div>
                </div>
                <div className="request-pill">
                  <div className="pill-content"></div>
                  <div className="pill-dot yellow"></div>
                </div>
                <div className="request-pill">
                  <div className="pill-content"></div>
                  <div className="pill-dot yellow"></div>
                </div>
              </div>
              <div className="request-panel">
                {/* Panel is empty besides its background based on image */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Approvals;
