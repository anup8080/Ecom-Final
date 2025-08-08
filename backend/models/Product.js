const mongoose = require('mongoose');

// Product schema defines each item sold on the platform.  Beyond basic
// fields like name, description and price, it includes metadata such as
// brand, SKU, ratings and reviews, discounting, tags and variants.
const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String },
    sku: { type: String },
    price: { type: Number },
    stock: { type: Number, default: 0 },
    attributes: { type: Object },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    brand: { type: String },
    sku: { type: String, unique: true, sparse: true },
    stock: { type: Number, default: 0 },
    // Variations represented as simple strings for basic options
    variations: { type: [String], default: [] },
    // Each variant may override the base price/stock
    variants: { type: [variantSchema], default: [] },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    discount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    digital: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);