const express = require('express');
const {registerUser, verifyOTP, loginUser, forgotPassword, resetPassword} = require('../controllers/userController');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

module.exports = router;