const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// Use the improved database connection system
const { connectDB, disconnectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-netlify-app-name.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Connect to MongoDB
let dbConnection;
(async () => {
  try {
    dbConnection = await connectDB();
    console.log('Database connection established');
    startServer();
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
})();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await disconnectDB();
  process.exit(0);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Link Analysis API' });
});

// Redirect route for shortened URLs
app.get('/:code', require('./controllers/redirectController'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // React app will handle these routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server function
function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}