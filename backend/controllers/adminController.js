const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');

const prices = {
  '1-month': 299,
  '3-month': 899,
  '6-month': 1799,
  '12-month': 3599, 
};

//get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password'); 
  res.json(users);
};

//delete a user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await Subscription.deleteMany({ user: user.id });
    await user.deleteOne();
    return res.json({ message: 'User deleted successfully' });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

//get all subscription with user details
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

//     Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeSubscriptions = await Subscription.countDocuments({
      status: 'active',
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlySubscriptions = await Subscription.find({
      createdAt: { $gte: startOfMonth },
      // status: 'active',
    });

    const revenueThisMonth = monthlySubscriptions.reduce((acc, sub) => {
      return acc + (prices[sub.plan] || 0);
    }, 0);

    res.json({
      totalUsers,
      activeSubscriptions,
      revenueThisMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error getting stats' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllSubscriptions,
  getAdminStats, 
};