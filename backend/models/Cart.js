const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    selectedVariation: { type: String },
    // Price at the time the item was added to the cart
    price: { type: Number },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    // User associated with this cart.  Optional to support guest checkout.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    items: { type: [cartItemSchema], default: [] },
    total: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);