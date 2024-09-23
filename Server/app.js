const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`[server] listening on ${HOST}:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database:', err);
});
