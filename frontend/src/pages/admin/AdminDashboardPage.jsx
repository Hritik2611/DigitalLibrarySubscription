import React, {useState, useEffect}from 'react';
import AdminMenu from '../../components/AdminMenu'; 
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const AdminDashboardPage = () => {
   const [stats, setStats] = useState(null);
   const [loading, setLoading] = useState(true);
   
   const { userInfo } = useSelector((stats) => stats.auth);

   useEffect(() => {
    const fetchStats = async () => {
        try {
            const config = {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            };

            const { data } = await axios.get('/api/admin/stats', config);
            setStats(data);
        } catch (error) {
            toast.error('Could not fetch dashboard stats.')
        } finally {
            setLoading(false);
        }
    };

    fetchStats();
   }, [userInfo.token]);

    return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* 4. Show loading message or the stats grid */}
        {loading ? (
          <p>Loading statistics...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 - Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Users
              </h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            {/* Stat Card 2 - Active Subscriptions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">
                Active Subscriptions
              </h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {stats.activeSubscriptions}
              </p>
            </div>
            {/* Stat Card 3 - Revenue This Month */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-600">
                Revenue This Month
              </h3>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {/* Format the number as Indian Rupees */}
                ₹{stats.revenueThisMonth.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ) : (
          <p>Could not load statistics.</p> // Error fallback
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;

