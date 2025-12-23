
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sewa_ecosystem';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to SEWA MongoDB Gateway');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit process in dev environments to keep nodemon running if db is temp offline
    console.log('Running in offline/mock compatible mode on backend.');
  }
};

module.exports = connectDB;
