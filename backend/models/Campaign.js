const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subject:     { type: String, required: true },
  body:        { type: String, required: true }, // HTML email body
  template:    { type: String, default: 'general' }, // general | festival | product | referral | freelance
  templateData: { type: mongoose.Schema.Types.Mixed, default: {} }, // extra data for template
  sentTo:      { type: Number, default: 0 },
  sentAt:      { type: Date, default: null },
  status:      { type: String, enum: ['draft','sent','failed'], default: 'draft' },
  autoTriggered: { type: Boolean, default: false }, // true if triggered by adding product etc
  triggerType: { type: String, default: '' }, // product | service | referral | freelance
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
