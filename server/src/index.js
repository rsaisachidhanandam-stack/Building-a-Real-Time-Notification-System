const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const songRoutes = require('./routes/songRoutes');
const postRoutes = require('./routes/posts');
const apiLimiter = require('./middlewares/rateLimit');

// Config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.use(express.json());

// Socket.io Middleware for JWT Auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'beathub_secret_key', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.data.user = decoded;
    next();
  });

});

io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.data.user.email}`);
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected');
  });
});

// Application-wide Rate Limiting
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/posts', postRoutes(io));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beathub';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    // process.exit(1); 
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 BeatHub Server running on port ${PORT}`);
});

module.exports = app;

