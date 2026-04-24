import React from "react";
import { frontendUrl } from "../App";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-3 px-[4%] justify-between bg-black bg-gradient-to-b from-primary/20 to-secondary/20 border-b border-red-900 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center cursor-pointer">
           <p className="text-2xl font-bold text-brand-black-900 leading-none">fash-shop</p>
           <p className="text-xs font-semibold text-red-600 tracking-widest uppercase">HOST PANEL</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href={frontendUrl} className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full text-xs font-medium hover:brightness-110 transition duration-300 ease-in-out">Back to Home</a>
        <button
          onClick={() => setToken("")}
          className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-blue-900 transition duration-300 ease-in-out cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
