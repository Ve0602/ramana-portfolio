const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🔄 Starting Vemunoori Collections server...');
require('dotenv').config();

console.log('ENV CHECK:');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0, 35) + '...)' : 'NOT SET ❌');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET ❌');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// All routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/products', require('./routes/products'));
app.use('/api/shop', require('./routes/shop'));

app.get('/', (req, res) => res.json({ status: 'Vemunoori Collections API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
})
  .then(async () => {
    console.log('✅ MongoDB connected!');
    try {
      await require('./seed')(mongoose);
      console.log('✅ Seed done');
    } catch (e) {
      console.error('⚠️ Seed error:', e.message);
    }
  })
  .catch(err => console.error('❌ MongoDB failed:', err.message));
