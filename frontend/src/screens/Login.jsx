import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-8 pt-12 pb-8">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">
            Login
          </h2>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-3">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-4 bg-slate-700 text-white text-base rounded-xl border-0 outline-none focus:ring-0 placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-3">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-slate-700 text-white text-base rounded-xl border-0 outline-none focus:ring-0 placeholder-gray-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-blue-500 text-white text-base font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

