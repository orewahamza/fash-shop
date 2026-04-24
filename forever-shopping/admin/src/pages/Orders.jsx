import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        backendUrl + "/api/order/list",
        { headers: { token } }
      );
      
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status', 
        { orderId, status: event.target.value }, 
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="mb-4 font-medium text-lg text-red-500">Order Management</p>
        <button 
          onClick={fetchAllOrders}
          className="px-4 py-2 bg-red-900/20 border border-red-900 rounded text-red-400 hover:bg-red-900/40 transition-colors"
        >
          Refresh Orders
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div 
                className="grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-red-900 p-5 md:p-8 text-sm text-red-400 bg-black rounded-lg shadow-sm hover:shadow-md transition-shadow" 
                key={index}
              >
                <img className="w-12 h-12 object-contain bg-brand-black-900 rounded p-1" src={assets.parcel_icon} alt="parcel_icon" />
                
                <div>
                  <div className="mb-2">
                    {order.items.map((item, idx) => (
                      <p className="py-0.5 font-medium" key={idx}>
                        {item.name} x {item.quantity} 
                        <span className="text-red-300 text-xs ml-1 px-2 py-0.5 bg-red-900/20 rounded border border-red-900">
                          {item.size}
                        </span>
                      </p>
                    ))}
                  </div>

                  <p className="mt-3 mb-1 font-semibold text-red-500">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <div className="text-red-400 text-xs leading-relaxed">
                    <p>{order.address.street},</p>
                    <p>
                      {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-red-400 font-medium">{order.address.phone}</p>
                </div>

                <div>
                  <p className="text-sm sm:text-[15px] font-medium">Order #{order.orderNumber}</p>
                  <p className="mt-3">Items: {order.items.length}</p>
                  <p className="mt-1">Method: {order.paymentMethod}</p>
                  <p className="mt-1">Payment: {order.payment ? 'Paid' : 'Pending'}</p>
                  <p className="mt-1 text-xs">{new Date(order.date).toLocaleString()}</p>
                </div>

                <p className="text-sm sm:text-[15px] font-bold">{currency}{order.amount}</p>
                
                <select 
                  onChange={(event) => statusHandler(event, order._id)} 
                  value={order.status} 
                  disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                  className="p-2 font-semibold bg-brand-black-900 text-red-500 border border-red-900 rounded outline-none focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-black border border-red-900 rounded-lg shadow-sm">
              <div className="w-20 h-20 bg-red-900/10 flex items-center justify-center rounded-full mb-6 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-2 font-heading">No Orders Yet</h3>
              <p className="text-red-400/60 max-w-sm text-center px-4">
                Your shop is ready! When customers place orders, they will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
