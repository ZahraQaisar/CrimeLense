const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'], trim: true, maxlength: 80,
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  passwordHash: { type: String, required: true, select: false },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin:    { type: Date },
  createdAt:    { type: Date, default: Date.now },
  avatar:       { type: String, default: '' },
  savedAreas:   [{ type: String }],
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Instance method: verify password
userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Remove hash from JSON output
userSchema.set('toJSON', {
  transform(_, obj) {
    delete obj.passwordHash;
    delete obj.__v;
    return obj;
  },
});

module.exports = mongoose.model('User', userSchema);
