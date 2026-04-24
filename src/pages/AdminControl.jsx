import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const SeverityDot = ({ level }) => {
  const colors = { info: 'bg-[#3658C9]', warn: 'bg-[#E09B3D]', error: 'bg-[#D9534F]' };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[level] || 'bg-gray-400'}`} />;
};

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING:  'bg-[#FFF7E6] text-[#E09B3D]',
    APPROVED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-[#D9534F]',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${styles[status] || 'bg-[#EAEFF7] text-[#848795]'}`}>
      {status}
    </span>
  );
};

// ─── Lock Room Modal ──────────────────────────────────────────────────────────

const LockRoomModal = ({ rooms, onClose, onSuccess }) => {
  const [roomId, setRoomId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!roomId || !reason.trim()) return alert('Please select a room and enter a reason.');
    setSubmitting(true);
    try {
      await api.post('/admin/room-locks', { roomId, reason });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to lock room.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232051]/20 backdrop-blur-[4px]">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-[480px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-[10px] font-[800] text-[#D9534F] uppercase tracking-widest">Admin Action</span>
        <h3 className="text-[#232051] text-[24px] font-bold mb-1 mt-1">Lock a Room</h3>
        <p className="text-[#848795] text-[14px] font-medium mb-8">This room will be marked non-operational and pending bookings will be flagged.</p>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Select Room</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none appearance-none cursor-pointer"
            >
              <option value="">Choose a room…</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Scheduled Maintenance"
              className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none border border-transparent focus:border-[#D9534F]/20 transition-all"
            />
          </div>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={submitting} className="flex-1 h-[54px] bg-[#D9534F] text-white rounded-2xl text-[14px] font-bold hover:bg-[#c0392b] transition-colors shadow-md disabled:opacity-50">
              {submitting ? 'Locking...' : 'Lock Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Broadcast Modal ──────────────────────────────────────────────────────────

const BroadcastModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('EMERGENCY');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return alert('Please enter a broadcast message.');
    setSubmitting(true);
    try {
      await api.post('/admin/override/broadcast', { message, type });
      setSent(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send broadcast.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232051]/20 backdrop-blur-[4px]">
      <div className="bg-white rounded-[2rem] p-10 w-full max-w-[480px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📢</div>
            <h3 className="text-[#232051] text-[22px] font-bold mb-2">Broadcast Sent!</h3>
            <p className="text-[#848795] text-[14px]">All connected users have been notified.</p>
          </div>
        ) : (
          <>
            <span className="text-[10px] font-[800] text-[#D9534F] uppercase tracking-widest">Emergency Action</span>
            <h3 className="text-[#232051] text-[24px] font-bold mb-1 mt-1">Emergency Broadcast</h3>
            <p className="text-[#848795] text-[14px] font-medium mb-8">Send an instant announcement to all connected users on campus.</p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Broadcast Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none appearance-none">
                  <option value="EMERGENCY">🚨 Emergency</option>
                  <option value="ANNOUNCEMENT">📢 General Announcement</option>
                  <option value="MAINTENANCE">🔧 Maintenance Notice</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your broadcast message…"
                  rows={4}
                  className="w-full bg-[#F4F5F8] rounded-2xl px-5 py-4 text-[15px] text-[#232051] font-bold outline-none border border-transparent focus:border-[#D9534F]/20 transition-all resize-none"
                />
              </div>
              <div className="mt-2 flex gap-3">
                <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting} className="flex-1 h-[54px] bg-[#D9534F] text-white rounded-2xl text-[14px] font-bold hover:bg-[#c0392b] transition-colors shadow-md disabled:opacity-50">
                  {submitting ? 'Sending...' : '📢 Send Broadcast'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const AdminControl = () => {
  const [showLockModal, setShowLockModal]           = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [roomLocks, setRoomLocks]                   = useState([]);
  const [auditLogs, setAuditLogs]                   = useState([]);
  const [permRequests, setPermRequests]             = useState([]);
  const [allRooms, setAllRooms]                     = useState([]);

  const [loading, setLoading] = useState(true);

  // ─── Fetch all data ─────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [locksRes, logsRes, permsRes, roomsRes] = await Promise.all([
        api.get('/admin/room-locks'),
        api.get('/admin/actions-log'),
        api.get('/admin/permission-requests'),
        api.get('/rooms'),
      ]);
      setRoomLocks(locksRes.data || []);
      setAuditLogs(logsRes.data || []);
      setPermRequests(permsRes.data || []);
      setAllRooms(roomsRes.data?.rooms || roomsRes.data || []);
    } catch (err) {
      console.error('Admin control data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Unlock room ─────────────────────────────────────────────────────────
  const handleUnlock = async (lockId) => {
    if (!window.confirm('Unlock this room? It will be available for bookings again.')) return;
    try {
      await api.delete(`/admin/room-locks/${lockId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to unlock room.');
    }
  };

  // ─── Permission request actions ──────────────────────────────────────────
  const handleApprovePermission = async (id) => {
    try {
      await api.patch(`/admin/permission-requests/approve/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve request.');
    }
  };

  const handleRejectPermission = async (id) => {
    try {
      await api.patch(`/admin/permission-requests/reject/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject request.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />
      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h4 className="text-[11px] font-[800] text-[#D9534F] uppercase tracking-[0.15em] mb-1">Restricted Zone</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">Admin Control</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#848795] text-[13px] font-semibold">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <NotificationBell />
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="h-[42px] px-5 bg-[#D9534F] text-white rounded-full flex items-center gap-2 font-bold text-[12px] hover:bg-[#c0392b] transition-all shadow-md active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              Emergency Broadcast
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[#232051] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#848795] font-medium">Loading admin data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* ─── SECTION 1 · Room Locks ─────────────────── */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#D9534F] rounded-full" />
                  <h3 className="text-[20px] font-bold text-[#232051]">Admin Room Control</h3>
                  <span className="px-3 py-1 bg-[#D9534F]/10 text-[#D9534F] text-[10px] font-[800] uppercase tracking-widest rounded-full">
                    {roomLocks.length} Locked
                  </span>
                </div>
                <button
                  onClick={() => setShowLockModal(true)}
                  className="bg-[#D9534F] text-white px-6 h-[40px] rounded-full flex items-center gap-2 font-bold text-[12px] hover:bg-[#c0392b] transition-all shadow-md active:scale-95"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Lock a Room
                </button>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors overflow-hidden">
                <div className="grid grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 px-10 py-5 border-b-[1.5px] border-[#F4F5F8]">
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Room</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Reason</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Locked By</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Since</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em] text-right">Action</span>
                </div>
                {roomLocks.length === 0 ? (
                  <div className="py-10 text-center text-[#848795] italic text-[13px]">No rooms are currently locked.</div>
                ) : roomLocks.map((r, i) => (
                  <div key={r.id} className={`grid grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 items-center px-10 py-6 hover:bg-[#F9FAFC] transition-colors ${i < roomLocks.length - 1 ? 'border-b border-[#F4F5F8]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D9534F] shrink-0" />
                      <span className="text-[#232051] font-bold text-[14px]">{r.room?.name || r.roomId}</span>
                    </div>
                    <span className="text-[#848795] text-[13px] font-medium italic">{r.reason}</span>
                    <span className="text-[#6D7184] text-[13px] font-medium">{r.admin?.name || r.admin?.email || 'Admin'}</span>
                    <span className="text-[#A5A8B6] text-[12px] font-bold">{formatDate(r.createdAt)}</span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUnlock(r.id)}
                        className="px-4 h-[32px] rounded-full border-[1.5px] border-[#232051]/20 text-[11px] font-bold text-[#232051] hover:bg-[#232051] hover:text-white transition-all"
                      >
                        Unlock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── SECTION 2 · Audit Log ──────────────────── */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#3658C9] rounded-full" />
                  <h3 className="text-[20px] font-bold text-[#232051]">Admin Audit Log</h3>
                  <span className="px-3 py-1 bg-[#3658C9]/10 text-[#3658C9] text-[10px] font-[800] uppercase tracking-widest rounded-full">
                    {auditLogs.length} entries
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors overflow-hidden">
                <div className="grid grid-cols-[0.2fr_2.5fr_3fr_2fr_1.5fr] gap-4 px-10 py-5 border-b-[1.5px] border-[#F4F5F8]">
                  <span />
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Action</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Target</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Admin</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Timestamp</span>
                </div>
                {auditLogs.length === 0 ? (
                  <div className="py-10 text-center text-[#848795] italic text-[13px]">No audit logs found.</div>
                ) : auditLogs.slice(0, 20).map((log, i) => (
                  <div key={log.id} className={`grid grid-cols-[0.2fr_2.5fr_3fr_2fr_1.5fr] gap-4 items-center px-10 py-5 hover:bg-[#F9FAFC] transition-colors ${i < Math.min(auditLogs.length, 20) - 1 ? 'border-b border-[#F4F5F8]' : ''}`}>
                    <SeverityDot level={log.severity || 'info'} />
                    <span className="text-[#232051] font-bold text-[14px]">{log.action}</span>
                    <span className="text-[#848795] text-[13px] font-medium italic truncate">{log.details || log.target || '—'}</span>
                    <span className="text-[#6D7184] text-[12px] font-medium">{log.admin?.email || log.adminId || '—'}</span>
                    <span className="text-[#A5A8B6] text-[11px] font-bold">{formatDate(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── SECTION 3 · Inter-dept Permissions ─────── */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#E09B3D] rounded-full" />
                  <h3 className="text-[20px] font-bold text-[#232051]">Inter-Dept Permission Requests</h3>
                  <span className="px-3 py-1 bg-[#E09B3D]/10 text-[#E09B3D] text-[10px] font-[800] uppercase tracking-widest rounded-full">
                    {permRequests.filter((r) => r.status === 'PENDING').length} Pending
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors overflow-hidden">
                <div className="grid grid-cols-[2fr_2fr_3fr_1.5fr_1.5fr] gap-4 px-10 py-5 border-b-[1.5px] border-[#F4F5F8]">
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Requested By</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Dept Flow</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Reason</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em] text-center">Status</span>
                  <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em] text-right">Actions</span>
                </div>
                {permRequests.length === 0 ? (
                  <div className="py-10 text-center text-[#848795] italic text-[13px]">No permission requests found.</div>
                ) : permRequests.map((req, i) => (
                  <div key={req.id} className={`grid grid-cols-[2fr_2fr_3fr_1.5fr_1.5fr] gap-4 items-center px-10 py-6 hover:bg-[#F9FAFC] transition-colors ${i < permRequests.length - 1 ? 'border-b border-[#F4F5F8]' : ''}`}>
                    <span className="text-[#232051] font-bold text-[13px]">{req.requestingAdmin?.name || req.requestingAdminId?.slice(0, 8)}</span>
                    <span className="text-[#6D7184] text-[12px] font-medium">{req.requestType || 'Request'}</span>
                    <span className="text-[#848795] text-[12px] font-medium italic truncate">{req.reason || '—'}</span>
                    <div className="flex justify-center">
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex justify-end gap-2">
                      {req.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleRejectPermission(req.id)}
                            className="h-[30px] px-3 rounded-full text-[10px] font-bold border-[1.5px] border-[#D9534F]/60 text-[#D9534F] hover:bg-[#D9534F]/5 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprovePermission(req.id)}
                            className="h-[30px] px-3 rounded-full text-[10px] font-bold bg-[#232051] text-white hover:bg-[#343568] transition-colors"
                          >
                            Approve
                          </button>
                        </>
                      ) : (
                        <span className="h-[30px] px-3 rounded-full text-[10px] font-bold text-[#A5A8B6] border border-[#F4F5F8] flex items-center">
                          {formatDate(req.updatedAt || req.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="h-12" />
      </div>

      {showLockModal && (
        <LockRoomModal
          rooms={allRooms}
          onClose={() => setShowLockModal(false)}
          onSuccess={fetchData}
        />
      )}
      {showBroadcastModal && (
        <BroadcastModal onClose={() => setShowBroadcastModal(false)} />
      )}
    </div>
  );
};

export default AdminControl;
