import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';


const Header = () => {
   const {userInfo} = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out.');
    navigate('/login')
   }


 return (
   <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Digital Library
        </Link>

        <div>
          {userInfo ? (
            // Links for logged-in users
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userInfo.name}!</span>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            // Links for guests
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
        )
}

export default Header
