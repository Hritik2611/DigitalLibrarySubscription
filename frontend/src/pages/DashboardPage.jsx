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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2f0ff,_#f7f6fb_55%)]">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-6">My Dashboard</h1>
        <div className="surface-card p-8 max-w-2xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-40 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-12" />
                <div className="skeleton h-12" />
              </div>
            </div>
          ) : subscription ? (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-display font-bold text-gray-800 mb-4">Virtual ID Card</h2>
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 text-white p-6 rounded-2xl shadow-lg shadow-brand-500/30">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <p className="text-sm opacity-80">Student Name</p>
                  <p className="text-2xl font-display font-bold mb-4">{userInfo.name}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm opacity-80">Plan</p>
                      <p className="font-semibold capitalize">{subscription.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Expires On</p>
                      <p className="font-semibold">{new Date(subscription.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {subscription.seatNumber && (
                    <div className="bg-white/15 rounded-xl p-4 mb-4 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-80">Your Reserved Seat</p>
                          <div className="flex items-center mt-1">
                            <MdEventSeat className="text-3xl mr-2" />
                            <p className="text-3xl font-display font-bold">Seat {subscription.seatNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm opacity-80">Gender</p>
                          <p className="text-2xl">{subscription.gender === 'male' ? '🚹' : '🚺'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/20 text-center">
                    <p className="text-sm opacity-80">Days Remaining</p>
                    <p className="text-4xl font-display font-bold">{subscription.remainingDays}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  to="/seating-plan"
                  className="btn-secondary text-center py-3"
                >
                  View Seating Plan
                </Link>
                <button
                  className="btn-primary py-3"
                  onClick={() => alert('Renew feature coming soon!')}
                >
                  Renew Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl">
                📖
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">Welcome!</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Link to="/seating-plan" className="btn-primary inline-block px-6 py-3">
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
