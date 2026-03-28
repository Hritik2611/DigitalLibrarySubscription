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
    fetchSeats();
    checkMySeat();
  }, []);

  const fetchSeats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/seats', config);
      setSeats(data);
    } catch (error) {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const checkMySeat = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/seats/my-seat', config);
      setMySeat(data.seatNumber);
    } catch (error) {
      // User doesn't have a seat yet
    }
  };

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
      
      // Store in localStorage to pass to PlansPage
      localStorage.setItem('selectedSeat', selectedSeat);
      localStorage.setItem('selectedGender', gender);
      
      toast.success(`Seat ${selectedSeat} selected. Proceeding to payment...`);
      navigate('/plans');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to select seat');
    }
  };

  const getSeatColor = (seat) => {
    if (seat.seatNumber === mySeat) {
      return 'text-blue-500'; // Your seat
    }
    if (seat.status === 'blocked') {
      return 'text-gray-400'; // Blocked
    }
    if (seat.status === 'booked') {
      return seat.bookedByGender === 'male' ? 'text-red-500' : 'text-pink-500';
    }
    if (seat.seatNumber === selectedSeat) {
      return 'text-yellow-500'; // Selected
    }
    return 'text-green-600'; // Available
  };

  const getSeatCursor = (seat) => {
    if (mySeat || seat.status !== 'available') {
      return 'cursor-not-allowed';
    }
    return 'cursor-pointer hover:scale-110';
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 text-center">
          <p>Loading seating plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Library Seating Plan
        </h1>

        {/* Legend */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-4xl mx-auto">
          <h3 className="font-semibold mb-3">Legend:</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center">
              <MdEventSeat className="text-green-600 text-2xl mr-2" />
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <MdEventSeat className="text-red-500 text-2xl mr-2" />
              <span>Booked (Male)</span>
            </div>
            <div className="flex items-center">
              <MdEventSeat className="text-pink-500 text-2xl mr-2" />
              <span>Booked (Female)</span>
            </div>
            {mySeat && (
              <div className="flex items-center">
                <MdEventSeat className="text-blue-500 text-2xl mr-2" />
                <span>Your Seat</span>
              </div>
            )}
            <div className="flex items-center">
              <MdEventSeat className="text-yellow-500 text-2xl mr-2" />
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <MdEventSeat className="text-gray-400 text-2xl mr-2" />
              <span>Blocked</span>
            </div>
          </div>
        </div>

        {/* Seating Grid - 10x10 = 100 seats */}
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
          <div className="grid grid-cols-10 gap-2 sm:gap-3">
            {seats.map((seat) => (
              <div
                key={seat.seatNumber}
                onClick={() => handleSeatClick(seat)}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${getSeatCursor(seat)}`}
                title={`Seat ${seat.seatNumber} - ${seat.status === 'available' ? 'Available' : seat.status === 'blocked' ? 'Blocked' : `Booked by ${seat.bookedBy?.name || 'User'}`}`}
              >
                <MdEventSeat 
                  className={`text-3xl sm:text-4xl ${getSeatColor(seat)}`}
                />
                <span className="text-xs font-semibold mt-1">{seat.seatNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Panel */}
        {!mySeat && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              {selectedSeat ? `Seat ${selectedSeat} Selected` : 'Select Your Seat'}
            </h3>

            {selectedSeat && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Your Gender *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={!selectedSeat || !gender}
              className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 ${
                selectedSeat && gender
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Already Booked Message */}
        {mySeat && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              You have already booked Seat {mySeat}
            </h3>
            <p className="text-gray-600 mb-4">
              Your seat is reserved for the duration of your subscription.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeatingPlanPage;