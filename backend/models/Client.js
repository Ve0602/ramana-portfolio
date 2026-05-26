const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Step 1 - Who are you
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, default: '' },
  company:      { type: String, default: '' },
  country:      { type: String, default: '' },
  clientType:   { type: String, enum: ['individual','startup','company','agency'], default: 'individual' },

  // Step 2 - Project details
  projectType:  { type: String, required: true }, // AI/ML, Web Dev, Tailoring, Design, Other
  projectTitle: { type: String, required: true },
  description:  { type: String, required: true },
  goals:        { type: String, default: '' },

  // Step 3 - Budget & Timeline
  budget:       { type: String, default: '' }, // e.g. "₹10,000 - ₹25,000"
  budgetType:   { type: String, enum: ['fixed','hourly','monthly','discuss'], default: 'fixed' },
  timeline:     { type: String, default: '' }, // e.g. "2 weeks"
  urgency:      { type: String, enum: ['flexible','normal','urgent','asap'], default: 'normal' },
  startDate:    { type: String, default: '' },

  // Step 4 - Requirements
  skills:       [{ type: String }],
  attachments:  [{ type: String }], // URLs
  references:   { type: String, default: '' },
  extraNotes:   { type: String, default: '' },

  // Status
  status:       { type: String, enum: ['new','viewed','in-discussion','accepted','rejected','completed'], default: 'new' },
  adminNotes:   { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', clientSchema);
