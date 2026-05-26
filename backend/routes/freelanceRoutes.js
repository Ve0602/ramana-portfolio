const router = require('express').Router();
const Client = require('../models/Client');
const Freelancer = require('../models/Freelancer');
const AutoJob = require('../models/AutoJob');
const { adminOnly } = require('../middleware/auth');
const { syncRSSJobs } = require('../utils/rssScraper');

// ── CLIENT ROUTES ─────────────────────────────────────────────

// Submit client enquiry (public)
router.post('/clients', async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, updatedAt: new Date() });

    // Send notification email to admin
    try {
      const { sendEmail } = require('../utils/emailSender');
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `🎉 New Client Enquiry: ${client.projectTitle}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#d4a853;">New Client Enquiry!</h2>
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ['Name', client.name],
                ['Email', client.email],
                ['Phone', client.phone || 'Not provided'],
                ['Company', client.company || 'Individual'],
                ['Project Type', client.projectType],
                ['Project Title', client.projectTitle],
                ['Budget', client.budget || 'To discuss'],
                ['Timeline', client.timeline || 'Flexible'],
                ['Urgency', client.urgency],
              ].map(([k,v]) => `<tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:30%">${k}</td><td style="padding:8px;border:1px solid #eee">${v}</td></tr>`).join('')}
            </table>
            <h3>Description:</h3>
            <p>${client.description}</p>
            <a href="${process.env.FRONTEND_URL}/admin" style="background:#d4a853;color:#000;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">View in Admin →</a>
          </div>
        `
      });
    } catch (e) { console.log('Admin email skipped:', e.message); }

    res.status(201).json({ message: 'Enquiry submitted successfully!', id: client._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all clients (admin)
router.get('/clients', adminOnly, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single client (admin)
router.get('/clients/:id', adminOnly, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Not found' });
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update client status (admin)
router.put('/clients/:id', adminOnly, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id, { ...req.body, updatedAt: new Date() }, { new: true }
    );
    res.json(client);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete client (admin)
router.delete('/clients/:id', adminOnly, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── FREELANCER ROUTES ─────────────────────────────────────────

// Register as freelancer (public)
router.post('/freelancers', async (req, res) => {
  try {
    const existing = await Freelancer.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'This email is already registered as a freelancer.' });

    const freelancer = await Freelancer.create(req.body);

    // Notify admin
    try {
      const { sendEmail } = require('../utils/emailSender');
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `👤 New Freelancer Registration: ${freelancer.name}`,
        html: `<div style="font-family:Arial;padding:20px;"><h2 style="color:#d4a853;">New Freelancer Registered</h2><p><b>Name:</b> ${freelancer.name}</p><p><b>Email:</b> ${freelancer.email}</p><p><b>Skills:</b> ${freelancer.skills.join(', ')}</p><p><b>Experience:</b> ${freelancer.experience}</p><a href="${process.env.FRONTEND_URL}/admin" style="background:#d4a853;color:#000;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">View in Admin →</a></div>`
      });
    } catch (e) { console.log('Email skipped:', e.message); }

    res.status(201).json({ message: 'Registration successful! We will review your profile and get back to you.', id: freelancer._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all freelancers (admin)
router.get('/freelancers', adminOnly, async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.json(freelancers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update freelancer status (admin)
router.put('/freelancers/:id', adminOnly, async (req, res) => {
  try {
    const f = await Freelancer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(f);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete freelancer (admin)
router.delete('/freelancers/:id', adminOnly, async (req, res) => {
  try {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── AUTO JOBS (RSS) ROUTES ────────────────────────────────────

// Get auto-synced jobs (public)
router.get('/jobs', async (req, res) => {
  try {
    const { platform, search, limit = 30 } = req.query;
    const filter = { isActive: true };
    if (platform && platform !== 'all') filter.platform = platform;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
    const jobs = await AutoJob.find(filter)
      .sort({ postedAt: -1 })
      .limit(parseInt(limit));
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get job platforms list
router.get('/jobs/platforms', async (req, res) => {
  try {
    const platforms = await AutoJob.distinct('platform', { isActive: true });
    res.json(platforms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Manual trigger RSS sync (admin)
router.post('/jobs/sync', adminOnly, async (req, res) => {
  try {
    res.json({ message: '🔄 RSS sync started in background...' });
    syncRSSJobs().then(r => console.log('Sync complete:', r)).catch(e => console.error('Sync error:', e));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Toggle job active/inactive (admin)
router.put('/jobs/:id', adminOnly, async (req, res) => {
  try {
    const job = await AutoJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete job (admin)
router.delete('/jobs/:id', adminOnly, async (req, res) => {
  try {
    await AutoJob.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all jobs for admin
router.get('/jobs/all', adminOnly, async (req, res) => {
  try {
    const jobs = await AutoJob.find().sort({ postedAt: -1 }).limit(100);
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
