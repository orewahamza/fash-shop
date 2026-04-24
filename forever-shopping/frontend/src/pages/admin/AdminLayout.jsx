import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import { ShopContext } from '../../context/ShopContext';

const AdminLayout = () => {
  const { token, userType, setToken } = useContext(ShopContext);

  // Guard: Only allow hosts
  if (userType !== 'host') {
    return <Navigate to="/" replace />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-black min-h-screen text-red-500">
      <div className="flex w-full flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1 w-full p-2 sm:p-4 md:p-8 lg:p-10 text-red-500 text-base overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
