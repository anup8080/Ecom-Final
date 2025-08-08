const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Retrieve the cart for the authenticated user.  If it doesn’t
 * exist, an empty cart will be created.  Populates product
 * references to provide product details in the response.
 */
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId').lean();
    if (!cart) {
      const newCart = new Cart({ userId: req.user.id, items: [] });
      await newCart.save();
      cart = newCart.toObject();
    }
    const { _id, userId, items, total, discount, coupon } = cart;
    const mappedItems = items.map(item => {
      let product = item.productId;
      if (product && typeof product === 'object' && product._id) {
        product = {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
          category: product.category,
        };
      } else if (product) {
        product = product.toString();
      }
      return {
        product,
        quantity: item.quantity,
        selectedVariation: item.selectedVariation,
        price: item.price,
      };
    });
    return res.json({ id: _id.toString(), userId: userId ? userId.toString() : null, items: mappedItems, total, discount, coupon });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

/**
 * Replace the current cart items with the provided items array and
 * recalculate the cart total.  If the cart doesn’t exist a new one
 * will be created.  Items should contain productId, quantity and
 * optionally selectedVariation; price will be looked up.
 */
exports.updateCart = async (req, res) => {
  const { items, coupon, discount } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items must be an array' });
  }
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], total: 0, discount: 0 });
    }
    let total = 0;
    const updatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;
      let price = product.price;
      if (item.selectedVariation && product.variants && product.variants.length > 0) {
        const variant = product.variants.find(v => v.name === item.selectedVariation || v.sku === item.selectedVariation);
        if (variant && variant.price) {
          price = variant.price;
        }
      }
      total += price * item.quantity;
      updatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        selectedVariation: item.selectedVariation,
        price,
      });
    }
    const appliedDiscount = discount ? parseFloat(discount) : 0;
    cart.items = updatedItems;
    cart.total = Math.max(0, total - appliedDiscount);
    cart.discount = appliedDiscount;
    cart.coupon = coupon;
    await cart.save();
    const obj = cart.toObject();
    return res.json({ id: obj._id.toString(), userId: obj.userId ? obj.userId.toString() : null, items: obj.items, total: obj.total, discount: obj.discount, coupon: obj.coupon });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};