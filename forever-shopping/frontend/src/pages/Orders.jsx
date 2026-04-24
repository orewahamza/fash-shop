import { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { ShopContext } from './../context/ShopContext';
import Title from './../components/Title';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }
      
      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/order/userorders', 
        {}, 
        { headers: { token } }
      );
      
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            item['orderNumber'] = order.orderNumber;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId, reason: 'Cancelled by user' },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        await loadOrderData();
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);



  return (
    <div className="border-t pt-16">
      <Helmet>
        <title>My Orders | Forever Shopping</title>
      </Helmet>
  
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
  
      <div>
        {loading ? (
          <Loading />
        ) : orderData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-brand-blue-300">
            <p className="text-xl font-medium text-brand-blue-50">No orders found</p>
            <p>You haven't placed any orders yet.</p>
            <Link to="/collection" className="mt-4 bg-black text-white px-8 py-3 text-sm active:bg-gray-700 transition-colors border border-brand-blue-600">
              START SHOPPING
            </Link>
          </div>
        ) : (
          orderData.map((item, index) => {
            const canCancel = item.status !== 'Delivered' && item.status !== 'Cancelled';
            const isCancelled = item.status === 'Cancelled';
              
            return (
              <div key={index} className="py-4 border-b border-brand-blue-800 text-brand-blue-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-6 text-sm">
                  <div className="w-16 sm:w-20 bg-gradient-brand p-[1px] rounded-sm flex-shrink-0">
                    <div className="bg-white rounded-sm overflow-hidden">
                      <img className="w-full" src={item.image[0]} alt="item_image" />
                    </div>
                  </div>
  
                  <div>
                    <p className="sm:text-base font-medium text-brand-blue-50">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-base text-brand-blue-300">
                      <p className="text-brand-blue-50">{currency}{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
  
                    <p className="mt-1">Order #: <span className="text-brand-blue-400 font-mono">{item.orderNumber}</span></p>
                    <p className="mt-1">Date: <span className="text-brand-blue-400">{new Date(item.date).toDateString()}</span></p>
                    <p className="mt-1">Payment: <span className="text-brand-blue-400">{item.paymentMethod}</span></p>
                  </div>
                </div>
  
                <div className="md:w-1/2 flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`min-w-2 h-2 rounded-full ${
                        isCancelled ? 'bg-red-500' : 
                        item.status === 'Delivered' ? 'bg-green-500' :
                        item.status === 'Shipped' || item.status === 'Out for delivery' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></p>
                      <p className="text-sm md:text-base text-brand-blue-50 font-medium">{item.status}</p>
                    </div>
                      
                    {isCancelled && item.cancellationReason && (
                      <p className="text-xs text-red-400">Reason: {item.cancellationReason}</p>
                    )}
                  </div>
                    
                  <div className="flex gap-2">
                    {canCancel && (
                      <button 
                        onClick={() => handleCancelOrder(item.orderId)}
                        disabled={cancellingOrderId === item.orderId}
                        className="border border-red-600 px-4 py-2 text-sm font-medium rounded-sm bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors disabled:opacity-50"
                      >
                        {cancellingOrderId === item.orderId ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                    <button 
                      onClick={loadOrderData} 
                      className="border border-brand-blue-600 px-4 py-2 text-sm font-medium rounded-sm bg-black text-brand-blue-50 hover:bg-brand-blue-900 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Orders
