import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/admin/assets";

const List = () => {
  const { token, backendUrl, currency, userId } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/user-list", {
        headers: {
          token,
          userId: userId // Use userId from context
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
        <div className="w-full">
          {/* ------ Desktop Table Header --------- */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-4 px-6 bg-red-900/10 text-sm font-bold text-red-500 border border-red-900 rounded-t-lg">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Status</b>
            <b className="text-center">Action</b>
          </div>

          {/* ------ Product List --------- */}
          <div className="flex flex-col gap-4 md:gap-0 md:border-x md:border-b md:border-red-900 md:rounded-b-lg overflow-hidden">
            {filteredList.map((item, index) => (
              <React.Fragment key={index}>
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-6 border-b border-red-900/50 last:border-0 text-sm hover:bg-red-900/10 transition-colors relative">
                  <img className="w-12 h-12 object-cover rounded-md border border-red-900 shadow-sm" src={item.image[0]} alt="product" />
                  <div className="pr-4">
                    <p className="font-bold text-red-500 truncate">{item.name}</p>
                  </div>
                  <p className="text-red-400 font-medium">{item.category}</p>
                  <p className="font-bold text-red-600">{currency}{item.price}</p>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${item.isPublished !== false ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'}`}>
                      {item.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="text-center relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === item._id ? null : item._id); }}
                      className="p-2 hover:bg-red-900/30 rounded-full transition-colors mx-auto block"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </button>
                    {activeMenu === item._id && (
                      <div className="absolute right-0 top-10 w-48 bg-black rounded-md shadow-2xl z-20 border border-red-900 overflow-hidden text-left py-1 animate-in fade-in zoom-in duration-200">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/host/edit/${item._id}`); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 transition-colors font-bold">Edit Item</button>
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(item._id, item.isPublished); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 transition-colors font-bold">{item.isPublished !== false ? 'Set to Draft' : 'Set to Publish'}</button>
                        <hr className="border-red-900/50" />
                        <button onClick={(e) => { e.stopPropagation(); removeProduct(item._id); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 font-black hover:bg-red-950 transition-colors">Delete Item</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col bg-black border border-red-900/50 rounded-lg p-4 gap-4 relative">
                  <div className="flex gap-4">
                    <img className="w-20 h-20 object-cover rounded-md border border-red-900 shadow-sm" src={item.image[0]} alt="product" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-black text-red-500 text-base leading-tight uppercase tracking-tight">{item.name}</p>
                        <p className="text-red-400/60 text-xs font-bold mt-1 uppercase tracking-widest">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-black text-red-600">{currency}{item.price}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black ${item.isPublished !== false ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>
                          {item.isPublished !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex border-t border-red-900/30 pt-3 gap-2">
                    <button 
                      onClick={() => navigate(`/host/edit/${item._id}`)}
                      className="flex-1 bg-red-900/10 border border-red-900/40 text-red-400 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-red-900/20 transition-all"
                    >
                      Edit 
                    </button>
                    <button 
                      onClick={() => toggleStatus(item._id, item.isPublished)}
                      className="flex-1 bg-red-900/10 border border-red-900/40 text-red-400 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-red-900/20 transition-all"
                    >
                      {item.isPublished !== false ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                      onClick={() => removeProduct(item._id)}
                      className="bg-red-900/20 border border-red-900/40 text-red-600 p-2.5 rounded-md hover:bg-red-900/40 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-black border border-red-900/40 rounded-2xl shadow-2xl mx-auto w-full max-w-5xl">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-red-900/10 flex items-center justify-center rounded-full mb-8 md:mb-10 border border-red-900/20 animate-pulse shadow-[0_0_30px_rgba(255,0,0,0.05)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16 text-red-500/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.125 2.25h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75zM9 10.125h6M9 13.875h6" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-5xl font-black text-red-500 mb-4 md:mb-6 tracking-[0.2em] md:tracking-widest uppercase text-center px-4">No Products Found</h3>
            <p className="text-red-400/50 max-w-sm md:max-w-md text-center px-6 md:px-10 leading-relaxed md:leading-loose font-bold text-[10px] md:text-base uppercase tracking-tighter mb-8 md:mb-12">
              {list.length === 0 
                ? "Your shop's inventory is empty. Launch your brand by adding your first premium product now." 
                : "No matches found. Try adjusting your search filters to find what you're looking for."}
            </p>
          {list.length === 0 && (
            <button 
              onClick={() => navigate('/host/add')}
              className="bg-red-600 text-black font-black py-3 md:py-4 px-8 md:px-10 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:bg-red-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 uppercase tracking-widest text-[10px] md:text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Your First Product
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default List;
