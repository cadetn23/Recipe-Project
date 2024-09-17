const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Handle initial connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

// Handle errors after connection
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = { connectDB, mongoose };