import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import AuthLayout from '../components/AuthLayout';
import { useParams, useNavigate, Link } from 'react-router-dom';


const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const {token} = useParams() //this hook gets the token from the URL
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.patch(`/api/users/reset-password/${token}`, {password});
            setMessage(data.message);
            toast.success(data.message);
            setTimeout(()=> {
                navigate('/login');
            },3000);
        }catch (error) {
            const errorMessage = error.response?.data?.message || 'Somthing went wrong';
            toast.error(errorMessage);
        }finally {
            setLoading(false);
        }
    };
  return (
    <AuthLayout>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>New Password</h2>
        <p className='text-center text-gray-600 mb-8'>Please enter your new Password below.</p>
         
        {message ? (
            <div className='text-center'>
                <p className='p-4 bg-green-100 text-green-800 rounded-lg'>{message}</p>
                <Link to='/login' className="mt-4 inline-block font-bold text-blue-600 hover:underline">Proceed to Login</Link>
            </div>
        ): (
            <form onSubmit={submitHandler}>
                <div className='mb-6'>
                    <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>New Password</label>
                    <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700' placeholder='.......' required/>
                </div>
                <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300 disabled:bg-blue-300'>{loading ? 'Resetting...': 'Reset PASSWORD'}</button>
            </form>
        )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
