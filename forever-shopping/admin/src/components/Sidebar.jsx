import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-w-[80px] md:min-w-[240px] min-h-screen border-r border-red-900 bg-black'>
        <div className='flex flex-col gap-4 pt-6 pl-[10%] pr-[10%] text-[15px]'>
            
            <NavLink 
              className={({isActive}) => `flex items-center gap-3 border border-red-900 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-900/20 transition-colors ${isActive ? 'bg-red-900/30 border-red-600 text-red-500' : 'text-red-400'}`} 
              to="/add"
            >
              <img className='w-5 h-5' src={assets.add_icon} alt="add_icon" />
              <p className='hidden md:block'>Add Items</p>
            </NavLink>

            <NavLink 
              className={({isActive}) => `flex items-center gap-3 border border-red-900 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-900/20 transition-colors ${isActive ? 'bg-red-900/30 border-red-600 text-red-500' : 'text-red-400'}`} 
              to="/list"
            >
              <img className='w-5 h-5' src={assets.order_icon} alt="list_icon" />
              <p className='hidden md:block'>List Items</p>
            </NavLink>

            <NavLink 
              className={({isActive}) => `flex items-center gap-3 border border-red-900 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-900/20 transition-colors ${isActive ? 'bg-red-900/30 border-red-600 text-red-500' : 'text-red-400'}`} 
              to="/orders"
            >
              <img className='w-5 h-5' src={assets.order_icon} alt="orders_icon" />
              <p className='hidden md:block'>Orders</p>
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar