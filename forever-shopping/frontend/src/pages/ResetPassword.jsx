import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { backendUrl } = useContext(ShopContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        try {
            const response = await axios.post(backendUrl + '/api/user/reset-password', {
                token,
                newPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-brand-black-900'>
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="prata-regular text-3xl">Reset Password</p>
                <hr className='border-none h-[1.5px] w-8 bg-gradient-to-r from-primary to-secondary'/>
            </div>
            
            <form onSubmit={onSubmitHandler} className="w-full flex flex-col gap-4">
                <div className="w-full relative">
                    <label htmlFor="newPassword" className="sr-only">New Password</label>
                    <input 
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"} 
                        className='w-full px-3 py-2 border border-brand-blue-600' 
                        placeholder='New Password' 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-blue-400"
                    >
                        {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                <div className="w-full relative">
                     <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input 
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        className='w-full px-3 py-2 border border-brand-blue-600' 
                        placeholder='Confirm Password' 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-blue-400"
                    >
                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                <button className='bg-black text-white font-light px-8 py-2 mt-4'>Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
