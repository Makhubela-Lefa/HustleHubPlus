const {notFoundHandler, errorHandler} = require("./middleware/error.middleware");
const express = require('express');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Parse incoming JSON request bodies.
// Limit JSON request bodies to reduce abuse from excessively large payloads
app.use(express.json({ limit: "10kb" }));

// Simple health endpoint used to verify that the API is running.
app.use('/health', healthRoutes);

// Authentication routes for registration, login and protected user access.
app.use('/', authRoutes);

// Return a controlled response when no route matches the request.
app.use(notFoundHandler);

// Handle unexpected application errors without exposing internal details.
app.use(errorHandler);

module.exports = app;
