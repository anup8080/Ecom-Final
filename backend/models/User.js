const mongoose = require('mongoose');

// Define the user schema.  A user can have different roles such as
// customer, admin or vendor.  Additional fields like address,
// avatar and social auth providers are included to support a
// production‑ready e‑commerce platform.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    // Role determines the user’s permissions within the system
    role: {
      type: String,
      enum: ['admin', 'customer', 'vendor'],
      default: 'customer',
    },
    // Nested address object for shipping/billing
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    avatar: { type: String },
    verified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    provider: { type: String },
    providerId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);