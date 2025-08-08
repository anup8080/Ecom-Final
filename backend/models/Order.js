const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    selectedVariation: { type: String },
    // Price of the item at the time of ordering.  This captures the
    // product’s price even if it later changes.
    price: { type: Number },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    // Total order value including applied discounts
    total: { type: Number, required: true },
    // Shipping/billing address captured at order time
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    status: { type: String, default: 'pending' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String },
    deliveryDate: { type: Date },
    trackingId: { type: String },
    coupon: { type: String },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);