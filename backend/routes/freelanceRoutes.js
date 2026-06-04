const router = require('express').Router();
const Client = require('../models/Client');
const Freelancer = require('../models/Freelancer');
const AutoJob = require('../models/AutoJob');
const { adminOnly } = require('../middleware/auth');

// CLIENT
router.post('/clients', async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, updatedAt: new Date() });
    res.status(201).json({ message: 'Enquiry submitted successfully!', id: client._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/clients', adminOnly, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/clients/:id', adminOnly, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Not found' });
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/clients/:id', adminOnly, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    res.json(client);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/clients/:id', adminOnly, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// FREELANCER
router.post('/freelancers', async (req, res) => {
  try {
    const existing = await Freelancer.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'This email is already registered as a freelancer.' });
    const freelancer = await Freelancer.create(req.body);
    res.status(201).json({ message: 'Registration successful! We will review your profile and get back to you.', id: freelancer._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/freelancers', adminOnly, async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.json(freelancers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/freelancers/:id', adminOnly, async (req, res) => {
  try {
    const f = await Freelancer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(f);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/freelancers/:id', adminOnly, async (req, res) => {
  try {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// AUTO JOBS
router.get('/jobs', async (req, res) => {
  try {
    const { platform, search, limit = 30 } = req.query;
    const filter = { isActive: true };
    if (platform && platform !== 'all') filter.platform = platform;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const jobs = await AutoJob.find(filter).sort({ postedAt: -1 }).limit(parseInt(limit));
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/jobs/platforms', async (req, res) => {
  try {
    const platforms = await AutoJob.distinct('platform', { isActive: true });
    res.json(platforms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/jobs/all', adminOnly, async (req, res) => {
  try {
    const jobs = await AutoJob.find().sort({ postedAt: -1 }).limit(100);
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/jobs/sync', adminOnly, async (req, res) => {
  try {
    res.json({ message: '🔄 RSS sync started in background...' });
    const { syncRSSJobs } = require('../utils/rssScraper');
    syncRSSJobs().catch(e => console.error('Sync error:', e));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/jobs/:id', adminOnly, async (req, res) => {
  try {
    const job = await AutoJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/jobs/:id', adminOnly, async (req, res) => {
  try {
    await AutoJob.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
