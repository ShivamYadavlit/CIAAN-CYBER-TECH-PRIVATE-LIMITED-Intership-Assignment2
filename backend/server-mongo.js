const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDatabase } = require('./config/mongodb');
const authRoutes = require('./routes/auth-mongo');
// const userRoutes = require('./routes/users-mongo'); // You can create this later
// const postRoutes = require('./routes/posts-mongo'); // You can create this later

const app = express();
const PORT = process.env.PORT || 5001;

console.log('🔧 Port from env:', process.env.PORT);
console.log('🔧 Using PORT:', PORT);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.CORS_ORIGIN || 'http://localhost:5174',
  'http://localhost:3000', // Common React dev port
  'http://localhost:5173', // Vite default port
  'http://localhost:5174'  // Alternative port
];

// Add production frontend URL if provided
if (process.env.PRODUCTION_FRONTEND_URL) {
  allowedOrigins.push(process.env.PRODUCTION_FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes); // Uncomment when you create this
// app.use('/api/posts', postRoutes); // Uncomment when you create this

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Mini LinkedIn API is running with MongoDB',
    timestamp: new Date().toISOString(),
    database: 'MongoDB'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Initializing MongoDB...');
    
    // Connect to MongoDB
    const isConnected = await connectDatabase();
    if (!isConnected) {
      throw new Error('MongoDB connection failed');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
      console.log(`💾 Database: MongoDB Connected`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
