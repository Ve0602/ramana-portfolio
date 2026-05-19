const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "AI Annotation", "Job Board"
  icon: { type: String, default: '🔗' },
  description: { type: String, required: true },
  perks: [{ type: String }],
  url: { type: String, required: true },
  badge: { type: String, default: '' }, // e.g. "I Work Here", "Hot", "Recommended"
  badgeType: { type: String, enum: ['work', 'hot', 'recommended', ''], default: '' },
  category: { type: String, required: true }, // "annotation" | "jobs"
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', referralSchema);
