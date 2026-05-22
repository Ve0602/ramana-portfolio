const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '🔗' },
  image: { type: String, default: '' },
  color: { type: String, default: '#00d4ff' },
  link: { type: String, required: true }, // internal route or external URL
  isExternal: { type: Boolean, default: false },
  badge: { type: String, default: '' }, // e.g. "New", "Hot"
  category: { type: String, default: 'service' }, // service | shop | portfolio | social
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
