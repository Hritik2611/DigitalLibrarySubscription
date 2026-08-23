import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: '📋' },
  { to: '/admin/seats', label: 'Seat Management', icon: '🪑' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/data', label: 'Data Controller', icon: '🗂️' },
];

const AdminMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="font-display font-extrabold text-lg gradient-text mb-1">Admin Panel</div>
        {userInfo && (
          <div className="text-xs text-gray-500 mt-2">
            <div className="text-gray-700 font-medium">{userInfo.email}</div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <button
        className="m-4 mt-auto btn-secondary py-2.5 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminMenu;
