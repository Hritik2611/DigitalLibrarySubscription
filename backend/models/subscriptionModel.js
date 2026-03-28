const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
},
 plan: {
    type: String,
    required: true,
    enum: ['1-month', '3-month', '6-month', '12-month'],
 },
 paymentId: {
  type: String,
},
seatNumber: {
   type: Number,
   default:null,
},
seatId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Seat',
   default: null,
},
gender: {
   type: String,
   enum: ['male', 'female'],
   default: null
},
 startDate: {
    type: Date,
    required: true,
 },
 endDate: {
    type: Date,
    required: true,
 },
 status: {
 type: String,
 enum: ['active', 'expired', 'cancelled'],
 default: 'active'
 },
   },
   {
    timestamps: true,
   }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;