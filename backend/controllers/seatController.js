const Seat = require('../models/seatModel');
const Subscription = require('../models/subscriptionModel');

const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find({}).populate('bookedBy', 'name email').sort({ seatNumber: 1 });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const selectSeat = async (req, res) => {
  try {
    const { seatNumber, gender } = req.body;
    const userId = req.user._id;

    if (!gender || !['male', 'female'].includes(gender)) {
      return res.status(400).json({ message: 'Please select your gender' });
    }

    const existingSubscription = await Subscription.findOne({
      user: userId,
      status: 'active',
      seatNumber: { $ne: null },
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: `You already have Seat ${existingSubscription.seatNumber} booked. You cannot select another seat.`,
      });
    }

    const seat = await Seat.findOne({ seatNumber });
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seat.status !== 'available') {
      return res.status(400).json({ message: 'This seat is already booked or blocked' });
    }

    res.json({
      message: 'Seat selected successfully. Please proceed to payment.',
      seatNumber,
      gender,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMySeat = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
      seatNumber: { $ne: null },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No seat booked' });
    }

    const seat = await Seat.findById(subscription.seatId);
    res.json({
      seatNumber: subscription.seatNumber,
      seat,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const releaseExpiredSeats = async (req, res) => {
  try {
    const now = new Date();

    const expiredSeats = await Seat.find({
      status: 'booked',
      expiresAt: { $lt: now },
    });

    for (const seat of expiredSeats) {
      seat.status = 'available';
      seat.bookedBy = null;
      seat.bookedByGender = null;
      seat.subscription = null;
      seat.bookedAt = null;
      seat.expiresAt = null;
      await seat.save();
    }

    res.json({ message: `${expiredSeats.length} seats released` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllSeats,
  selectSeat,
  getMySeat,
  releaseExpiredSeats,
};