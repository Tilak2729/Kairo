import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { UserContext } from '../context/user.context';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post('/users/register', { email, password });

      console.log(res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
      }

      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] font-sans">
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-md shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* title bar */}
        <div className="flex items-center gap-1.5 h-9 px-4 bg-[#2d2d2d] border-b border-[#3c3c3c]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
          <span className="ml-3 text-[12px] font-mono text-[#858585]">register.jsx</span>
        </div>

        <div className="px-8 pt-8 pb-8 text-white">

          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 rounded-md bg-[#0e639c] flex items-center justify-center mb-4">
              <i className="ri-user-add-line text-white text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-white">
              Create an account
            </h2>
            <p className="text-[13px] text-[#858585] mt-1 font-mono">
              // set up your workspace
            </p>
          </div>

          <form onSubmit={submitHandler}>
            {error && (
              <div className="flex items-center gap-2 bg-[#3a1d1d] border border-[#5a2626] text-[#f48771] text-[13px] rounded-sm px-3 py-2 mb-5">
                <i className="ri-error-warning-line shrink-0"></i>
                <p>{error}</p>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-[#cccccc] text-[13px] font-medium">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#3c3c3c] border border-[#3c3c3c] text-[#e6e6e6] text-sm placeholder:text-[#8a8a8a] outline-none focus:border-[#3794ff] transition-colors duration-100"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-[#cccccc] text-[13px] font-medium">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#3c3c3c] border border-[#3c3c3c] text-[#e6e6e6] text-sm placeholder:text-[#8a8a8a] outline-none focus:border-[#3794ff] transition-colors duration-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-sm bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm font-medium transition-colors duration-100"
            >
              Register
            </button>
          </form>

          <p className="mt-7 text-center text-[#858585] text-[13px]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3794ff] hover:text-[#5aa8ff] transition-colors duration-100">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


