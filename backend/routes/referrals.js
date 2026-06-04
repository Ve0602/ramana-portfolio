const router = require('express').Router();
const Referral = require('../models/Referral');
const Click = require('../models/Click');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const referrals = await Referral.find({ isActive: true }).sort({ category: 1, order: 1 });
    res.json(referrals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', adminOnly, async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ category: 1, order: 1 });
    res.json(referrals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/click', auth, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    referral.clicks += 1;
    await referral.save();
    await Click.create({
      referralId: referral._id,
      platform: referral.platform,
      userId: req.user._id,
      userEmail: req.user.email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.json({ url: referral.url });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', adminOnly, async (req, res) => {
  try {
    const referral = await Referral.create(req.body);
    res.status(201).json(referral);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(referral);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Referral.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
