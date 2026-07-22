import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios";
import { UserContext } from "../context/user.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    axiosInstance
      .post("/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success("Welcome back!");
        navigate("/");
      })
      .catch((err) => {
        toast.error(
        err.response?.data?.message ||
        "Invalid email or password."
    );
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] font-sans">
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-md shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* title bar */}
        <div className="flex items-center gap-1.5 h-9 px-4 bg-[#2d2d2d] border-b border-[#3c3c3c]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
          <span className="ml-3 text-[12px] font-mono text-[#858585]">login.jsx</span>
        </div>

        <div className="px-8 pt-8 pb-8">

          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 rounded-md bg-[#0e639c] flex items-center justify-center mb-4">
              <i className="ri-code-s-slash-line text-white text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="text-[13px] text-[#858585] mt-1 font-mono">
              // sign in to continue
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[#cccccc] text-[13px] font-medium mb-2">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-[#3c3c3c] text-[#e6e6e6] text-sm rounded-sm border border-[#3c3c3c] outline-none focus:border-[#3794ff] placeholder:text-[#8a8a8a] transition-colors duration-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#cccccc] text-[13px] font-medium mb-2">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 bg-[#3c3c3c] text-[#e6e6e6] text-sm rounded-sm border border-[#3c3c3c] outline-none focus:border-[#3794ff] placeholder:text-[#8a8a8a] transition-colors duration-100"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0e639c] text-white text-sm font-medium rounded-sm hover:bg-[#1177bb] transition-colors duration-100"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-center text-[#858585] text-[13px] mt-7">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#3794ff] hover:text-[#5aa8ff] transition-colors duration-100">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

