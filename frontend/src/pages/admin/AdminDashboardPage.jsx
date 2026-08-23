import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/AdminMenu';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const StatCard = ({ label, value, icon, accent }) => (
  <div className="surface-card p-6 animate-fade-in-up">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${accent}`}>{icon}</span>
    </div>
    <p className="text-3xl font-display font-extrabold text-gray-900">{value}</p>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/admin/stats', config);
        setStats(data);
      } catch (error) {
        toast.error('Could not fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userInfo.token]);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#f2f0ff,_#f7f6fb_55%)]">
      <AdminMenu />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32" />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value={stats.totalUsers} icon="👥" accent="bg-brand-50 text-brand-600" />
            <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} icon="✅" accent="bg-emerald-50 text-emerald-600" />
            <StatCard
              label="Revenue This Month"
              value={`₹${stats.revenueThisMonth.toLocaleString('en-IN')}`}
              icon="💰"
              accent="bg-amber-50 text-amber-600"
            />
          </div>
        ) : (
          <p className="text-gray-500">Could not load statistics.</p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
