// src/routes/subscriptionRoutes.js
const express = require('express');
const { createSubscription, getMySubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Any requests to these routes must first pass through the 'protect' middleware
router.route('/').post(protect, createSubscription);
router.route('/my').get(protect, getMySubscription);

module.exports = router;