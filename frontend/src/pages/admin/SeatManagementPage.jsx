import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminMenu from '../../components/AdminMenu';
import { MdEventSeat } from 'react-icons/md';

const SeatManagementPage = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/admin/seats', config);
      setSeats(data);
    } catch (error) {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const initializeSeats = async (force = false) => {
    const confirmMsg = force 
      ? 'This will DELETE all existing seats and create 100 new seats. All bookings will be lost! Continue?' 
      : 'This will create 100 seats. Continue?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/admin/seats/initialize', { force }, config);
      toast.success(data.message);
      fetchSeats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to initialize seats';
      const existingCount = error.response?.data?.existingSeats;
      
      if (existingCount && existingCount < 100) {
        toast.warning(
          `${existingCount} seat(s) already exist. Click "Force Reinitialize" to replace them.`,
          { autoClose: 5000 }
        );
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const toggleBlock = async (seatNumber) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.patch(`/api/admin/seats/${seatNumber}/toggle-block`, {}, config);
      toast.success(data.message);
      fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle block');
    }
  };

  const releaseSeat = async (seatNumber) => {
    if (!window.confirm(`Release Seat ${seatNumber}? The subscription will be cancelled.`)) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`/api/admin/seats/${seatNumber}/release`, {}, config);
      toast.success(data.message);
      fetchSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to release seat');
    }
  };

  const filteredSeats = seats.filter(seat => {
    if (filter === 'all') return true;
    return seat.status === filter;
  });

  const stats = {
    total: seats.length,
    available: seats.filter(s => s.status === 'available').length,
    booked: seats.filter(s => s.status === 'booked').length,
    blocked: seats.filter(s => s.status === 'blocked').length,
    maleBooked: seats.filter(s => s.bookedByGender === 'male').length,
    femaleBooked: seats.filter(s => s.bookedByGender === 'female').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <main className="flex-1 p-4 sm:p-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Seat Management
          </h1>
          <div className="flex gap-2">
            {seats.length === 0 && (
              <button
                onClick={() => initializeSeats(false)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Initialize 100 Seats
              </button>
            )}
            {seats.length > 0 && seats.length < 100 && (
              <button
                onClick={() => initializeSeats(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                🔄 Force Reinitialize ({seats.length}/100)
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Seats</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Booked</p>
            <p className="text-2xl font-bold text-blue-600">{stats.booked}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Blocked</p>
            <p className="text-2xl font-bold text-gray-600">{stats.blocked}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Male</p>
            <p className="text-2xl font-bold text-red-600">{stats.maleBooked}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Female</p>
            <p className="text-2xl font-bold text-pink-600">{stats.femaleBooked}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded ${filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Available ({stats.available})
            </button>
            <button
              onClick={() => setFilter('booked')}
              className={`px-4 py-2 rounded ${filter === 'booked' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Booked ({stats.booked})
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-4 py-2 rounded ${filter === 'blocked' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
            >
              Blocked ({stats.blocked})
            </button>
          </div>
        </div>

        {/* Seats Table */}
        {loading ? (
          <p>Loading seats...</p>
        ) : seats.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600 mb-4">No seats found. Please initialize seats first.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Seat</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Booked By</th>
                  <th className="px-4 py-2 text-left">Gender</th>
                  <th className="px-4 py-2 text-left">Expires</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSeats.map((seat) => (
                  <tr key={seat._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center">
                        <MdEventSeat 
                          className={`mr-2 text-xl ${
                            seat.status === 'blocked' ? 'text-gray-400' :
                            seat.status === 'booked' ? 
                              (seat.bookedByGender === 'male' ? 'text-red-500' : 'text-pink-500') :
                            'text-green-600'
                          }`}
                        />
                        {seat.seatNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        seat.status === 'available' ? 'bg-green-100 text-green-800' :
                        seat.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {seat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {seat.bookedBy ? (
                        <div>
                          <div className="font-semibold">{seat.bookedBy.name}</div>
                          <div className="text-xs text-gray-500">{seat.bookedBy.email}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {seat.bookedByGender ? (
                        <span>{seat.bookedByGender === 'male' ? '🚹 Male' : '🚺 Female'}</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {seat.expiresAt ? new Date(seat.expiresAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {seat.status === 'booked' && (
                          <button
                            onClick={() => releaseSeat(seat.seatNumber)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold"
                          >
                            Release
                          </button>
                        )}
                        {seat.status !== 'booked' && (
                          <button
                            onClick={() => toggleBlock(seat.seatNumber)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                          >
                            {seat.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeatManagementPage;