const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/db');
const transactionRoutes = require('./src/routes/transactionRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const routeRoutes = require('./src/routes/routeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Tap Tap Send API is running ' });
});

app.use('/transactions', transactionRoutes);
app.use('/driver', driverRoutes);
app.use('/routes', routeRoutes);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});