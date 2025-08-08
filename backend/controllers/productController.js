const fs = require('fs');
const Product = require('../models/Product');

/**
 * Retrieve all products with optional search filtering by name or
 * category.  Returns an array of product objects with `id` instead
 * of `_id` for frontend convenience.
 */
exports.getProducts = async (req, res) => {
  const { search } = req.query;
  try {
    let filter = {};
    if (search) {
      const regex = new RegExp(search.toString(), 'i');
      filter = { $or: [{ name: regex }, { category: regex }] };
    }
    const docs = await Product.find(filter).lean();
    const products = docs.map(doc => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest };
    });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

/**
 * Retrieve a single product by its MongoDB ID.  Returns 404 if the
 * product is not found.
 */
exports.getProductById = async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { _id, ...rest } = doc;
    return res.json({ id: _id.toString(), ...rest });
  } catch (err) {
    return res.status(404).json({ message: 'Product not found' });
  }
};

/**
 * Create a new product.  Expects multipart/form‑data with optional
 * `images`.  Variations and variants may be provided as JSON in
 * the request body.  Only users with appropriate roles should
 * call this controller (handled by route middleware).
 */
exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, brand, sku, discount, isFeatured, tags, variations, variants } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  try {
    // Process uploaded files into relative URLs
    const imagePaths = req.files?.map(f => `/uploads/${f.filename}`) || [];
    // Parse variations and variants if provided
    let parsedVariations = [];
    let parsedVariants = [];
    if (variations) {
      try {
        parsedVariations = JSON.parse(variations);
      } catch (err) {
        // ignore invalid JSON
      }
    }
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        // ignore invalid JSON
      }
    }
    // Parse tags string into array if necessary
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      sku,
      stock: stock ? parseInt(stock) : 0,
      discount: discount ? parseFloat(discount) : 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags: parsedTags,
      variations: parsedVariations,
      variants: parsedVariants,
      images: imagePaths,
    });
    await newProduct.save();
    const obj = newProduct.toObject();
    return res.status(201).json({ id: obj._id.toString(), ...obj, _id: undefined });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

/**
 * Update an existing product.  Allows updating most fields and
 * appending additional images.  Parses variations, variants and tags
 * if provided as JSON or comma‑separated strings.
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { name, description, price, category, stock, brand, sku, discount, isFeatured, tags, variations, variants } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock) product.stock = parseInt(stock);
    if (brand) product.brand = brand;
    if (sku) product.sku = sku;
    if (discount) product.discount = parseFloat(discount);
    if (typeof isFeatured !== 'undefined') {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (tags) {
      if (Array.isArray(tags)) {
        product.tags = tags;
      } else if (typeof tags === 'string') {
        product.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    if (variations) {
      try {
        product.variations = JSON.parse(variations);
      } catch (err) {
        // ignore invalid JSON
      }
    }
    if (variants) {
      try {
        product.variants = JSON.parse(variants);
      } catch (err) {
        // ignore
      }
    }
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(f => `/uploads/${f.filename}`);
      product.images.push(...imagePaths);
    }
    await product.save();
    const obj = product.toObject();
    return res.json({ id: obj._id.toString(), ...obj, _id: undefined });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

/**
 * Delete a product by its ID.  Also removes associated image files
 * from disk.  Responds with 404 if the product is not found.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach(imgPath => {
        const filePath = imgPath.replace(/^\/uploads\//, 'uploads/');
        fs.unlink(filePath, () => {});
      });
    }
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};