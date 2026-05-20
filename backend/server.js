const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🔄 Starting server...');

// Load dotenv
try {
  require('dotenv').config();
  console.log('✅ dotenv loaded');
} catch(e) {
  console.log('⚠️ dotenv error:', e.message);
}

// Log env vars (masked)
console.log('ENV CHECK:');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0, 30) + '...)' : 'NOT SET ❌');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET ❌');
console.log('  PORT:', process.env.PORT || '5000');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL: MONGODB_URI environment variable is not set!');
  console.error('Go to Render → Environment and add MONGODB_URI');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => res.json({ status: 'Ramana Portfolio API running ✅' }));

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully!');
    try {
      await require('./utils/seed')(mongoose);
      console.log('✅ Seed completed');
    } catch(seedErr) {
      console.error('⚠️ Seed error (non-fatal):', seedErr.message);
    }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('🚀 Server running on port ' + PORT);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED!');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });
