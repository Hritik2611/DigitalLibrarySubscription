import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      setUserId(data.userId);
      if (data.devOtp) {
        setOtp(data.devOtp);
        toast.info(`Local dev OTP: ${data.devOtp}`);
      }
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/verify-otp', { userId, otp });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-gray-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-gray-200'}`} />
      </div>

      {step === 1 ? (
        <>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-8">Get started with your dedicated study space today.</p>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="name">Full name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="email">Email address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••••" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
            <p className="text-center text-gray-500 pt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
            </p>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Verify your email</h2>
          <p className="text-gray-500 mb-8">
            We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>.
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="otp">Verification code</label>
              <input
                type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center text-2xl tracking-[0.5em] font-semibold"
                placeholder="000000" maxLength={6} required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Verifying…' : 'Verify account'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
