const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🔄 Starting server...');
require('dotenv').config();

console.log('ENV CHECK:');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0, 35) + '...)' : 'NOT SET ❌');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET ❌');
console.log('  PORT:', process.env.PORT || '5000');

const app = express();

// Fix: allow ALL origins (fixes blank referrals page)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => res.json({ status: 'Ramana Portfolio API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
})
  .then(async () => {
    console.log('✅ MongoDB connected successfully!');
    try {
      await require('./utils/seed')(mongoose);
      console.log('✅ Seed completed');
    } catch(seedErr) {
      console.error('⚠️ Seed error:', seedErr.message);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED!');
    console.error('Error message:', err.message);
  });
