import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { token, userEmail, userName, backendUrl, getUserProfile } = useContext(ShopContext);
  
  const [name, setName] = useState(userName || "");

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
  }, [userName]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/update-profile",
        { name },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Profile updated successfully");
        getUserProfile(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 text-brand-blue-50">
      <Helmet>
        <title>Profile | Forever Shopping</title>
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <div className="bg-black border rounded p-4 bg-gradient-to-br from-primary/20 to-secondary/20">
        <p className="text-sm text-brand-blue-300 mb-2">
          Token present: {token ? "Yes" : "No"}
        </p>
        <div className="grid gap-3">
          <label className="block">
            <span className="text-sm">Name</span>
            <input 
              className="w-full border border-brand-blue-600 bg-black text-white px-3 py-2" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Email</span>
            <input 
              className="w-full border border-brand-blue-600 bg-black text-brand-blue-300 px-3 py-2 cursor-not-allowed opacity-70" 
              placeholder="Your email" 
              value={userEmail || ""}
              readOnly
            />
          </label>
          <button 
            onClick={handleUpdateProfile}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 mt-2 hover:brightness-110"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
