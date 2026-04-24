import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin/assets";
import { ShopContext } from "../../context/ShopContext";

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };



  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders();

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }




  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <p className="mb-4 font-medium text-lg text-red-500">Order Page</p>
      <div className="flex flex-col gap-5">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              className="grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-red-900/50 p-6 md:p-8 text-sm text-red-400 bg-black rounded-lg shadow-lg hover:border-red-600 transition-all duration-300"
              key={index}
            >
              <div className="flex items-center justify-center bg-red-900/10 p-4 rounded-lg border border-red-900/30">
                <img className="w-12 h-12 object-contain" src={assets.parcel_icon} alt="parcel_icon" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p className="py-0.5 font-bold text-red-500 flex items-center gap-2" key={idx}>
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      {item.name} x {item.quantity} 
                      <span className="text-[10px] px-2 py-0.5 bg-red-900/20 rounded-full border border-red-900 tracking-tighter uppercase">{item.size}</span>
                    </p>
                  ))}
                </div>

                <div className="pt-2 border-t border-red-900/30">
                  <p className="font-black text-red-500 uppercase tracking-wider text-xs mb-1">Customer Info</p>
                  <p className="font-bold text-red-400">{order.address.firstName + " " + order.address.lastName}</p>
                  <div className="text-red-400/60 text-[11px] leading-relaxed font-medium">
                    <p>{order.address.street}</p>
                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}`}</p>
                    <p className="mt-1 text-red-500 font-bold">{order.address.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 font-medium">
                <p className="text-red-500">Items: <span className="font-black">{order.items.length}</span></p>
                <div className="space-y-1 text-[11px] text-red-400/70">
                  <p>Method: <span className="text-red-400 font-bold uppercase">{order.paymentMethod}</span></p>
                  <p>Payment: <span className={`font-black ${order.payment ? 'text-green-500' : 'text-red-600'}`}>{order.payment ? 'DONE' : 'PENDING'}</span></p>
                  <p>{new Date(order.date).toLocaleDateString()} | {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-2xl font-black text-red-600">{currency}{order.amount}</p>
              </div>

              <div className="flex items-center">
                <select 
                  onChange={(event) => statusHandler(event, order._id)} 
                  value={order.status} 
                  className="w-full p-3 font-black text-xs uppercase bg-gray-900 text-red-500 border border-red-900 rounded-lg outline-none focus:ring-2 focus:ring-red-600/50 appearance-none cursor-pointer hover:bg-black transition-colors"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-black border border-red-900/40 rounded-2xl shadow-2xl mx-auto w-full max-w-5xl">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-red-900/10 flex items-center justify-center rounded-full mb-8 md:mb-10 border border-red-900/20 shadow-[0_0_30px_rgba(255,0,0,0.05)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16 text-red-500/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-5xl font-black text-red-500 mb-6 md:mb-10 tracking-[0.2em] md:tracking-widest uppercase text-center px-4">No Orders Yet</h3>
            <div className="flex flex-col gap-3 md:gap-4 items-center">
              <p className="text-red-400/60 max-w-sm md:max-w-md text-center px-6 md:px-10 leading-loose font-black text-[11px] md:text-lg uppercase tracking-[0.2em]">
                Your sales journey starts here.
              </p>
              <p className="text-red-500/30 max-w-xs md:max-w-lg text-center px-8 md:px-12 leading-relaxed font-bold text-[9px] md:text-sm uppercase tracking-[0.3em]">
                Once customers place orders, they will appear in this professional queue.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
