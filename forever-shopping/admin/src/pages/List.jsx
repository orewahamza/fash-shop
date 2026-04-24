import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const hostId = localStorage.getItem('hostId');
      const response = await axios.get(backendUrl + "/api/product/user-list", { 
        headers: { 
          token,
          userId: hostId // Pass hostId if available
        } 
      });

      if (response.data.success) {
        setList(response.data.products);
        setFilteredList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (search === "") {
      setFilteredList(list);
    } else {
      const lower = search.toLowerCase();
      setFilteredList(list.filter(item => item.name.toLowerCase().includes(lower)));
    }
  }, [search, list]);

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setActiveMenu(null);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      // If undefined, treat as true (Published)
      const isPublished = currentStatus !== false;
      const formData = new FormData();
      formData.append('isPublished', !isPublished);

      const response = await axios.put(`${backendUrl}/api/product/${id}`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success("Product status updated");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setActiveMenu(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="font-medium text-lg text-red-500">All Products List</p>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-red-900 bg-gray-900 text-red-500 rounded-lg focus:outline-none focus:border-red-600 placeholder-red-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50"
          />
        </div>
      </div>

      {filteredList.length > 0 ? (
        <div className="w-full overflow-x-auto border border-red-900 rounded-lg bg-black shadow-sm">
          <div className="min-w-[700px] md:min-w-full">
            {/* ------ List Table Title--------- */}
            <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-4 px-6 bg-red-900/10 text-sm font-bold text-red-500 border-b border-red-900">
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b>Status</b>
              <b className="text-center">Action</b>
            </div>

            {/* ------ Product List--------- */}
            {filteredList.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-6 border-b border-red-900 last:border-0 text-sm hover:bg-red-900/10 transition-colors relative"
                key={index}
              >
                <img className="w-12 h-12 object-cover rounded-md border border-red-900" src={item.image[0]} alt="product_image" />
                <div className="pr-4">
                  <p className="font-medium text-red-500 truncate">{item.name}</p>
                </div>
                <p className="text-red-400">{item.category}</p>
                <p className="font-semibold text-red-500">
                  {currency}{item.price}
                </p>

                {/* Status Column */}
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${item.isPublished !== false ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`}>
                    {item.isPublished !== false ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Action Column */}
                <div className="text-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === item._id ? null : item._id);
                    }}
                    className="p-2 hover:bg-red-900/30 rounded-full transition-colors mx-auto block"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </button>

                  {activeMenu === item._id && (
                    <div className="absolute right-0 top-10 w-48 bg-black rounded-md shadow-2xl z-20 border border-red-900 overflow-hidden text-left py-1 animate-in fade-in zoom-in duration-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item._id}`); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors"
                      >
                        Edit Item
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(item._id, item.isPublished); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors"
                      >
                        {item.isPublished !== false ? 'Set to Draft' : 'Set to Publish'}
                      </button>
                      <div className="h-px bg-red-900/50 my-1"></div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeProduct(item._id); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-950 transition-colors"
                      >
                        Delete Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-black border border-red-900 rounded-lg shadow-sm">
          <div className="w-20 h-20 bg-red-900/10 flex items-center justify-center rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.125 2.25h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75zM9 10.125h6M9 13.875h6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-500 mb-2 font-heading">No Products Found</h3>
          <p className="text-red-400/60 mb-8 max-w-sm text-center px-4 font-sans leading-relaxed">
            {list.length === 0 
              ? "Your inventory is currently empty. Start growing your store by adding your first product today." 
              : "We couldn't find any products matching your search criteria."}
          </p>
          {list.length === 0 && (
            <button 
              onClick={() => navigate('/add')}
              className="bg-red-600 text-black font-bold py-3 px-10 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Add New Product
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default List;
