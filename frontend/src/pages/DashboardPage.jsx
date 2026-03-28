import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { MdEventSeat } from 'react-icons/md';

const DashboardPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/subscriptions/my', config);
        setSubscription(data);
      } catch (err) {
        setError('No active subscription found. Please select a plan to get started!');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchSubscription();
  }, [userInfo]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          {loading ? (
            <p>Loading your details...</p>
          ) : subscription ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Virtual ID Card</h2>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-md">
                <p className="text-sm opacity-80">Student Name</p>
                <p className="text-2xl font-bold mb-4">{userInfo.name}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm opacity-80">Plan</p>
                    <p className="font-semibold">{subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Expires On</p>
                    <p className="font-semibold">{new Date(subscription.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Seat Information */}
                {subscription.seatNumber && (
                  <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">Your Reserved Seat</p>
                        <div className="flex items-center mt-1">
                          <MdEventSeat className="text-3xl mr-2" />
                          <p className="text-3xl font-bold">Seat {subscription.seatNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-80">Gender</p>
                        <p className="text-2xl">{subscription.gender === 'male' ? '🚹' : '🚺'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-blue-500 text-center">
                  <p className="text-sm opacity-80">Days Remaining</p>
                  <p className="text-4xl font-bold">{subscription.remainingDays}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  to="/seating-plan"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
                >
                  View Seating Plan
                </Link>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  onClick={() => alert('Renew feature coming soon!')}
                >
                  Renew Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome!</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Link 
                to="/seating-plan" 
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Select Your Seat
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;