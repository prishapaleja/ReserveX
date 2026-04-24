import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

import api from '../api/axios';
import useAuthStore from '../store/authStore';

// ─── UTILS & CONSTANTS ───────────────────────────────────────

const avatarColors = {
  ADMIN: { bg: 'bg-[#232051]', text: 'text-white' },
  FACULTY: { bg: 'bg-[#EAEFF7]', text: 'text-[#232051]' },
};

const initials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(w => w?.[0] || '').join('').slice(0, 2).toUpperCase();
};

// ─── Create Channel Modal ─────────────────────────────────

const CreateChannelModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      await api.post('/social/clubs', {
        name,
        description,
        departmentId: "d9e87f..." // Replace with a real department UUID when testing!
      });
      onSuccess(); 
      onClose();
    } catch (error) {
      console.error("Failed to create channel:", error);
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
        <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">Admin Communication</h4>
        <h3 className="text-[#232051] text-[24px] font-bold mb-1">Create Channel</h3>
        
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Channel Name</label>
            <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="e.g., Security Alerts" 
               className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] font-bold outline-none" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Description</label>
            <input 
               type="text" 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Brief purpose" 
               className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] font-bold outline-none" 
            />
          </div>
          <div className="mt-2 flex gap-3">
             <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051]">Cancel</button>
             <button onClick={handleSubmit} className="flex-1 h-[54px] bg-[#232051] text-white rounded-2xl text-[14px] font-bold hover:bg-[#343568] shadow-md">Create Channel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Add Member Modal ───────────────────────────────────────

