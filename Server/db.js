const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
        console.log('[database] connected to host:', mongoose.connection.host, 'port:', mongoose.connection.port, 'database:', mongoose.connection.name);
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