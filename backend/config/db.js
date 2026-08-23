const mongoose = require('mongoose')
const Seat = require('../models/seatModel')

const connectDb = async () => {
try{
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/digital-library';
    const conn = await mongoose.connect(mongoUri);

    console.log(`database is connectd: ${conn.connection.host}`);

    const seatCount = await Seat.countDocuments();
    if (seatCount === 0) {
        await Seat.insertMany(
            Array.from({ length: 100 }, (_, index) => ({ seatNumber: index + 1 }))
        );
        console.log('Initialized 100 library seats');
    }
} catch(error) {
    console.error(`error connection to mongodb: ${error.message}`);
    console.error('Set MONGO_URI in backend/.env or start a local MongoDB server at mongodb://127.0.0.1:27017/digital-library');
    process.exit(1);
}
};

module.exports = connectDb;