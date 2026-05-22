const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // kids-dresses | women-jackets | sarees | tailoring | computer | designs | teaching
  description: { type: String, default: '' },
  price: { type: String, default: '' }, // e.g. "₹499" or "₹499 - ₹999"
  originalPrice: { type: String, default: '' },
  images: [{ type: String }], // image URLs
  tags: [{ type: String }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  colors: [{ type: String }],
  sizes: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
