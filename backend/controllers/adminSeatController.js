
const Seat = require('../models/seatModel');
const Subscription = require('../models/subscriptionModel');

const getAllSeatsAdmin = async (req, res) => {
    try {
        const seats = await Seat.find({})
        .populate('bookedBy', 'name email')
        .populate('subscription', 'plan startDate endDate status')
        .sort({ seatNumber : 1 })
        res.json(seats);
    }catch (error)
    {
        res.status(500).json({message: 'Server Error'});
    }
};

const toggleSeatBlock = async (req, res) => {
    try {
        const {seatNumber} = req.params;
        const seat = await Seat.findOne({ seatNumber});

        if(!seat) {
            return res.status(404).json({message: 'Seat not found'});
        }
        if (seat.status === 'booked') {
            return res.status(400).json({message: 'Cannot block a booked seat. Please release it first.'});
        }
        seat.status = seat.status === 'blocked' ? 'available' : 'blocked';
        await seat.save();

        res.json({
            message: `Seat ${seatNumber} ${seat.status === 'blocked' ? 'blocked': 'unblocked'} successfully`,
            seat,
        });
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
};

const releaseSeat = async (req, res) => {
    try {
        const {seatNumber} = req.params;
        const seat = await Seat.findOne({ seatNumber });

        if(!seat) {
            return res.status(404).json({ message: 'Seat not found '});
        } 
        if (seat.status !== 'booked') {
      return res.status(400).json({ message: 'Seat is not booked' });
    }
    if (seat.subscription) {
      await Subscription.findByIdAndUpdate(seat.subscription, { status: 'cancelled' });
    }
    //release seat
    seat.status = 'available';
    seat.bookedBy = null;
    seat.bookedByGender = null;
    seat.subscription = null;
    seat.bookedAt = null;
    seat.expiresAt = null;
    await seat.save();

    res.json({message: `Seat ${seatNumber} released successfully`, seat});
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
};

const assignSeat = async (req, res) => {
    try {
        const {seatNumber, userId, gender, subscriptionId} = req.body;

        const seat = await Seat.findOne({seatNumber});

        if(!seat){
            return res.status(404).json({message: 'Seat not found '});
        }
        if (seat.status !== 'available') {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    seat.status = 'booked';
    seat.bookedBy = userId;
    seat.bookedByGender= gender;
    seat.subscription = subscriptionId;
    seat.bookedAt = new Date();
    seat.expiresAt = subscription.endDate;
    await seat.save();

    subscription.seatNumber = seatNumber;
    subscription.seatId = seat._id;
    subscription.gender = gender;
    await subscription.save();
    
    res.json({ message: 'Seat assigned successfully', seat });
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
};

const initializeSeats = async (req, res) => {
  try {
    const existingSeats = await Seat.countDocuments();
    
    // Check if we already have 100 seats
    if (existingSeats === 100) {
      return res.status(400).json({ message: 'All 100 seats already initialized' });
    }

    // If partial seats exist, offer options
    if (existingSeats > 0 && existingSeats < 100) {
      const { force } = req.body;
      
      if (!force) {
        return res.status(400).json({ 
          message: `${existingSeats} seat(s) already exist. Send {"force": true} to delete and recreate all 100 seats.`,
          existingSeats,
          action: 'Please delete existing seats first or use force mode'
        });
      }
      
      // Force mode: Delete all existing seats
      await Seat.deleteMany({});
    }

    const seats = [];
    for (let i = 1; i <= 100; i++) {
      seats.push({ seatNumber: i });
    }

    await Seat.insertMany(seats);
    res.json({ message: '100 seats initialized successfully', totalSeats:100, action: existingSeats > 0 ? 'Replaced existing seats' : 'Created new seats' });
  } catch (error) {
    console.error('Initialize seats error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAllSeatsAdmin,
  toggleSeatBlock,
  releaseSeat,
  assignSeat,
  initializeSeats,
};

