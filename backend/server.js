const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🔄 Starting Vemunoori Collections server...');
require('dotenv').config();

console.log('ENV CHECK:');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0,35) + '...)' : 'NOT SET ❌');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌');
console.log('  ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET ❌');
console.log('  GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET (emails disabled)');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// All routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/auth/social',   require('./routes/socialAuth'));
app.use('/api/referrals',     require('./routes/referrals'));
app.use('/api/portfolio',     require('./routes/portfolio'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/brand',         require('./routes/brand'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/shop',          require('./routes/shop'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/freelance',     require('./routes/freelanceRoutes'));

app.get('/', (req, res) => res.json({ status: 'Vemunoori Collections API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Server running on port ' + PORT));
process.env.BACKEND_URL = `http://localhost:${PORT}`;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
})
  .then(async () => {
    console.log('✅ MongoDB connected!');
    try {
      await require('./utils/seed')();
      console.log('✅ Seed done');
    } catch (e) {
      console.error('⚠️ Seed error:', e.message);
    }

    // ── AUTO RSS SYNC SCHEDULER ──────────────────────────────
    // Run once on startup (after 30s delay to let server settle)
    setTimeout(async () => {
      try {
        const { syncRSSJobs } = require('./utils/rssScraper');
        await syncRSSJobs();
      } catch (e) { console.log('Initial RSS sync skipped:', e.message); }
    }, 30000);

    // Run every 6 hours automatically
    setInterval(async () => {
      try {
        const { syncRSSJobs } = require('./utils/rssScraper');
        console.log('⏰ Scheduled RSS sync starting...');
        await syncRSSJobs();
      } catch (e) { console.log('Scheduled RSS sync error:', e.message); }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('⏰ RSS auto-sync scheduled every 6 hours');
  })
  .catch(err => console.error('❌ MongoDB failed:', err.message));
