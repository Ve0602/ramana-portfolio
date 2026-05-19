const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  // section: "hero" | "experience" | "skills" | "projects" | "annotation" | "contact"
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
