import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminMenu from "../../components/AdminMenu";

const SubscriptionListPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get("/api/admin/subscriptions", config);
        setSubscriptions(data);
      } catch (error) {
        toast.error("Could not fetch subscriptions.");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchSubscriptions();
    }
  }, [userInfo]);
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <main className="flex-1 p-4 sm:p-8 bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">
          All Subscriptions
        </h1>
        {loading ? (
          <p>Loading subscriptions...</p>
        ) : subscriptions.length === 0 ? (
          <p>No subscription found.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm leading-normal">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      User Email
                    </th>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-2 sm:px-5 py-2 sm:py-3 border-b-2 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {subscriptions.map(sub => (
                    <tr key={sub._id || sub.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200">{sub.user?.name || 'User Deleted'}</td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200">{sub.user?.email || 'N/A'}</td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200">{sub.plan}</td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200 whitespace-nowrap">{new Date(sub.startDate).toLocaleDateString()}</td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200 whitespace-nowrap">{new Date(sub.endDate).toLocaleDateString()}</td>
                      <td className="px-2 sm:px-5 py-2 sm:py-4 border-b border-gray-200">
                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${sub.status === 'active' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{sub.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionListPage;