
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/authRoutes');
const dataRoutes = require('./backend/routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes Module
app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes); // Prefixed with /api because dataRoutes contains /reports and /admin

// Health Check
app.get('/', (req, res) => {
  res.send('SEWA Ecosystem Backend is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
