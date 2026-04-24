import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Edit from "./pages/Edit";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
export const currency = '৳';
export const frontendUrl = import.meta.env.VITE_FRONTEND_URL || (import.meta.env.DEV ? 'http://localhost:5173' : '');




const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") 
  ? localStorage.getItem("token") 
  : "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    const hId = params.get('hostId');
    if (t) {
      setToken(t);
      localStorage.setItem('token', t);
    }
    if (hId) {
      localStorage.setItem('hostId', hId);
    }
    if (t || hId) {
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('hostId');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);


  useEffect(() =>{
    localStorage.setItem("token", token);
  },[token])


  return (
    <div className="bg-black min-h-screen text-red-500">
      <ToastContainer theme="dark" />
      {token === "" ? 
        <Login setToken={setToken} />
       : 
        <>
          <Navbar setToken={setToken} />
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 text-red-500 text-base overflow-x-hidden">
              <Routes>
                <Route path="/" element={<List token={token}/>} /> {/* Default to List or Add */}
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token}/>} />
                <Route path="/edit/:id" element={<Edit token={token} />} />
                <Route path="/orders" element={<Orders token={token}/>} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default App;
