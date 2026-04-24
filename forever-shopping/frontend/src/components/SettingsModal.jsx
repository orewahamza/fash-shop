import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const SettingsModal = ({ isOpen, onClose }) => {
  const { token, setToken, backendUrl, userType, setUserType, getUserProfile, userEmail } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('main'); // main, password, toggle-confirm, warning
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggle-confirm tab

  // Visibility states for Change Password tab
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [loading, setLoading] = useState(false);

  // Toggle Preferences (Mock state for now as backend support wasn't requested for these specific toggles)
  const [notifications, setNotifications] = useState({ email: true, app: true });
  const [emailUpdates, setEmailUpdates] = useState({ promo: true, system: true });

  useEffect(() => {
    if (isOpen) {
      setActiveTab('main');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVerified(false);
      setShowPassword(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyPassword = async () => {
    if (!password) {
      toast.error("Please enter your current password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/user/verify-password',
        { password },
        { headers: { token } }
      );

      if (response.data.success) {
        setPasswordVerified(true);
        toast.success("Password verified. You can now set a new password.");
      } else {
        toast.error("Current password is incorrect. Please try again.");
        setPassword('');
        // Focus will naturally return to the empty input if user clicks again
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordVerified) {
      await handleVerifyPassword();
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/user/change-password',
        { oldPassword: password, newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setActiveTab('main');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordVerified(false);
      } else {
        toast.error(response.data.message);
        // If the error suggests current password mismatch (race condition), 
        // we might want to reset verification, but let's keep it simple for now
        if (response.data.message.includes('Current password is incorrect')) {
          setPasswordVerified(false);
          setPassword('');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeToggle = async (e) => {
    e.preventDefault();
    const requestedType = userType === 'user' ? 'host' : 'user';

    try {
      setLoading(true);
      let currentPassword = password;



      const response = await axios.post(
        backendUrl + '/api/user/change-type',
        { password: currentPassword, requestedType },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }

        const newToken = response.data.token || token;

        // Update local storage with new type/role from response
        if (response.data.type) {
          localStorage.setItem('userType', response.data.type);
          setUserType(response.data.type);
        }
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
          // If setUserRole is available in context, use it. Based on ShopContext, it is.
          // We can also call getUserProfile to ensure everything is synced
        }

        // Refresh profile to ensure all state is consistent
        await getUserProfile(newToken);

        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleForgotPassword = async () => {
    if (!userEmail) {
      toast.error("User email not found. Please refresh the page.");
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/request-password-reset', { email: userEmail });
      if (response.data.success) {
        toast.success("Reset link sent to your email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-black bg-gradient-to-br from-primary/30 to-secondary/30 p-6 rounded-lg shadow-lg max-w-md w-full relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-blue-400 hover:text-white">
          <img src={assets.cross_icon} className="w-4" alt="close" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-white">Settings</h2>

        {activeTab === 'main' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('password')}
              className="w-full py-2 px-4 border rounded hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 text-left text-white"
            >
              Change Password
            </button>

            <div className="border p-4 rounded text-white">
              <h3 className="font-semibold mb-2">Notification Preferences</h3>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
                Email Notifications
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={notifications.app} onChange={() => setNotifications({ ...notifications, app: !notifications.app })} />
                In-App Notifications
              </label>
            </div>

            <div className="border p-4 rounded text-white">
              <h3 className="font-semibold mb-2">Email Updates</h3>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={emailUpdates.promo} onChange={() => setEmailUpdates({ ...emailUpdates, promo: !emailUpdates.promo })} />
                Promotional Emails
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={emailUpdates.system} onChange={() => setEmailUpdates({ ...emailUpdates, system: !emailUpdates.system })} />
                System Emails
              </label>
            </div>

            <button
              onClick={() => {
                if (userType === 'host') {
                  setActiveTab('warning');
                } else {
                  setActiveTab('toggle-confirm');
                }
              }}
              className="w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded hover:brightness-110"
            >
              {userType === 'user' ? 'Become a Host' : 'Switch to Normal User'}
            </button>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Change Password</h3>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`border p-2 rounded bg-black text-white w-full ${passwordVerified ? 'border-green-500' : ''}`}
                required
                disabled={passwordVerified}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-400 hover:text-white"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {!passwordVerified && (
              <div className="flex justify-end mt-[-10px]">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-brand-blue-400 hover:text-brand-blue-600 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="border p-2 rounded bg-black text-white w-full disabled:opacity-50"
                required={passwordVerified}
                disabled={!passwordVerified}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-400 hover:text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={!passwordVerified}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="border p-2 rounded bg-black text-white w-full disabled:opacity-50"
                required={passwordVerified}
                disabled={!passwordVerified}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!passwordVerified}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveTab('main')} className="flex-1 py-2 border rounded text-white">Cancel</button>

              {!passwordVerified ? (
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  disabled={loading || !password}
                  className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 hover:brightness-110"
                >
                  {loading ? 'Verifying...' : 'Verify Password'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded disabled:bg-brand-blue-400 hover:brightness-110"
                >
                  {loading ? 'Processing...' : 'Change Password'}
                </button>
              )}
            </div>
          </form>
        )}

        {activeTab === 'warning' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-red-600">⚠️ Critical Warning</h3>
            <p className="text-brand-black-900">
              You are about to switch from <strong>Host</strong> to <strong>Normal User</strong>.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700 font-bold">
                By proceeding, ALL your published products will be permanently DELETED.
              </p>
              <p className="text-sm text-red-700 mt-2">
                This action cannot be undone. Are you absolutely sure you want to proceed?
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('main')}
                className="flex-1 py-2 border rounded hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setActiveTab('toggle-confirm')}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                I Agree, Proceed
              </button>
            </div>
          </div>
        )}

        {activeTab === 'toggle-confirm' && (
          <form onSubmit={handleUserTypeToggle} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">
              {userType === 'user' ? 'Confirm Host Access' : 'Confirm Switch to User'}
            </h3>
            <p className="text-brand-blue-300 text-sm">
              {userType === 'user'
                ? 'By becoming a host, you will gain access to the Host Panel.'
                : 'Are you sure you want to switch back to a normal user? You may lose access to host features.'}
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700">
                Please enter your password to confirm this change.
              </p>
            </div>

            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="border p-2 rounded w-full bg-black text-white"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-brand-blue-400 hover:text-brand-blue-600 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
            </>

            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveTab('main')} className="flex-1 py-2 border rounded text-white">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded disabled:bg-brand-blue-400 hover:brightness-110"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
