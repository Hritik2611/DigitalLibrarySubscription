import React from 'react'
import { Link } from 'react-router-dom'; 
import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';
import {toast} from 'react-toastify';


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const[loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try{
            const { data } = await axios.post('/api/users/forgot-password', {email});
            setMessage(data.message);
            toast.success(data.message);
        }catch (error) {
            const errorMessage = error.response?.data?.message || 'somthing went wrong';
            toast.error(errorMessage);
        }finally {
            setLoading(false);
        }
    };
  return (
    <AuthLayout>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>Forgot Password</h2>
        <p className='text-center text-gray-600 mb-8'>Enter your email and we'll send you a link to reset your password.</p>

        {message ? (
            <div className='text-center p-4 bg-green-100 text-green-800 rounded-lg'>{message}</div>
        ): (
            <form onSubmit={submitHandler}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email </label>
                    <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
              placeholder="you@example.com"
              required
            />
                </div>
                <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300 disabled:bg-blue-300'>{loading ? 'Sending Link...': 'Send Reset Link'}</button>
            </form>
        )}
        <p className='text-center text-gray-600 mt-8'>
            Remember your Password: {' '}
            <Link to='/login' className='font-bold text-blue-600 hover:underline'>Sign In</Link>
        </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage
