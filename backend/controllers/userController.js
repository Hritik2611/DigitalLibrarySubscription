const User = require('../models/userModel');
const otpGenerator = require('otp-generator');
const sendEmail = require('../utils/emailService');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// @desc    Register a new user & send OTP
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    });

    if (user) {
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your OTP for Library Registration',
          html: `<h1>Welcome to the Library!</h1><p>Your One-Time Password is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
        });

        res.status(201).json({
          message: `User registered. OTP sent to ${user.email}`,
          userId: user._id,
        });
      } catch (emailError) {
        console.error(emailError);
        return res.status(500).json({ message: 'User registered, but email could not be sent.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Verify user OTP
// @route   POST /api/users/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Corrected to use strict inequality !== for best practice
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.otp) {
        return res.status(400).json({ message: 'Please verify your email first.' });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // --- THIS IS THE CORRECTED LINE ---
  // Replaced the placeholder with your actual frontend address
  const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
  
  const message = `<h1>Password Reset Request</h1><p>You requested a password reset. Please click this link to reset your password:</p><a href="${resetURL}">Reset Password</a><p>This link will expire in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Link (Valid for 10 min)',
      html: message,
    });
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(500).json({ message: 'There was an error sending the email. Please try again later.' });
  }
};

// @desc    Reset password
// @route   PATCH /api/users/reset-password/:token
const resetPassword = async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
};

module.exports = { 
  registerUser, 
  verifyOTP, 
  loginUser, 
  forgotPassword, 
  resetPassword 
};

