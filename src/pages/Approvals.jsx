import React from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useState } from 'react';
import { useEffect } from 'react';
const Approvals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myFilings, setMyFilings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("USER_ID");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [stats, setStats] = useState({
    pending:0,
    approved:0,
    rejected:0,
    expired:0,
    total:0
  })
  const fetchApprovals = async() => {
    try {
      setLoading(true);
      const[pendingRes, statRes, filingsRes] = await Promise.all([
        api.get('/approvals/pending'),
        api.get('/approvals/stats'),
        api.get('/bookings/me')
      ])
      setPendingRequests(pendingRes.data.pending || []);
      setStats(statRes.data);
      setMyFilings(filingsRes.data || []);
    } catch (error) {
      console.log("Failed to fetch approvals : " , error);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setSearchError("");
        return;
      }
      setIsSearching(true);
      setSearchError("");
      try {
        let endpoint = searchType === 'USER_ID' 
          ? `/bookings/user/${searchQuery.trim()}`
          : `/bookings/${searchQuery.trim()}`;
        
        const res = await api.get(endpoint);
        
        // Normalize to array (since getBookingById returns an object)
        let results = Array.isArray(res.data) ? res.data : [res.data];
        
        if (results.length === 0) {
           setSearchError("No bookings found.");
        }
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchError(error.response?.data?.error || "Search failed or not found.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  };

  const handleApprove = async (bookingId) => {
  try {
    await api.post(`/approvals/${bookingId}/approve`);
    fetchApprovals();
  } catch (error) {
    console.error("Error Approving : ", error);
  }
};

const handleDecline = async(bookingId) => {
  try {
    await api.post(`/approvals/${bookingId}/reject`);
    fetchApprovals();
  } catch (error) {
    console.error("Error rejecting booking: ", error);
  }
};

const [currentTime, setCurrentTime] = useState(new Date());
useEffect(()=>{
 const timer = setInterval(() => {
  setCurrentTime(new Date());
 }, 60000);
 return () => clearInterval(timer);
},[]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
  return (
    <div className="flex min-h-screen bg-[#EAEFF7] font-manrope selection:bg-[#232051] selection:text-white">
      <Sidebar />

      <div className="flex-1 p-10 md:p-14 h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h4 className="text-[11px] font-[800] text-[#3658C9] uppercase tracking-[0.15em] mb-1">Institutional Oversight</h4>
            <h2 className="text-[34px] font-[800] text-[#232051] tracking-tight leading-none">Resource Approvals</h2>
          </div>

          <div className="flex flex-col items-end gap-5">
            <span className="text-[#848795] text-[13px] font-semibold">{formatDate(currentTime)}</span>
            <div className="flex items-center gap-2">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-[42px] bg-[#DCE4F0] rounded-full px-4 text-[12px] font-bold text-[#232051] outline-none"
              >
                <option value="USER_ID">User ID Number</option>
                <option value="BOOKING_ID">Booking ID</option>
              </select>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Press enter to search..." 
                  className="w-[240px] h-[42px] bg-[#DCE4F0] rounded-full px-5 pr-10 text-[13px] text-[#232051] placeholder-[#848795] focus:outline-none focus:ring-2 focus:ring-[#232051]/20 font-medium transition-shadow"
                />
                {isSearching ? (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] border-2 border-[#848795] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848795] w-[14px] h-[14px] cursor-pointer hover:text-[#232051]" onClick={() => handleSearch({key:'Enter'})} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              {searchResults.length > 0 && (
                 <button onClick={clearSearch} className="h-[42px] px-4 text-[12px] font-bold text-[#D9534F] bg-[#D9534F]/10 rounded-full hover:bg-[#D9534F]/20 transition-colors">Clear</button>
              )}
            </div>

              <div className="bg-[#DCE4F0] h-[42px] px-5 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-[800] text-[#232051] tracking-wider uppercase">Time: {formatTime(currentTime)}</span>
              </div>

              <button className="w-[42px] h-[42px] bg-[#DCE4F0] rounded-full flex items-center justify-center text-[#232051] hover:bg-[#D0D9e8] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
            </div>
          </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white rounded-2xl p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
            <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-4">Pending Requests</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[38px] font-[800] text-[#232051] leading-none tracking-tight">{stats.pending}</span>
              {/* <span className="text-[11px] font-bold text-[#D9534F]"></span> */}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
            <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-4">Approved Today</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[38px] font-[800] text-[#232051] leading-none tracking-tight">{stats.approved}</span>
              {/* <span className="text-[11px] font-bold text-[#3658C9]">Ready</span> */}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
            <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-4">Rejected Today</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[38px] font-[800] text-[#232051] leading-none tracking-tight">{stats.rejected}</span>
              {/* <span className="text-[11px] font-bold text-[#A5A8B6]">Finalized</span> */}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
            <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-4">Expired</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[38px] font-[800] text-[#232051] leading-none tracking-tight">{stats.expired}</span>
              {/* <span className="text-[11px] font-bold text-[#A5A8B6]">Finalized</span> */}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border-l-4 border-[#232051] flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
            <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] mb-4">Total Requests</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[38px] font-[800] text-[#232051] leading-none tracking-tight">{stats.total}</span>
              {/* <span className="text-[11px] font-bold text-[#A5A8B6]">Year to date</span> */}
            </div>
          </div>

        </div>

        {/* Search Results */}
        {(searchResults.length > 0 || searchError) && (
          <div className="mb-12">
            <div className="flex justify-between items-end mb-5">
              <h3 className="text-[20px] font-bold text-[#232051] tracking-tight ml-1">Search Results</h3>
            </div>
            
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors">
              {searchError ? (
                 <div className="py-5 text-center text-[#D9534F] font-semibold">{searchError}</div>
              ) : (
                <>
                  <div className="grid grid-cols-[3fr_4fr_2fr_2fr] gap-4 pb-4 border-b-[1.5px] border-[#F4F5F8] px-2 mb-2">
                    <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Name / Detail</span>
                    <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Resource</span>
                    <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Date</span>
                    <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] text-right pr-2">Status</span>
                  </div>
                  {searchResults.map((request) => (
                    <div key={request.id} className="grid grid-cols-[3fr_4fr_2fr_2fr] gap-4 items-center py-5 px-2 border-b-[1.5px] border-[#F4F5F8] hover:bg-[#F9FAFC] transition-colors -mx-2 px-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-[36px] h-[36px] rounded-full bg-[#5B85E8]/20 text-[#3658C9] flex items-center justify-center font-bold text-[13px] shrink-0">
                          {request.user?.name ? request.user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-[#232051] font-bold text-[14px]">
                          {request.user?.name || "Unknown"}
                        </span>
                      </div>
                      
                      <span className="text-[#6D7184] font-medium text-[14px]">
                        {request.room?.name || request.purpose || "Resource Request"}
                      </span>
                      
                      <span className="text-[#6D7184] font-medium text-[14px]">
                        {new Date(request.startTime).toLocaleDateString()}
                      </span>
                      
                      <div className="flex justify-end pr-2">
                         <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${request.status === 'APPROVED' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : request.status === 'PENDING' ? 'bg-[#5B85E8]/10 text-[#5B85E8]' : 'bg-[#F4F5F8] text-[#A5A8B6]'}`}>{request.status}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Incoming Student Requests Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-[20px] font-bold text-[#232051] tracking-tight ml-1">Incoming Student Requests</h3>
            <button className="text-[12px] font-bold text-[#3658C9] hover:opacity-70 transition-opacity">View All History</button>
          </div>
          
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-transparent hover:border-[#EAEFF7] transition-colors">
            {/* Table Header */}
            <div className="grid grid-cols-[3fr_4fr_2fr_2fr] gap-4 pb-4 border-b-[1.5px] border-[#F4F5F8] px-2 mb-2">
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Student Name</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Resource</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em]">Date</span>
              <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.15em] text-right pr-2">Actions</span>
            </div>
              {/*Dynamic Rows*/}
              {/* Dynamic Rows */}
{loading ? (
  <div className="py-5 text-center text-[#848795]">Loading requests...</div>
) : pendingRequests.length === 0 ? (
  <div className="py-5 text-center text-[#848795]">No pending requests right now.</div>
) : (
  pendingRequests.map((request) => (
    <div key={request.id} className="grid grid-cols-[3fr_4fr_2fr_2fr] gap-4 items-center py-5 px-2 border-b-[1.5px] border-[#F4F5F8] hover:bg-[#F9FAFC] transition-colors -mx-2 px-4 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-[36px] h-[36px] rounded-full bg-[#5B85E8]/20 text-[#3658C9] flex items-center justify-center font-bold text-[13px] shrink-0">
          {/* Grab first letter of user's name */}
          {request.user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-[#232051] font-bold text-[14px]">
          {request.user?.name}
        </span>
      </div>
      
      {/* Show the Room Name if it's a room booking, otherwise fallback to purpose */}
      <span className="text-[#6D7184] font-medium text-[14px]">
        {request.room?.name || request.purpose || "Resource Request"}
      </span>
      
      <span className="text-[#6D7184] font-medium text-[14px]">
        {new Date(request.startTime).toLocaleDateString()}
      </span>
      
      <div className="flex justify-end gap-3 pr-2">
        <button 
          onClick={() => handleDecline(request.id)}
          className="w-[84px] h-[36px] rounded-full border-[1.5px] border-[#d9534f]/80 text-[#D9534F] text-[12px] font-bold hover:bg-[#D9534F]/5 hover:border-[#D9534F] transition-colors"
        >
          Decline
        </button>
        <button 
          onClick={() => handleApprove(request.id)}
          className="w-[84px] h-[36px] rounded-full bg-[#232051] text-white text-[12px] font-bold hover:bg-[#343568] transition-colors shadow-sm"
        >
          Approve
        </button>
      </div>
    </div>
  ))
)}
          </div>
        </div>

        {/* Personal Resource Filings */}
        <div>
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-[20px] font-bold text-[#232051] tracking-tight ml-1">Personal Resource Filings</h3>
            <div className="flex items-center gap-5 mr-3">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-[#5B85E8]"></div>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.1em]">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-[#4CAF50]"></div>
                <span className="text-[10px] font-[800] text-[#A5A8B6] uppercase tracking-[0.1em]">Approved</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            
            {myFilings.length === 0 ? (
              <div className="col-span-2 py-4 text-center text-[#848795]">You have no personal resource filings.</div>
            ) : (
              myFilings.map((filing) => {
                const isApproved = filing.status === 'APPROVED';
                return (
                  <div key={filing.id} className="bg-white rounded-[1.8rem] p-8 shadow-sm flex flex-col h-[180px] justify-between border border-transparent hover:border-[#EAEFF7] transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[18px] font-bold text-[#232051] mb-2 leading-tight">{filing.room?.name || "Unknown Resource"}</h4>
                        <p className="text-[#848795] text-[13px] font-medium">Purpose: {filing.purpose || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-[6px] h-[6px] rounded-full ${isApproved ? 'bg-[#4CAF50]' : 'bg-[#5B85E8]'}`}></div>
                        <span className={`text-[10px] font-[800] ${isApproved ? 'text-[#4CAF50]' : 'text-[#5B85E8]'} uppercase tracking-[0.1em]`}>{filing.status}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-5">
                      <div className="flex items-center gap-2 text-[#A5A8B6]">
                        <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="text-[12px] font-bold">{formatDate(filing.startTime)}</span>
                      </div>
                      <button className="text-[12px] font-bold text-[#3658C9] hover:text-[#232051] transition-colors">View Details</button>
                    </div>
                  </div>
                )
              })
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default Approvals;
