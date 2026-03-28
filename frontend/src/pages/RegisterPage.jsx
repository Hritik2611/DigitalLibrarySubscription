import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  // This state determines if we show the registration form (1) or OTP form (2)
  const [step, setStep] = useState(1); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null); // We need to save the userId for the OTP step
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle the initial registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      setUserId(data.userId);
      toast.success(data.message);
      setStep(2); // On success, move to the OTP verification step
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/verify-otp', { userId, otp });
      toast.success(data.message);
      navigate('/login'); // On success, redirect the user to the login page
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === 1 ? (
        // Registration Form
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-center text-gray-600 mb-8">Get started with your dedicated study space today.</p>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" placeholder="Your Name" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" placeholder="you@example.com" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" placeholder="••••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="text-center text-gray-600 mt-8">Already have an account?{' '} <Link to="/login" className="font-bold text-blue-600 hover:underline">Sign In</Link></p>
          </form>
        </>
      ) : (
        // OTP Verification Form
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-center text-gray-600 mb-8">We've sent a 6-digit code to {email}.</p>
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">Verification Code</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" placeholder="123456" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300">
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;

