import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "৳ ";
  const delivery_fee = 10;

  // backendUrl from env with sensible dev fallback
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  // for searching state
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // for products state
  const [cartItems, setCartItems] = useState({});

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "user");
  const [userType, setUserType] = useState(localStorage.getItem("userType") || "user");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");


  const navigate = useNavigate();

  const addToCart = async (itemId, size, quantity = 1) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);
    // check if the item already exists in the cart
    // if it does, increment the quantity
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
      } else {
        cartData[itemId][size] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, quantity },
          { headers: { token } },
        );
        toast.success("Product added to cart successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      toast.success("Product added to cart successfully");
    }
  };

  // add to card counter
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  // update quantity of the cart item
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;
      for (const size in cartItems[itemId]) {
        try {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            totalAmount += itemInfo.price * quantity;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // Fetch products data from the backend
  const getProductsData = async () => {
    try {
      console.log("Fetching products from:", backendUrl + "/api/product/list");
      const response = await axios.get(backendUrl + "/api/product/list");
      console.log("Product fetch response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        let productsList = response.data.products;
        // If products are undefined, try checking other common response structures or default to empty
        if (!productsList) {
          console.warn("API returned success but no 'products' field found:", JSON.stringify(response.data, null, 2));
          productsList = [];
        }

        setProducts(productsList);
      } else {
        console.error("API Error:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  // Fetch user cart data from the backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserProfile = async (token) => {
    try {
      const response = await axios.get(backendUrl + "/api/user/profile", {
        headers: { token },
      });
      if (response.data.success) {
        setUserType(response.data.user.type);
        setUserRole(response.data.user.role);

        setUserEmail(response.data.user.email);
        setUserName(response.data.user.name);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userType", response.data.user.type);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    if (localStorage.getItem("userRole")) {
      setUserRole(localStorage.getItem("userRole"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserProfile(token);
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userRole,
    setUserRole,
    userType,
    setUserType,
    userId,
    setUserId,

    userEmail,
    setUserEmail,
    userName,
    setUserName,
    getUserProfile,
  };

  ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validates that 'children' is a React node and required
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
