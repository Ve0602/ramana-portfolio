const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  // Basic info
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, default: '' },
  location:     { type: String, default: '' },
  photo:        { type: String, default: '' },

  // Professional
  title:        { type: String, default: '' }, // e.g. "AI Prompt Engineer"
  bio:          { type: String, default: '' },
  skills:       [{ type: String }],
  experience:   { type: String, enum: ['fresher','1-2years','3-5years','5plus'], default: 'fresher' },
  availability: { type: String, enum: ['fulltime','parttime','weekends','flexible'], default: 'flexible' },
  hourlyRate:   { type: String, default: '' },

  // Platforms they work on
  platforms:    [{ type: String }], // e.g. ['Oneforma', 'Outlier', 'Mercor']
  linkedinUrl:  { type: String, default: '' },
  githubUrl:    { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

  // Referral interest
  interestedInReferrals: { type: Boolean, default: true },
  preferredJobTypes:     [{ type: String }],

  // Status
  status:       { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminNotes:   { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Freelancer', freelancerSchema);
