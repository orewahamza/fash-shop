import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, token } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const [cartData, setCartData] = useState([]);
  const [showAuthRedirect, setShowAuthRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowAuthRedirect(true);
      toast.error("Please log in first");
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowAuthRedirect(false);
    }
  }, [token, navigate]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }

  }, [cartItems, products]);

  if (showAuthRedirect) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-brand-blue-50">
        <p className="text-xl font-medium mb-4">Please log in first</p>
        <p className="text-brand-blue-300">Redirecting to login page...</p>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14 text-brand-blue-50 text-center">
        <Helmet>
          <title>Cart | Forever Shopping</title>
        </Helmet>
        <div className="text-2xl mb-8">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <img src={assets.cart_icon} className="w-16 opacity-50" alt="Empty Cart" />
          <p className="text-xl font-medium">Your cart is currently empty</p>
          <p className="text-brand-blue-300 mt-[-15px]">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/collection" className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 transition-colors border border-brand-blue-600">
            BROWSE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 text-brand-blue-50">
      <Helmet>
        <title>Cart | Forever Shopping</title>
      </Helmet>
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            product => product._id === item._id
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-brand-blue-300 grid grid-cols-[3fr_1.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-2 sm:gap-4"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-12 sm:w-20 bg-gradient-brand p-[1px] rounded-sm flex-shrink-0">
                  <div className="bg-white rounded-sm overflow-hidden text-black">
                    <img
                      className="w-full"
                      src={productData.image[0]}
                      alt=""
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-lg font-bold text-brand-blue-50 truncate">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-5 mt-2">
                    <p className="text-[10px] sm:text-base font-bold text-red-500">
                      {currency}{productData.price}
                    </p>
                    <p className="px-1.5 sm:px-3 py-0.5 border border-brand-blue-600 bg-black text-white text-[10px] sm:text-xs">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center border border-brand-blue-600 rounded overflow-hidden">
                <button 
                  onClick={() => {
                    const newQty = Math.max(1, item.quantity - 1);
                    updateQuantity(item._id, item.size, newQty);
                  }}
                  className="px-2 sm:px-3 py-1 bg-black text-white hover:bg-brand-blue-900 border-r border-brand-blue-600 transition-colors text-sm"
                >-</button>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          item._id,
                          item.size,
                          Number(e.target.value)
                        )
                  }
                  className="w-full bg-black text-white text-center focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-xs sm:text-sm min-w-[20px]"
                  type="number"
                  min={1}
                  value={item.quantity}
                />
                <button 
                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                  className="px-2 sm:px-3 py-1 bg-black text-white hover:bg-brand-blue-900 border-l border-brand-blue-600 transition-colors text-sm"
                >+</button>
              </div>

              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="bin_icon"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />

          <div className="w-full text-end">
            <button
              onClick={() => {
                if (!token) {
                  toast.error("Please login to proceed");
                  navigate("/login");
                  return;
                }
                navigate("/place-order");
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white text-sm my-8 px-8 py-3 hover:brightness-110 transition-all cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
