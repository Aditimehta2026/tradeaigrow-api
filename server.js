const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/firebase/firebase');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const AIRoutes = require('./routes/AIRoutes')
const depositRoutes = require('./routes/deposit.routes');
const withdrawRoutes = require('./routes/withdraw.routes');
const spotTradeRoutes = require('./routes/spotTrade.routes');
const commodityTradeRoutes = require('./routes/commodityTrade.routes');
const verificationRoutes = require('./routes/verification.routes');
const marketDataRoutes = require('./routes/marketData.routes');


const app = express();
const PORT = process.env.PORT || 8000;

// CORS Configuration - Allow requests from Angular dev server
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://tradeaigrow.com',
    'https://www.tradeaigrow.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai-trade', AIRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/spot-trade', spotTradeRoutes);
app.use('/api/commodity-trade', commodityTradeRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/market-data', marketDataRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful Shutdown
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
