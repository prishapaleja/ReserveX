import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../api/axios.js';
import useAuthStore from '../store/authStore.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      loginAction(data.user, data.accessToken);
      navigate('/dashboard');
    }
    //raw dog http -
    //     try {
    //       const response = await fetch('https://reservex.onrender.com/api/auth/login', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           email: email,
    //           password: password,
    //         }),
    //       });

    //       const data = await response.json();

    //       if (!response.ok) {
    //         // This catches 400, 401, 500 errors from your backend
    //         throw new Error(data.message || 'Login failed. Please check your credentials.');
    //       }

    //       // 1. Store the token (and user info if needed) in localStorage
    //       localStorage.setItem('token', data.token);

    //       // 2. Redirect to dashboard
    //       navigate('/dashboard');
    // }
    catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-manrope bg-[#111111]">
      {/* Background Textures */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg/paper-bg.jpg)' }}
      />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 scale-x-[-1]"
        style={{ backgroundImage: 'url(/bg/grid-bg.jpg)' }}
      />

      {/* Main Glass Panel */}
      <div className="relative z-10 glass-panel rounded-[2.5rem] w-full max-w-[1050px] min-h-[620px] mx-4 flex flex-col md:flex-row overflow-hidden">

        {/* Left Side: Branding */}
        <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center">
          <h1 className="font-averia text-[2.5rem] md:text-[2.2rem] text-[#22234B] tracking-normal leading-tight mb-6">
            ReserveX
          </h1>
          <h2 className="text-[3.5rem] md:text-[4.2rem] font-[800] text-[#22234B] leading-[1.05] tracking-tight mb-8">
            Systems<br />for Faculty.
          </h2>
          <div className="w-[45px] h-[1px] bg-[#22234B]/20 mb-8"></div>
          <p className="text-[#848795] text-[15px] md:text-[16px] leading-[1.6] max-w-[340px] font-medium">
            Precision resource management for the modern academic institution. Engineered for clarity and seamless oversight.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full md:w-[480px] p-6 lg:p-8 flex items-center justify-center">
          <div className="bg-white rounded-[2rem] p-10 lg:p-12 w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative">
            <div className="text-center mb-8">
              <h3 className="text-[#22234B] text-[1.4rem] font-bold mb-1">Welcome</h3>
              <p className="text-[#848795] text-[13px] font-medium">Secure portal access for authorized personnel.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

              <div className="flex flex-col gap-[6px]">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-[0.12em] ml-1">Email</label>
                <input
                  type="text"
                  placeholder="faculty_id"
                  className="login-input w-full h-[54px] rounded-2xl px-5 text-[15px] text-[#22234B] border border-[#EAEBF0] placeholder-[#B5B7C4] transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-[0.12em] ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="login-input w-full h-[54px] rounded-2xl px-5 text-[15px] text-[#22234B] border border-[#EAEBF0] placeholder-[#B5B7C4] transition-all duration-200 tracking-[0.2em] font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between mt-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-[#E0E2E9] flex items-center justify-center group-hover:border-[#22234B] transition-colors">
                    {/* Empty inside for un-checked state. To make it functional, one would use checked state. */}
                  </div>
                  <span className="text-[12px] text-[#848795] font-semibold select-none pt-[1px]">Keep me signed in</span>
                </label>
                <Link to="#" className="text-[12px] font-bold text-[#22234B] hover:opacity-70 transition-opacity">
                  Lost access?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] bg-[#22234B] hover:bg-[#343568] active:bg-[#1A1A3B] text-white rounded-[1.1rem] text-[15px] font-[600] transition-colors mt-1 shadow-[0_8px_20px_-8px_rgba(34,35,75,0.6)] flex items-center justify-center disabled:opacity-70"
              >
                {loading ? '...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[12px] text-[#848795] font-semibold">
                New faculty member? <button type="button" onClick={() => setShowModal(true)} className="text-[#22234B] font-bold hover:opacity-70 transition-opacity cursor-pointer">Request credentials</button>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#8E8F96]/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-[1.8rem] p-8 md:p-10 w-full max-w-[500px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-[6px] text-[#A5A8B6] hover:text-[#22234B] transition-colors rounded-full hover:bg-gray-50"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-[6px] mb-2">
              <svg width="13" height="15" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0L0 3.11111V7.77778C0 11.55 3.01775 15.0267 7 16C10.9823 15.0267 14 11.55 14 7.77778V3.11111L7 0ZM7 14.1689C3.9355 13.2711 1.55556 10.3778 1.55556 7.77778V4.28444L7 1.86667L12.4444 4.28444V7.77778C12.4444 10.3778 10.0645 13.2711 7 14.1689ZM6.22222 10.8889L3.11111 7.77778L4.20778 6.68111L6.22222 8.68778L9.79222 5.11778L10.8889 6.22222L6.22222 10.8889Z" fill="#3658C9" />
              </svg>
              <span className="text-[9.5px] font-[800] text-[#3658C9] uppercase tracking-[0.1em] mt-[2px]">Credential Verification</span>
            </div>

            <h3 className="text-[#22234B] text-[1.7rem] font-bold mb-[2px] tracking-tight">Request Credentials</h3>
            <p className="text-[#6D7184] text-[13px] font-medium mb-8">Provide your institutional details for portal access.</p>

            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-[0.1em] ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Julian Sterling"
                  className="w-full h-[54px] bg-[#F4F5F8] rounded-[14px] px-5 text-[15px] text-[#22234B] placeholder-[#B4B7C4] outline-none focus:bg-[#EAEBF0] transition-colors font-semibold"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-[0.1em] ml-1">Department</label>
                <div className="relative cursor-pointer">
                  <select className="w-full h-[54px] bg-[#F4F5F8] rounded-[14px] px-5 text-[15px] text-[#22234B] outline-none focus:bg-[#EAEBF0] transition-colors appearance-none cursor-pointer font-semibold">
                    <option value="cs">Computer Science</option>
                    <option value="math">Mathematics</option>
                    <option value="physics">Physics</option>
                  </select>
                  <svg className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#848795" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[10px] font-bold text-[#848795] uppercase tracking-[0.1em] ml-1">Institutional Email</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A5A8B6] font-medium text-[16px] pointer-events-none">@</span>
                  <input
                    type="email"
                    placeholder="j.sterling@university.edu"
                    className="w-full h-[54px] bg-[#F4F5F8] rounded-[14px] pl-[42px] pr-5 text-[15px] text-[#22234B] placeholder-[#B4B7C4] outline-none focus:bg-[#EAEBF0] transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="mt-2 bg-[#EEF1F6] p-4 rounded-[14px] flex gap-[14px] items-start">
                <div className="shrink-0 mt-[1px] w-[15px] h-[15px] rounded-full border-[1.5px] border-[#3658C9] flex items-center justify-center text-[#3658C9]">
                  <span className="text-[10px] font-bold font-serif leading-none italic pr-[1px]">i</span>
                </div>
                <p className="text-[12px] text-[#6D7184] leading-[1.6] pr-2 font-medium">
                  Submitting this request initiates an automated verification with the Institutional Academic Registry. You will receive an email confirmation within 24 hours.
                </p>
              </div>

              <div className="mt-5 flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-[14px] text-[14px] font-bold text-[#6D7184] hover:text-[#22234B] transition-colors bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[#22234B] hover:bg-[#343568] text-white px-8 py-[14px] rounded-[14px] text-[14px] font-bold transition-colors shadow-[0_8px_20px_-8px_rgba(34,35,75,0.6)] cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;