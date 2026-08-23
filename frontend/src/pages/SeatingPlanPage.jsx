import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { MdEventSeat } from 'react-icons/md';

const SeatingPlanPage = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [mySeat, setMySeat] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.token) return;

    const loadSeatData = async () => {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      try {
        const { data } = await axios.get('/api/seats', config);
        setSeats(data);
      } catch {
        toast.error('Failed to load seats');
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await axios.get('/api/seats/my-seat', config);
        setMySeat(data.seatNumber);
      } catch {
        // A 404 means the user has not booked a seat yet.
      }
    };

    loadSeatData();
  }, [userInfo]);

  const handleSeatClick = (seat) => {
    if (mySeat) {
      toast.info(`You already have Seat ${mySeat} booked`);
      return;
    }
    if (seat.status !== 'available') {
      toast.warning('This seat is not available');
      return;
    }
    setSelectedSeat(seat.seatNumber);
  };

  const handleProceedToPayment = async () => {
    if (!selectedSeat) {
      toast.warning('Please select a seat first');
      return;
    }
    if (!gender) {
      toast.warning('Please select your gender');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/seats/select', { seatNumber: selectedSeat, gender }, config);

      localStorage.setItem('selectedSeat', selectedSeat);
      localStorage.setItem('selectedGender', gender);

      toast.success(`Seat ${selectedSeat} selected. Proceeding to payment...`);
      navigate('/plans');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to select seat');
    }
  };

  const getSeatStyle = (seat) => {
    if (seat.seatNumber === mySeat) {
      return 'text-brand-500 drop-shadow-[0_0_6px_rgba(112,66,240,0.5)]';
    }
    if (seat.status === 'blocked') {
      return 'text-gray-300';
    }
    if (seat.status === 'booked') {
      return seat.bookedByGender === 'male' ? 'text-sky-400' : 'text-pink-400';
    }
    if (seat.seatNumber === selectedSeat) {
      return 'text-accent-500 drop-shadow-[0_0_8px_rgba(255,159,28,0.6)]';
    }
    return 'text-emerald-500';
  };

  const getSeatCursor = (seat) => {
    if (mySeat || seat.status !== 'available') {
      return 'cursor-not-allowed opacity-90';
    }
    return 'cursor-pointer hover:scale-110';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2f0ff,_#f7f6fb_55%)]">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="skeleton h-8 w-64 mx-auto mb-8" />
          <div className="surface-card p-6 grid grid-cols-10 gap-3">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="skeleton h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2f0ff,_#f7f6fb_55%)]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-center text-gray-900 mb-1">
          Library Seating Plan
        </h1>
        <p className="text-center text-gray-500 mb-6">Tap an available seat to reserve your spot.</p>

        {/* Legend */}
        <div className="surface-card p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-gray-600">
            <div className="flex items-center gap-2"><MdEventSeat className="text-emerald-500 text-xl" /> Available</div>
            <div className="flex items-center gap-2"><MdEventSeat className="text-sky-400 text-xl" /> Booked (Male)</div>
            <div className="flex items-center gap-2"><MdEventSeat className="text-pink-400 text-xl" /> Booked (Female)</div>
            {mySeat && <div className="flex items-center gap-2"><MdEventSeat className="text-brand-500 text-xl" /> Your Seat</div>}
            <div className="flex items-center gap-2"><MdEventSeat className="text-accent-500 text-xl" /> Selected</div>
            <div className="flex items-center gap-2"><MdEventSeat className="text-gray-300 text-xl" /> Blocked</div>
          </div>
        </div>

        {/* Seating Grid */}
        <div className="surface-card p-6 max-w-6xl mx-auto overflow-x-auto">
          <div className="grid grid-cols-10 gap-2 sm:gap-3 min-w-[600px]">
            {seats.map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => handleSeatClick(seat)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150 ${getSeatCursor(seat)}`}
                title={`Seat ${seat.seatNumber} - ${seat.status === 'available' ? 'Available' : seat.status === 'blocked' ? 'Blocked' : `Booked by ${seat.bookedBy?.name || 'User'}`}`}
              >
                <MdEventSeat className={`text-3xl sm:text-4xl transition-colors ${getSeatStyle(seat)}`} />
                <span className="text-xs font-semibold mt-1 text-gray-500">{seat.seatNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selection Panel */}
        {!mySeat && (
          <div className="surface-card p-6 mt-6 max-w-2xl mx-auto animate-fade-in-up">
            <h3 className="text-xl font-display font-bold mb-4 text-gray-900">
              {selectedSeat ? `Seat ${selectedSeat} selected` : 'Select your seat'}
            </h3>

            {selectedSeat && (
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Select your gender
                </label>
                <div className="flex gap-3">
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-colors font-medium ${
                        gender === g ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio" name="gender" value={g}
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="hidden"
                      />
                      {g === 'male' ? '🚹 Male' : '🚺 Female'}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={!selectedSeat || !gender}
              className={selectedSeat && gender ? 'btn-primary w-full py-3' : 'w-full py-3 rounded-[0.9rem] bg-gray-200 text-gray-400 font-semibold cursor-not-allowed'}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {mySeat && (
          <div className="surface-card p-6 mt-6 max-w-2xl mx-auto text-center animate-fade-in-up">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
              You've already booked Seat {mySeat}
            </h3>
            <p className="text-gray-500 mb-5">
              Your seat is reserved for the duration of your subscription.
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary px-6 py-2.5">
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeatingPlanPage;
