const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema ({
    seatNumber: {
        type: Number,
        required: true,
        unique: true,
         min:1,
        max: 100,
    },

    status: {
        type: String,
        enum: ['available', 'booked', 'blocked'],
        default: 'available',
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    bookedByGender: {
        type: String,
        enum: ['male', 'female', null],
        default: null,
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
    },
    bookedAt : {
        type: Date,
        default: null,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const Seat = mongoose.model('Seat', seatSchema)
module.exports = Seat;