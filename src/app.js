const express = require('express');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Simple health endpoint used to verify that the API is running.
app.use('/health', healthRoutes);

// Person B and Person C will add /register and /login here.
app.use('/', authRoutes);

// Controlled 404 response. Person D can later replace/extend this
// with the group's centralised error-handling implementation.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
