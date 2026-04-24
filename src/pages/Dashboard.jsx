import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

// --- HARDCODED ADMIN DATA ---
// const overviewStats = [
//   { label: 'Total Users', value: '1,248', delta: '+12 today', deltaColor: '#3658C9', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
//   { label: 'Active Bookings', value: '37', delta: '8 expiring soon', deltaColor: '#E09B3D', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
//   { label: 'Rooms Available', value: '24 / 31', delta: '7 occupied', deltaColor: '#D9534F', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
//   { label: 'Pending Approvals', value: '12', delta: '+2 today', deltaColor: '#D9534F', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
// ];

// const liveBookings = [
//   { room: 'Lab 204 – CS Wing', bookedBy: 'Dr. Priya Sharma', subject: 'Machine Learning Practicum', timeLeft: '32 min', status: 'Active' },
//   { room: 'Seminar Hall A', bookedBy: 'Prof. Rajan Mehta', subject: 'Research Colloquium', timeLeft: '1h 14 min', status: 'Active' },
//   { room: 'Classroom 62', bookedBy: 'Dr. Arun Kumar', subject: 'Operating Systems', timeLeft: '48 min', status: 'Active' },
//   { room: 'Conference Room 3', bookedBy: 'Admin Office', subject: 'Faculty Board Meeting', timeLeft: '2h 0 min', status: 'Scheduled' },
// ];

// Room utilization data: rows = time slots, cols = rooms
// const rooms = ['CR-61', 'CR-62', 'Lab-203', 'Lab-204', 'SH-A', 'SH-B', 'Conf-1', 'Conf-2'];
// const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
// const utilizationMatrix = [
//   [0, 0, 1, 1, 0, 0, 0, 0],
//   [1, 1, 1, 1, 0, 1, 0, 0],
//   [1, 1, 1, 1, 1, 1, 0, 1],
//   [1, 0, 1, 0, 1, 1, 1, 0],
//   [0, 0, 0, 1, 1, 0, 1, 1],
//   [0, 1, 0, 1, 0, 0, 0, 1],
//   [1, 1, 1, 0, 0, 1, 0, 0],
//   [1, 0, 1, 1, 1, 0, 0, 0],
//   [0, 0, 0, 1, 0, 1, 1, 1],
//   [0, 0, 0, 0, 0, 0, 1, 0],
// ];

// // --- ADMIN ANALYTICS DATA ---
// const roomUsage = [
//   { room: 'Lab 204 – CS Wing', count: 142, pct: 100 },
//   { room: 'Seminar Hall A', count: 118, pct: 83 },
//   { room: 'Classroom 62', count: 97, pct: 68 },
//   { room: 'Conf Room 1', count: 84, pct: 59 },
//   { room: 'Lab 203 – Elec', count: 76, pct: 54 },
//   { room: 'Seminar Hall B', count: 61, pct: 43 },
//   { room: 'Classroom 61', count: 55, pct: 39 },
//   { room: 'Conf Room 2', count: 38, pct: 27 },
// ];

// const peakHours = [
//   { hour: '8 AM', pct: 22 }, { hour: '9 AM', pct: 55 }, { hour: '10 AM', pct: 88 },
//   { hour: '11 AM', pct: 100 }, { hour: '12 PM', pct: 72 }, { hour: '1 PM', pct: 45 },
//   { hour: '2 PM', pct: 91 }, { hour: '3 PM', pct: 84 }, { hour: '4 PM', pct: 60 },
//   { hour: '5 PM', pct: 18 },
// ];

// const deptUsage = [
//   { dept: 'Computer Science', sessions: 312, color: '#232051', pct: 100 },
//   { dept: 'Electronics & Comm', sessions: 247, color: '#3658C9', pct: 79 },
//   { dept: 'Mechanical Engg', sessions: 198, color: '#5B85E8', pct: 63 },
//   { dept: 'Information Tech', sessions: 174, color: '#8EAEE8', pct: 56 },
//   { dept: 'Admin & Management', sessions: 89, color: '#B8CBEF', pct: 29 },
// ];

