const mongoose = require('mongoose');

const autoJobSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  company:      { type: String, default: '' },
  platform:     { type: String, required: true }, // 'micro1','mercor','outlier','appen','linkedin'
  platformIcon: { type: String, default: '🔗' },
  description:  { type: String, default: '' },
  url:          { type: String, required: true },
  referralUrl:  { type: String, default: '' }, // your personal referral link if available
  tags:         [{ type: String }],
  location:     { type: String, default: 'Remote' },
  jobType:      { type: String, default: 'Freelance' },
  salary:       { type: String, default: '' },
  postedAt:     { type: Date, default: Date.now },
  externalId:   { type: String, default: '' }, // to prevent duplicates
  isActive:     { type: Boolean, default: true },
  source:       { type: String, enum: ['rss','manual','api'], default: 'rss' },
  createdAt:    { type: Date, default: Date.now },
});

// Prevent duplicate jobs from same platform
autoJobSchema.index({ externalId: 1, platform: 1 }, { unique: true, sparse: true });
autoJobSchema.index({ url: 1 }, { unique: true });

module.exports = mongoose.model('AutoJob', autoJobSchema);
