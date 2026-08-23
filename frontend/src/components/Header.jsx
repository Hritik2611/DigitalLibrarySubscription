import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-display font-extrabold gradient-text">
          📚 Digital Library
        </Link>

        <div>
          {userInfo ? (
            <div className="flex items-center gap-5">
              <span className="text-gray-500 hidden sm:inline">
                Welcome, <span className="font-semibold text-gray-800">{userInfo.name}</span>
              </span>
              <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Login</Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm inline-block">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
