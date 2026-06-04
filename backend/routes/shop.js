const router = require('express').Router();
const Service = require('../models/Service');
const Review = require('../models/Review');
const { adminOnly } = require('../middleware/auth');

// SERVICES
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/services/all', adminOnly, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/services', adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/services/:id', adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/services/:id', adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// REVIEWS
router.get('/reviews', async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.productId) filter.productId = req.query.productId;
    if (req.query.general === 'true') filter.isGeneral = true;
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/reviews/all', adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, isApproved: false });
    res.status(201).json({ message: 'Review submitted! It will appear after approval.' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/reviews/:id/approve', adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/reviews/:id', adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
