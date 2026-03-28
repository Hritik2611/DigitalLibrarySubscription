const express = require('express');
const mongoose = require('mongoose')

const connectDb = async () => {
try{
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`database is connectd: ${conn.connection.host}`);
} catch(error) {
    console.error(`error connection to mongodb: ${error.message}`);
    process.exit(1);
}
};

module.exports = connectDb;