import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import api from '../api/axios';
const Rooms = () => {

  // const roomsData = [
  //   {
  //     id: 1,
  //     name: "Lecture Hall A-102",
  //     building: "Arts & Sciences Building",
  //     floor: "Floor 1",
  //     capacity: "120 SEATS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
  //         <circle cx="9" cy="7" r="4"></circle>
  //         <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
  //         <path d="M16 3.13a4 4 0 010 7.75"></path>
  //       </svg>
  //     ),
  //     status: "AVAILABLE",
  //     statusColor: "text-[#2E7D32]",
  //     statusDot: "bg-[#4CAF50]",
  //     actionIcon: "edit"
  //   },
  //   {
  //     id: 2,
  //     name: "Biological Lab 405",
  //     building: "Engineering Hall",
  //     floor: "Floor 4",
  //     capacity: "24 STATIONS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <path d="M10 2v7.31M14 2v7.31M6 9.31h12c1.1 0 2 .9 2 2v2.38a2 2 0 01-.59 1.42l-5.83 5.83a2 2 0 01-2.83 0l-5.83-5.83a2 2 0 01-.59-1.42V11.3c0-1.1.9-2 2-2z"></path>
  //       </svg>
  //     ),
  //     status: "OCCUPIED",
  //     statusColor: "text-[#E65100]",
  //     statusDot: "bg-[#FF9800]",
  //     actionIcon: "edit"
  //   },
  //   {
  //     id: 3,
  //     name: "Seminar Room 12",
  //     building: "Arts & Sciences Building",
  //     floor: "Floor 2",
  //     capacity: "15 SEATS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  //         <line x1="3" y1="9" x2="21" y2="9"></line>
  //       </svg>
  //     ),
  //     status: "MAINTENANCE",
  //     statusColor: "text-[#C62828]",
  //     statusDot: "bg-[#F44336]",
  //     actionIcon: "info"
  //   },
  //   {
  //     id: 4,
  //     name: "Physics Lab C",
  //     building: "Engineering Hall",
  //     floor: "Floor 2",
  //     capacity: "30 SEATS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <circle cx="12" cy="12" r="10"></circle>
  //         <line x1="12" y1="16" x2="12" y2="12"></line>
  //         <line x1="12" y1="8" x2="12.01" y2="8"></line>
  //       </svg>
  //     ),
  //     status: "AVAILABLE",
  //     statusColor: "text-[#2E7D32]",
  //     statusDot: "bg-[#4CAF50]",
  //     actionIcon: "edit"
  //   },
  //   {
  //     id: 5,
  //     name: "Grand Auditorium",
  //     building: "Central Commons",
  //     floor: "Floor 1",
  //     capacity: "500 SEATS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
  //         <polyline points="2 17 12 22 22 17"></polyline>
  //         <polyline points="2 12 12 17 22 12"></polyline>
  //       </svg>
  //     ),
  //     status: "OCCUPIED",
  //     statusColor: "text-[#E65100]",
  //     statusDot: "bg-[#FF9800]",
  //     actionIcon: "edit"
  //   },
  //   {
  //     id: 6,
  //     name: "L2",
  //     building: "Law Annex",
  //     floor: "Floor 2",
  //     capacity: "60 SEATS",
  //     capacityIcon: (
  //       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  //         <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
  //         <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  //       </svg>
  //     ),
  //     status: "AVAILABLE",
  //     statusColor: "text-[#2E7D32]",
  //     statusDot: "bg-[#4CAF50]",
  //     actionIcon: "edit"
  //   }
  // ];
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookForm, setBookForm] = useState({ purpose: '', startTime: '', endTime: '' });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    roomType: 'CLASS',
    capacity: 30,
    departmentId: ''
  });

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms/status');
      const formattedRooms = response.data.rooms.map(room => {
        let statusColor = 'text-[#2E7D32]';
        let statusDot = 'bg-[#4CAF50]';
        if (room.status === 'OCCUPIED') { statusColor = 'text-[#E65100]'; statusDot = 'bg-[#FF9800]'; }
        else if (room.status === 'MAINTENANCE' || !room.isOperational) { statusColor = 'text-[#C62828]'; statusDot = 'bg-[#F44336]'; room.status = 'MAINTENANCE'; }
        return {
          id: room.id, name: room.name, building: room.department?.name || 'Main Campus',
          capacity: `${room.capacity || 0} SEATS`, status: room.status || 'AVAILABLE',
          statusColor, statusDot, roomType: room.roomType, departmentId: room.departmentId,
          capacityIcon: (<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
          actionIcon: room.status === 'MAINTENANCE' ? 'info' : 'edit'
        };
      });
      setRoomsData(formattedRooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchRoom = async () => {
    if (!searchId.trim()) return; // Do nothing if empty

    try {
      setLoading(true);
      // NOTE: In the future, we can scan a QR code holding the Room ID 
      // and automatically trigger this function with that ID!
      const response = await api.get(`/rooms/${searchId}`);

      const room = response.data;
      setRoomsData([{
        id: room.id,
        name: room.name,
        building: room.departmentId || 'Search Result',
        floor: "N/A",
        capacity: `${room.capacity} SEATS`,
        status: room.isOperational ? "AVAILABLE" : "MAINTENANCE",
        statusColor: room.isOperational ? "text-[#2E7D32]" : "text-[#C62828]",
        statusDot: room.isOperational ? "bg-[#4CAF50]" : "bg-[#F44336]",
        capacityIcon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>,
        actionIcon: "edit"
      }]);
    } catch (error) {
      console.error("Room not found:", error);
      alert("Room ID not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (room) => {
    setEditingRoom(room.id);
    setFormData({
      name: room.name,
      roomType: room.roomType,
      capacity: room.capacity,
      departmentId: room.departmentId
    });
    setShowModal(true);
  };

  const handelSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, capacity: parseInt(formData.capacity) };
      if (editingRoom) {
        await api.patch(`/rooms/${editingRoom}`, payload);
      } else {
        await api.post('/rooms', payload);
      }
      setShowModal(false);
      setEditingRoom(null);
      fetchRooms(); // Re-fetch to show updated data
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room');
    }
  };

  const handleBookRoom = async () => {
    if (!bookForm.purpose || !bookForm.startTime || !bookForm.endTime) return alert('Please fill all booking fields.');
    setBookingSubmitting(true);
    try {
      await api.post('/bookings', {
        roomId: bookingRoom.id,
        purpose: bookForm.purpose,
        startTime: bookForm.startTime,
        endTime: bookForm.endTime,
      });
      setShowBookModal(false);
      setBookForm({ purpose: '', startTime: '', endTime: '' });
      alert('Booking request submitted! Awaiting approval.');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this room ? This action will remove rooms's information from the database which cannot be retrieved later.")) {
      try {
        await api.delete(`/rooms/${id}`);
        setRoomsData(prev => prev.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error deleting room:", error);
        alert(error.response?.data?.message || error.response?.data?.error || "Failed to delete room. It might be linked to existing bookings or timetable entries.");
      }
    }
  }
  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />

      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-1">Institutional Oversight</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">Room Inventory</h2>
          </div>

          <div className="flex flex-col items-end gap-5">
            <span className="text-[#848795] text-[13px] font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="search for anything..."
                  className="w-[300px] h-[42px] bg-[#DCE4F0] rounded-full px-5 pr-10 text-[13px] text-[#232051] placeholder-[#848795] focus:outline-none focus:ring-2 focus:ring-[#232051]/20 font-medium transition-shadow"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848795] w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="bg-[#DCE4F0] h-[42px] px-5 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-[800] text-[#232051] tracking-wider uppercase">Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <NotificationBell />
            </div>
          </div>
        </div>

        {/* Filters Top Bar */}
        <div className="bg-white rounded-2xl p-[10px] mb-8 shadow-sm flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#232051] w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchRoom()}
              placeholder="Search rooms by ID and press Enter... (QR Ready)"
              className="w-full h-[48px] bg-[#F4F5F8] rounded-[12px] pl-[42px] pr-5 text-[14px] text-[#232051] font-semibold placeholder-[#A5A8B6] focus:outline-none focus:bg-[#EAEFF7] transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setEditingRoom(null);
              setFormData({ name: '', roomType: 'CLASS', capacity: 30, departmentId: '' });
              setShowModal(true);
            }}
            className="h-[48px] px-6 bg-[#3658C9] hover:bg-[#232051] rounded-[12px] text-white flex items-center justify-center font-bold text-[13px] transition-colors shadow-sm whitespace-nowrap"
          >
            + Add New Room
          </button>

          <div className="relative">
            <select className="appearance-none w-[130px] h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[13px] font-[800] text-[#232051] cursor-pointer focus:outline-none focus:bg-[#EAEFF7] transition-colors">
              <option>All Floors</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-[#A5A8B6]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative">
            <select className="appearance-none w-[130px] h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[13px] font-[800] text-[#232051] cursor-pointer focus:outline-none focus:bg-[#EAEFF7] transition-colors">
              <option>Room Type</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-[#A5A8B6]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative">
            <select className="appearance-none w-[130px] h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[13px] font-[800] text-[#232051] cursor-pointer focus:outline-none focus:bg-[#EAEFF7] transition-colors">
              <option>Capacity</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-[#A5A8B6]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <button className="w-[48px] h-[48px] bg-[#232051] hover:bg-[#343568] rounded-[12px] text-white flex items-center justify-center transition-colors shadow-sm">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-3 py-20 text-center font-bold text-[#848795]">Loading Rooms...</div>
          ) : roomsData.length === 0 ? (
            <div className="col-span-3 py-20 text-center font-bold text-[#848795]">No Rooms Found in Database.</div>
          ) : (
            roomsData.map((room) => (
              <div key={room.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-[#EAEFF7] flex flex-col">

                {/* Card Image Area Placeholder */}
                <div className="h-[140px] bg-gradient-to-br from-[#E2E6EF] to-[#F4F6F9] relative flex items-center justify-center">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-[10px] py-[6px] flex items-center gap-[6px] shadow-sm">
                    <div className={`w-[6px] h-[6px] rounded-full ${room.statusDot}`}></div>
                    <span className={`text-[9.5px] font-[900] uppercase tracking-[0.1em] ${room.statusColor}`}>{room.status}</span>
                  </div>
                  {/* Subtle structural wireframe to simulate the image shown in the screenshot */}
                  <svg className="w-full h-full text-white/50 px-4 pt-4" viewBox="0 0 100 40" preserveAspectRatio="none" fill="currentColor">
                    <rect x="10" y="20" width="80" height="20" fillOpacity="0.4" rx="2" />
                    <rect x="25" y="10" width="50" height="15" fillOpacity="0.2" rx="1" />
                  </svg>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[18px] font-bold text-[#232051] mb-1 leading-tight">{room.name}</h3>
                  <p className="text-[#848795] text-[13px] font-medium mb-6">{room.building} &bull; {room.floor}</p>

                  <div className="flex items-center gap-[6px] text-[#232051] mb-8 mt-auto">
                    {room.capacityIcon}
                    <span className="text-[10px] font-[900] uppercase tracking-[0.1em] ml-1">{room.capacity}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={() => { setBookingRoom(room); setShowBookModal(true); }}
                      disabled={room.status !== 'AVAILABLE'}
                      className="flex-[2] h-[42px] bg-[#232051] hover:bg-[#343568] text-white rounded-[12px] text-[13px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {room.status === 'AVAILABLE' ? 'Book Room' : room.status}
                    </button>
                    <button
                      onClick={() => handleEditClick(room)}
                      className="w-[42px] h-[42px] rounded-[12px] border-[1.5px] border-[#EAEFF7] text-[#232051] flex items-center justify-center hover:bg-[#F4F5F8] transition-colors shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="w-[42px] h-[42px] rounded-[12px] border-[1.5px] border-[#ffecec] text-[#C62828] flex items-center justify-center hover:bg-[#ffecec] transition-colors shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )
          }
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between pb-8">
          <p className="text-[13px] font-semibold text-[#848795]">Showing {roomsData.length} rooms across campus.</p>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-[#848795] opacity-50 cursor-not-allowed transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#232051] text-white rounded-full font-bold text-[13px]">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#848795] opacity-50 cursor-not-allowed transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-[400px] shadow-xl">
              <h3 className="text-[#232051] text-[24px] font-bold mb-6">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h3>

              <form onSubmit={handelSaveRoom} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider mb-1 block">Room Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[14px] text-[#232051] focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider mb-1 block">Type</label>
                    <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[14px] text-[#232051] focus:outline-none">
                      <option value="CLASS">Classroom</option>
                      <option value="LAB">Laboratory</option>
                      <option value="HALL">Seminar Hall</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider mb-1 block">Capacity</label>
                    <input required type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full h-[48px] bg-[#F4F5F8] rounded-[12px] px-4 text-[14px] text-[#232051] focus:outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-[48px] bg-[#F4F5F8] hover:bg-[#EAEFF7] text-[#848795] rounded-[12px] font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 h-[48px] bg-[#232051] hover:bg-[#343568] text-white rounded-[12px] font-bold transition-colors">Save Room</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Book Room Modal */}
        {showBookModal && bookingRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#232051]/20 backdrop-blur-[4px]">
            <div className="bg-white rounded-[2rem] p-10 w-full max-w-[480px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
              <button onClick={() => setShowBookModal(false)} className="absolute top-8 right-8 text-[#A5A8B6] hover:text-[#232051] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">Room Booking</h4>
              <h3 className="text-[#232051] text-[24px] font-bold mb-1">Book {bookingRoom.name}</h3>
              <p className="text-[#848795] text-[14px] font-medium mb-8">Your request will be submitted for approval.</p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Purpose</label>
                  <input type="text" value={bookForm.purpose} onChange={(e) => setBookForm({...bookForm, purpose: e.target.value})} placeholder="e.g., Machine Learning Lab" className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Start Time</label>
                    <input type="datetime-local" value={bookForm.startTime} onChange={(e) => setBookForm({...bookForm, startTime: e.target.value})} className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-4 text-[13px] text-[#232051] font-bold outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">End Time</label>
                    <input type="datetime-local" value={bookForm.endTime} onChange={(e) => setBookForm({...bookForm, endTime: e.target.value})} className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-4 text-[13px] text-[#232051] font-bold outline-none" />
                  </div>
                </div>
                <div className="mt-2 flex gap-3">
                  <button onClick={() => setShowBookModal(false)} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
                  <button onClick={handleBookRoom} disabled={bookingSubmitting} className="flex-1 h-[54px] bg-[#232051] text-white rounded-2xl text-[14px] font-bold hover:bg-[#343568] transition-colors shadow-md disabled:opacity-50">
                    {bookingSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Rooms;
