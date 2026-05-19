const router = require('express').Router();
const Click = require('../models/Click');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { adminOnly } = require('../middleware/auth');

// GET dashboard analytics (admin only)
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const totalClicks = await Click.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalReferrals = await Referral.countDocuments({ isActive: true });

    // Top clicked referrals
    const topReferrals = await Referral.find().sort({ clicks: -1 }).limit(5).select('platform clicks icon');

    // Recent clicks (last 20)
    const recentClicks = await Click.find()
      .sort({ clickedAt: -1 })
      .limit(20)
      .populate('referralId', 'platform icon');

    // Clicks per day last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const clicksByDay = await Click.aggregate([
      { $match: { clickedAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Recent users
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt lastLogin');

    res.json({ totalClicks, totalUsers, totalReferrals, topReferrals, recentClicks, clicksByDay, recentUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
