const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// @desc    Create a new subscription for the logged-in user
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  const { plan } = req.body;

  // Check if plan is valid
  const validPlans = ['1-month', '3-month', '6-month', '12-month'];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ message: 'Invalid subscription plan' });
  }

  // Check if user already has an active subscription
  const existingSubscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
  if (existingSubscription) {
    return res.status(400).json({ message: 'You already have an active subscription.' });
  }

  const startDate = new Date();
  const endDate = new Date();

  switch (plan) {
    case '1-month':
      endDate.setMonth(startDate.getMonth() + 1);
      break;
    case '3-month':
      endDate.setMonth(startDate.getMonth() + 3);
      break;
    case '6-month':
      endDate.setMonth(startDate.getMonth() + 6);
      break;
    case '12-month':
      endDate.setMonth(startDate.getMonth() + 12);
      break;
  }

  const subscription = await Subscription.create({
    user: req.user._id,
    plan,
    startDate,
    endDate,
    status: 'active',
  });

  res.status(201).json(subscription);
};

// @desc    Get the logged-in user's active subscription
// @route   GET /api/subscriptions/my
// @access  Private
const getMySubscription = async (req, res) => {
  const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' })
    .populate('seatId');

  if (subscription) {
    const remainingDays = Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    res.json({
      ...subscription.toObject(),
      remainingDays: remainingDays > 0 ? remainingDays : 0,
    });
  } else {
    res.status(404).json({ message: 'No active subscription found' });
  }
};

module.exports = { createSubscription, getMySubscription };