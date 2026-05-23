const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, default: null }, // null for social logins
  role:        { type: String, enum: ['admin', 'user'], default: 'user' },
  phone:       { type: String, default: '' },
  photo:       { type: String, default: '' },

  // Social login fields
  googleId:    { type: String, default: null },
  facebookId:  { type: String, default: null },
  githubId:    { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google', 'facebook', 'github'], default: 'local' },

  // Profile extras
  location:    { type: String, default: '' },
  bio:         { type: String, default: '' },

  isVerified:  { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
  lastLogin:   { type: Date }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
