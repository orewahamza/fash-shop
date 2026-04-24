import { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const locatiion = useLocation();

  useEffect(() => {
    if (locatiion.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [locatiion]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-black bg-gradient-to-r from-primary/15 to-secondary/15 text-center">
      <div className="inline-flex items-center justify-center border border-brand-blue-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-brand-blue-50"
          type="text"
          placeholder="Search"
        />
        <img onClick={() => setShowSearch(true)} className="w-4 cursor-pointer icon-red hover:opacity-80 transition-opacity" src={assets.search_icon} alt="icon" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer icon-red hover:opacity-80 transition-opacity"
        src={assets.cross_icon}
        alt="icon"
      />
    </div>
  ) : null;
};

export default SearchBar;
