import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError, loginSuccess } from '../store/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, userInfo } = useSelector((state) => state.auth);

  // If a user is already logged in, redirect them away from the login page
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
      navigate('/dashboard'); // We will create this dashboard page next
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      dispatch(loginSuccess(data));
      toast.success('Login Successful!');
      // navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      dispatch(setError(message));
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
      <p className="text-center text-gray-600 mb-8">Sign in to continue.</p>
      
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
            placeholder="you@example.com" required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <Link to='/forgot-password' className='text-sm text-blue-600 hover:underline'>Forgot Password?</Link>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
            placeholder="••••••••••" required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300 disabled:bg-blue-300"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