// const eventFrequency = [
//   { type: 'Academic Lecture', count: 428, pct: 100, color: '#232051' },
//   { type: 'Lab Practical', count: 316, pct: 74, color: '#3658C9' },
//   { type: 'Seminar / Workshop', count: 189, pct: 44, color: '#5B85E8' },
//   { type: 'Faculty Meeting', count: 97, pct: 23, color: '#E09B3D' },
//   { type: 'Board / Committee', count: 54, pct: 13, color: '#D9534F' },
// ];

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [liveBookings, setLiveBookings] = useState([]);
  const [roomUsage, setRoomUsage] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [deptUsage, setDeptUsage] = useState([]);
  const [eventFrequency, setEventFrequency] = useState([]);
  const [_loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // Heatmap data — live from room-utilization API
  const [heatRooms, setHeatRooms] = useState([]);
  const [heatSlots, setHeatSlots] = useState(['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM']);
  const [utilizationMatrix, setUtilizationMatrix] = useState(Array(10).fill(0).map(() => Array(8).fill(0)));
  const navigate = useNavigate();

  const timeSlots = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'];


  const handleQuickRoomBooking = () => {
    navigate('/rooms?quick=book');
  };

  const handleSecondaryQuickAction = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin-control?broadcast=1');
    } else {
      navigate('/timetable');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use Promise.all to fetch everything at once for performance
        const [
          overviewRes,
          liveRes,
          usageRes,
          peakRes,
          deptRes,
          eventRes,
          approvalStatsRes,
          utilizationRes
        ] = await Promise.all([
          api.get('/admin/dashboard/overview'),
          api.get('/admin/dashboard/live-bookings'),
          api.get('/admin/analytics/room-usage'),
          api.get('/admin/analytics/peak-hours'),
          api.get('/admin/analytics/department-usage'),
          api.get('/admin/analytics/event-frequency'),
          api.get('/approvals/stats'),
          api.get('/admin/dashboard/room-utilization').catch(() => ({ data: null })),
        ]);

        // 1. Overview Stats
        const { usersCount, roomsCount, bookingsCount } = overviewRes.data;
        const pendingCount = approvalStatsRes.data?.pending ?? 0;
        setStats([
          { label: 'Total Users', value: usersCount.toLocaleString(), delta: 'System-wide', deltaColor: '#3658C9', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
          { label: 'Active Bookings', value: bookingsCount, delta: 'Total Approved', deltaColor: '#E09B3D', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
          { label: 'Rooms Total', value: roomsCount, delta: 'Operational', deltaColor: '#D9534F', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { label: 'Pending Approvals', value: pendingCount, delta: 'Awaiting review', deltaColor: pendingCount > 0 ? '#D9534F' : '#4CAF50', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
        ]);

        // 2. Live Bookings
        setLiveBookings(liveRes.data.map(b => ({
          room: b.room.name,
          bookedBy: b.user.name,
          subject: b.purpose || 'Institutional Activity',
          timeLeft: new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Active'
        })));

        // 3. Room Usage
        setRoomUsage(usageRes.data.usage.slice(0, 8).map(u => ({
          room: u.roomId, // Ideally join with room name in backend
          count: u._count.id,
          pct: Math.min(100, (u._count.id / 50) * 100) // Mocked percentage
        })));

        // 4. Peak Hours
        const peakData = peakRes.data.peakHours;
        const mappedPeaks = timeSlots.map((slot, index) => {
          const hour = index + 8; // 8 AM start
          const count = peakData[hour] || 0;
          return { hour: slot, pct: Math.min(100, (count / 10) * 100) };
        });
        setPeakHours(mappedPeaks);

        // 5. Dept Usage
        const deptData = deptRes.data.departmentUsage;
        setDeptUsage(Object.entries(deptData).map(([name, count], i) => ({
          dept: name,
          sessions: count,
          color: ['#232051', '#3658C9', '#5B85E8', '#8EAEE8', '#B8CBEF'][i % 5],
          pct: Math.min(100, (count / 20) * 100)
        })));

        // 6. Event Frequency
        const eventData = eventRes.data.frequencies;
        setEventFrequency(eventData.map((e, i) => ({
          type: e.eventType,
          count: e._count.id,
          pct: Math.min(100, (e._count.id / 50) * 100),
          color: ['#232051', '#3658C9', '#5B85E8', '#E09B3D', '#D9534F'][i % 5]
        })));

        // 7. Room utilization heatmap
        if (utilizationRes.data) {
          const util = utilizationRes.data;
          const roomNames = util.rooms?.map(r => r.name || r.roomId) || [];
          const slots = util.timeSlots || heatSlots;
          const matrix = util.matrix || Array(slots.length).fill(0).map(() => Array(roomNames.length).fill(0));
          setHeatRooms(roomNames);
          setHeatSlots(slots);
          setUtilizationMatrix(matrix);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h4 className="text-[11px] font-[800] text-[#71758A] uppercase tracking-[0.15em] mb-1">Welcome Back, {user?.name || 'User'}</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">
              {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Faculty Dashboard'}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-5">
            <span className="text-[#848795] text-[13px] font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="search for anything..."
                  className="w-[300px] h-[42px] bg-[#DCE4F0] rounded-full px-5 pr-10 text-[13px] text-[#232051] placeholder-[#848795] focus:outline-none focus:ring-2 focus:ring-[#232051]/20 font-medium transition-shadow"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848795] w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Time */}
              <div className="bg-[#DCE4F0] h-[42px] px-5 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-[800] text-[#232051] tracking-wider uppercase">Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Notification Icon */}
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* SECTION 1 · Overview Stats */}
        {/* ─────────────────────────────────────── */}
        <div className="mb-3">
          <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-5">Dashboard Overview</h4>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[1.8rem] p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] leading-tight max-w-[80px]">{stat.label}</span>
                <div className="w-9 h-9 rounded-xl bg-[#EAEFF7] flex items-center justify-center text-[#232051] group-hover:bg-[#232051] group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon}/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-[34px] font-[800] text-[#232051] leading-none tracking-tight block mb-2">{stat.value}</span>
                <span className="text-[11px] font-bold" style={{ color: stat.deltaColor }}>{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ─────────────────────────────────────── */}
        {/* SECTION 2 · Live Bookings + Right Column */}
        {/* ─────────────────────────────────────── */}
        <div className="flex gap-10 mb-12">

          {/* Live Bookings Table */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em]">Live Bookings</h4>
                <span className="flex items-center gap-1.5">
                  <span className="w-[7px] h-[7px] rounded-full bg-green-500 animate-pulse inline-block"></span>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Live</span>
                </span>
              </div>
              <button className="text-[12px] font-bold text-[#3658C9] hover:opacity-70 transition-opacity">View All</button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors">
              {/* Table Header */}
              <div className="grid grid-cols-[2.5fr_2.5fr_3fr_1.5fr_1.5fr] gap-4 pb-5 border-b-[1.5px] border-[#F4F5F8] px-2">
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Room</span>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Booked By</span>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em]">Subject / Purpose</span>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em] text-center">Time Left</span>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.12em] text-center">Status</span>
              </div>
              {liveBookings.length > 0 ? liveBookings.map((b, i) => (
                <div key={i} className={`grid grid-cols-[2.5fr_2.5fr_3fr_1.5fr_1.5fr] gap-4 items-center py-5 px-2 rounded-xl hover:bg-[#F9FAFC] transition-colors ${i < liveBookings.length - 1 ? 'border-b border-[#F4F5F8]' : ''}`}>
                  <span className="text-[#232051] font-bold text-[14px]">{b.room}</span>
                  <span className="text-[#6D7184] font-medium text-[13px]">{b.bookedBy}</span>
                  <span className="text-[#848795] text-[13px] font-medium italic truncate">{b.subject}</span>
                  <span className="text-center text-[13px] font-bold text-[#232051]">{b.timeLeft}</span>
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${b.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-[#EAEFF7] text-[#3658C9]'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-[#A5A8B6] font-medium italic">No active bookings found.</div>
              )}
            </div>
          </div>

          {/* Right: Pending Requests Card */}
          <div className="w-[280px] shrink-0 flex flex-col gap-6">
            <div className="bg-[#232051] rounded-[2.5rem] p-9 relative overflow-hidden shadow-lg group hover:shadow-xl transition-shadow cursor-pointer flex-1">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <span className="text-[10px] font-[800] text-white/50 uppercase tracking-[0.15em]">Pending Approvals</span>
                <span className="text-[64px] font-[800] text-white leading-none tracking-tight mt-4">{stats[3]?.value || 0}</span>
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mt-2">Requests awaiting review</span>
              </div>
              <svg className="absolute -right-6 -bottom-6 w-[160px] h-[160px] text-white/[0.04] group-hover:scale-105 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-6">Quick Actions</h4>
              <div className="flex flex-col gap-3">
                <button onClick={handleQuickRoomBooking} className="w-full bg-[#232051] hover:bg-[#343568] transition-colors rounded-2xl h-[54px] flex items-center px-5 gap-3 text-white shadow-md active:scale-[0.99]">
                  <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <span className="font-bold text-[13px]">Quick Room Booking</span>
                </button>
                <button onClick={handleSecondaryQuickAction} className="w-full bg-[#EAEFF7] hover:bg-[#DCE4F0] transition-colors rounded-2xl h-[54px] flex items-center px-5 gap-3 text-[#232051] active:scale-[0.99]">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <span className="font-bold text-[13px]">{user?.role === 'ADMIN' ? 'Emergency Broadcast' : 'Check Timetable'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* SECTION 3 · Room Utilization Heatmap   */}
        {/* ─────────────────────────────────────── */}
        <div className="mb-5">
          <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-5">Room Utilization Heatmap</h4>
        </div>
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[15px] font-bold text-[#232051]">Occupancy by Timeslot — Today</span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-[#EAEFF7]"></div>
                <span className="text-[11px] font-bold text-[#A5A8B6] uppercase tracking-wider">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-[#232051]"></div>
                <span className="text-[11px] font-bold text-[#A5A8B6] uppercase tracking-wider">Occupied</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-[70px] pb-4 text-left">
                    <span className="text-[10px] font-[800] text-[#EAEFF7] uppercase tracking-wider">Time</span>
                  </th>
                  {(heatRooms.length > 0 ? heatRooms : ['CR-61','CR-62','Lab-203','Lab-204','SH-A','SH-B','Conf-1','Conf-2']).map((room) => (
                    <th key={room} className="pb-4 text-center">
                      <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-wider">{room}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatSlots.map((slot, rowIdx) => (
                  <tr key={`${slot}-${rowIdx}`} className="group">
                    <td className="py-1.5 pr-4">
                      <span className="text-[11px] font-bold text-[#848795]">{slot}</span>
                    </td>
                    {(heatRooms.length > 0 ? heatRooms : Array(8).fill(0)).map((_, colIdx) => {
                      const val = utilizationMatrix[rowIdx]?.[colIdx] ?? 0;
                      const occupied = val === 1 || val === true;
                      return (
                        <td key={colIdx} className="py-1.5 px-1 text-center">
                          <div
                            className={`h-[32px] rounded-lg mx-auto transition-all duration-200 hover:scale-105 cursor-default ${
                              occupied
                                ? 'bg-[#232051] shadow-sm shadow-[#232051]/20'
                                : 'bg-[#EAEFF7]'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* SECTION 4 · Admin Analytics             */}
        {/* ─────────────────────────────────────── */}
        <div className="mt-12 mb-5">
          <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-2">Admin Analytics</h4>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Room Usage */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-7">
              <span className="text-[15px] font-bold text-[#232051]">Room Usage Count</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-wider">Sessions · All time</span>
            </div>
            <div className="flex flex-col gap-4">
              {roomUsage.length > 0 ? roomUsage.map((r) => (
                <div key={r.room}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] font-bold text-[#232051] truncate max-w-[65%]">{r.room}</span>
                    <span className="text-[11px] font-bold text-[#848795]">{r.count}</span>
                  </div>
                  <div className="w-full h-[8px] bg-[#EAEFF7] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#232051] transition-all duration-700" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              )) : <div className="text-[12px] italic text-[#A5A8B6]">No usage data available.</div>}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-7">
              <span className="text-[15px] font-bold text-[#232051]">Peak Booking Hours</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-wider">Busiest slots today</span>
            </div>
            <div className="flex items-end gap-3 h-[180px]">
              {peakHours.map((h) => (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex flex-col justify-end" style={{ height: '80%' }}>
                    <div className={`w-full rounded-t-lg transition-all duration-500 ${ h.pct >= 80 ? 'bg-[#232051]' : h.pct >= 50 ? 'bg-[#3658C9]' : 'bg-[#DCE4F0]' }`} style={{ height: `${h.pct}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-[#A5A8B6] uppercase tracking-wide whitespace-nowrap">{h.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Department Usage */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-7">
              <span className="text-[15px] font-bold text-[#232051]">Department Usage</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-wider">Room sessions · Semester</span>
            </div>
            <div className="flex flex-col gap-5">
              {deptUsage.length > 0 ? deptUsage.map((d) => (
                <div key={d.dept}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[13px] font-bold text-[#232051]">{d.dept}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#848795]">{d.sessions} sessions</span>
                  </div>
                  <div className="w-full h-[10px] bg-[#EAEFF7] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              )) : <div className="text-[12px] italic text-[#A5A8B6]">No department data.</div>}
            </div>
          </div>

          {/* Event Frequency */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors">
            <div className="flex items-center justify-between mb-7">
              <span className="text-[15px] font-bold text-[#232051]">Event Frequency</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-wider">DD</span>
            </div>
            <div className="flex w-full h-[14px] rounded-full overflow-hidden mb-8 gap-[2px]">
              {eventFrequency.map((e) => (
                <div key={e.type} className="h-full transition-all duration-700" style={{ width: `${e.pct}%`, backgroundColor: e.color }} title={`${e.type}: ${e.count}`} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {eventFrequency.length > 0 ? eventFrequency.map((e) => (
                <div key={e.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="text-[13px] font-bold text-[#232051]">{e.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-[#848795]">{e.count}</span>
                    <span className="text-[11px] font-[800] text-[#A5A8B6] w-[36px] text-right">{e.pct}%</span>
                  </div>
                </div>
              )) : <div className="text-[12px] italic text-[#A5A8B6]">No event data.</div>}
            </div>
          </div>
        </div>

        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default Dashboard;
