import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import illustration from '../assets/signup-illustration.png';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://reservex.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
          role: 'STUDENT',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem("token", data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundColor: '#000000',
    backgroundImage: `
    radial-gradient(circle at 0% 0%, rgba(0, 0, 0, 1) 0%, transparent 40%),
      radial-gradient(circle at 35% 15%, rgba(35, 74, 205, 0.8) 0%, transparent 60%), 
      radial-gradient(circle at 100% 100%, rgba(21, 208, 236, 0.4) 0%, transparent 20%),
      radial-gradient(circle at 40% 20%, rgba(18, 37, 102, 0.8) 0%, transparent 70%)
    `,
    borderTopLeftRadius: '100px',
    borderBottomLeftRadius: '100px',
  };

  return (
    <div className="flex min-h-screen font-sans bg-white overflow-hidden">
      {/* Left Side: Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md flex flex-col items-center">
          <img 
            src={illustration} 
            alt="Illustration" 
            className="mb-10" 
            style={{ width: '348px', height: '194px' }} 
          />
          <div className="bg-[#6B85DD] rounded-3xl p-8 shadow-xl text-white w-84 h-68.5 flex flex-col justify-center">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-300 text-sm text-center bg-red-900/40 p-1 rounded">{error}</p>}
              <input
                type="text"
                placeholder="Username"
                className="bg-transparent border-b border-white/40 pb-2 outline-none focus:border-white transition-all placeholder-white/70"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent border-b border-white/40 pb-2 outline-none focus:border-white transition-all placeholder-white/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#EAEFFF] text-[#6B85DD] font-bold py-2 px-10 rounded-full self-center mt-4 hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Signup'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side: The Styled Mesh Background */}
      <div 
        className="flex-1 relative flex flex-col items-center justify-center text-white" 
        style={backgroundStyle}
      >
        <h1 
          className="text-6xl" 
          style={{ 
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            opacity: 0.8,
            letterSpacing: '0.02em'
          }}
        >
          ReserveX
        </h1>

        <p className="font-mono text-[12px] absolute bottom-12 opacity-60 tracking-widest">
          Already a User? <Link to="/login" className="underline underline-offset-4 hover:opacity-100 transition-opacity">Login</Link> instead...
        </p>
      </div>
    </div>
  );
};

export default Signup;