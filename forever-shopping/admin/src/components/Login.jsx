import React, { useState } from "react";
import { backendUrl, frontendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEmail, MdLock } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-black">
      <div className="bg-black shadow-[0_0_15px_rgba(255,0,0,0.3)] border border-red-900 rounded-lg px-8 py-6 max-w-md">
        {/* Text Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
           <p className="text-3xl font-bold text-red-600 leading-none">fash-shop</p>
           <p className="text-sm font-semibold text-red-500 tracking-widest uppercase mt-1">HOST PANEL</p>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center text-red-500">Host Panel</h1>
        <form onSubmit={onSubmitHandler}>
          {/* Email Field */}
          <div className="mb-3 min-w-72">
            <p className="flex items-center text-sm font-medium text-red-400 mb-2">
              <MdEmail className="mr-2 text-red-600 text-lg" /> Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="your@email.com"
              required
              className="rounded-md w-full px-3 py-2 border border-red-900 bg-gray-900 text-red-500 outline-none focus:border-red-600"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 min-w-72">
            <p className="flex items-center text-sm font-medium text-red-400 mb-2">
              <MdLock className="mr-2 text-red-600 text-lg" /> Password
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="enter your password"
              required
              className="rounded-md w-full px-3 py-2 border border-red-900 bg-gray-900 text-red-500 outline-none focus:border-red-600"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 mt-2 w-full py-2 px-4 rounded-md text-black font-bold bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
          >
            <FiLogIn className="text-lg" /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
