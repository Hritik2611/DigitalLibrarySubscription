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

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
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
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      dispatch(setError(message));
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-8">Sign in to continue to your library account.</p>

      <form onSubmit={submitHandler} className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="email">
            Email address
          </label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com" required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••••" required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-gray-500 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
