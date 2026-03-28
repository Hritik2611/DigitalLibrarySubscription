const express = require('express');
const {createPaymentOrder, verifyPayment} = require('../controllers/paymentController');
const {protect} = require('../middlewares/authMiddleware');
const { route } = require('./userRoutes');

const router = express.Router();

router.post('/orders', protect, createPaymentOrder);
// router.route('/orders', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;