const AddMemberModal = ({ onClose, clubName , clubId}) => {
  const [idNumber, setIdNumber] = useState('');
  const [role, setRole] = useState('MEMBER');
  const handleSubmit = async () => {
    if (!idNumber.trim()) return;
    
    try {
      // Remember we passed clubId down as a prop? Let's use it!
      await api.post(`/social/clubs/${clubId}/members`, {
        idNumber: idNumber.trim(),
        role: role
      });
      
      alert(`Success! ${idNumber} was added to the channel.`);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add member:", error);
      alert(error.response?.data?.error || "Failed to add member.");
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
        <h4 className="text-[10px] font-[800] text-[#3658C9] uppercase tracking-widest mb-1">Manage Access</h4>
        <h3 className="text-[#232051] text-[24px] font-bold mb-1">Add Member</h3>
        <p className="text-[#848795] text-[14px] font-medium mb-8">Add a student or faculty to <span className="font-bold text-[#232051]">#{clubName}</span></p>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">ID Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g., EU012345678"
              className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none border border-transparent focus:border-[#232051]/10 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#848795] uppercase tracking-wider ml-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-[54px] bg-[#F4F5F8] rounded-2xl px-5 text-[15px] text-[#232051] font-bold outline-none border border-transparent focus:border-[#232051]/10 transition-all appearance-none cursor-pointer"
            >
              <option value="MEMBER">Member</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>

          <div className="mt-2 flex gap-3">
            <button onClick={onClose} className="flex-1 h-[54px] rounded-2xl text-[14px] font-bold text-[#848795] hover:text-[#232051] transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 h-[54px] bg-[#232051] text-white rounded-2xl text-[14px] font-bold hover:bg-[#343568] transition-colors shadow-md">Add Member</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────

const Communication = () => {
  const user = useAuthStore(state => state.user);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const bottomRef = useRef(null);

  const fetchChannels = async () => {
    try {
      const response = await api.get('/social/clubs');
      setChannels(response.data);
      if (response.data.length > 0) setActiveChannel(response.data[0]);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  };

  useEffect(() => {
    const loadChannels = async () => {
      await fetchChannels();
    };
    loadChannels();
  }, []);

  useEffect(() => {
    if (!activeChannel) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/social/clubs/${activeChannel.id}/messages`);
        const mappedMessages = response.data.map(msg => ({
          id: msg.id,
          sender: msg.user?.name || "Unknown",
          role: msg.user?.role || "MEMBER", 
          body: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          self: msg.userId === user?.id 
        }));

        setMessages(mappedMessages);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [activeChannel, user]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChannel) return;
    try {
      const response = await api.post(`/social/clubs/${activeChannel.id}/message`, {
        message: newMessage.trim()
      });

      const newMsg = response.data.data;
      const mappedMsg = {
         id: newMsg.id,
         sender: user?.name,
         role: user?.role || "ADMIN",
         body: newMsg.message,
         time: new Date(newMsg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
         self: true
      };

      setMessages(prev => [...prev, mappedMsg]);
      setNewMessage('');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />

      <div className="flex-1 flex h-screen overflow-hidden">

        {/* ── Channel List Panel ────────────────────────── */}
        <div className="w-[320px] shrink-0 bg-white border-r border-[#EAEFF7] flex flex-col h-full">
          {/* Panel Header */}
          <div className="p-8 pb-5 border-b border-[#F4F5F8]">
            <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-1">Admin Only</h4>
            <h2 className="text-[22px] font-[800] text-[#232051] tracking-tight leading-none">Channels</h2>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto py-3">
            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch)}
                className={`w-full text-left px-7 py-5 transition-all hover:bg-[#F9FAFC] flex items-start gap-4 relative ${activeChannel.id === ch.id ? 'bg-[#EAEFF7]' : ''}`}
              >
                {activeChannel.id === ch.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40px] bg-[#232051] rounded-r-full"></div>
                )}
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[15px] font-bold mt-0.5 ${activeChannel.id === ch.id ? 'bg-[#232051] text-white' : 'bg-[#F4F5F8] text-[#232051]'}`}>
                  #
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold text-[#232051] truncate">{ch.name}</span>
                    <span className="text-[11px] text-[#A5A8B6] font-medium ml-2 shrink-0">{ch.lastAt}</span>
                  </div>
                  <p className="text-[12px] text-[#848795] font-medium truncate">{ch.lastMessage}</p>
                </div>
                {ch.unread > 0 && (
                  <div className="absolute top-4 right-6 w-5 h-5 bg-[#232051] rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{ch.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* New Channel Button */}
          {user?.role === 'ADMIN' && (
            <div className="p-6 border-t border-[#F4F5F8]">
              <button
                onClick={() => setShowModal(true)}
                className="w-full h-[48px] bg-[#232051] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-[13px] hover:bg-[#343568] transition-colors shadow-md active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Channel
              </button>
            </div>
          )}
        </div>


        {/* ── Chat Area ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#EAEFF7]">
          {!activeChannel ? (
            <div className="flex-1 flex items-center justify-center">
               <p className="text-[#848795] font-medium text-[16px]">Select a channel to start communicating</p>
            </div>
          ) : (
            <>
          {/* Chat Header */}
          <div className="bg-white border-b border-[#EAEFF7] px-10 py-6 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[20px] font-[800] text-[#232051]"># {activeChannel.name}</span>
                <span className="px-3 py-1 bg-[#EAEFF7] rounded-full text-[10px] font-[800] text-[#848795] uppercase tracking-wider">{activeChannel.participants} participants</span>
              </div>
              <p className="text-[12px] text-[#848795] font-medium mt-1">{activeChannel.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* This Add Member Button is only visible to Admins/Masters */}
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => setShowAddMember(true)} // You'll need to create a showAddMember state!
                  title="Add Member"
                  className="w-9 h-9 rounded-xl bg-[#F4F5F8] flex items-center justify-center text-[#848795] hover:text-[#232051] hover:bg-[#EAEFF7] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </button>
              )}
              <button className="w-9 h-9 rounded-xl bg-[#F4F5F8] flex items-center justify-center text-[#848795] hover:text-[#232051] hover:bg-[#EAEFF7] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col gap-6">
            {messages.map((msg, idx) => {
              const isFirst = idx === 0 || messages[idx - 1].sender !== msg.sender;
              const color = avatarColors[msg.role] || avatarColors.FACULTY;
              return (
                <div key={msg.id} className={`flex gap-4 ${msg.self ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar – only on first in a run */}
                  {isFirst ? (
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] shrink-0 ${color.bg} ${color.text}`}>
                      {initials(msg.sender)}
                    </div>
                  ) : <div className="w-9 shrink-0" />}

                  <div className={`flex flex-col gap-1 max-w-[65%] ${msg.self ? 'items-end' : 'items-start'}`}>
                    {isFirst && (
                      <div className={`flex items-center gap-2 ${msg.self ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[11px] font-bold text-[#232051]">{msg.sender}</span>
                        <span className="text-[9px] font-[800] uppercase tracking-widest text-[#A5A8B6]">{msg.role}</span>
                        <span className="text-[10px] text-[#A5A8B6]">{msg.time}</span>
                      </div>
                    )}
                    <div className={`px-5 py-3.5 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm ${msg.self
                        ? 'bg-[#232051] text-white rounded-tr-sm'
                        : 'bg-white text-[#232051] rounded-tl-sm'
                      }`}>
                      {msg.body}
                    </div>
                    {!isFirst && (
                      <span className="text-[10px] text-[#C0C3CE]">{msg.time}</span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Message Composer */}
          <div className="bg-white border-t border-[#EAEFF7] px-10 py-6 shrink-0">
            <div className="flex items-center gap-4 bg-[#F4F5F8] rounded-2xl px-5 pr-4 h-[56px] focus-within:ring-2 focus-within:ring-[#232051]/10 transition-all">
              <input
                type="text"
                placeholder={`Message #${activeChannel.name}...`}
                className="flex-1 bg-transparent outline-none text-[14px] text-[#232051] font-medium placeholder-[#A5A8B6]"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-9 h-9 bg-[#232051] rounded-xl flex items-center justify-center text-white hover:bg-[#343568] transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-[#C0C3CE] mt-2 ml-1 font-medium">Press Enter to send · Shift+Enter for new line</p>
          </div>
            </>
          )}
        </div>
      </div>

      {showModal && <CreateChannelModal onClose={() => setShowModal(false)} onSuccess={fetchChannels} />}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          clubName={activeChannel?.name || 'Channel'}
          clubId={activeChannel?.id}
        />
      )}
    </div>
  );
};

export default Communication;
