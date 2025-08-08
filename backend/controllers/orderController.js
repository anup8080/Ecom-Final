const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Create a new order.  Calculates the order total based on current
 * product prices.  Items should be an array of objects with
 * `productId`, `quantity` and optionally `selectedVariation`.  The
 * address field should mirror the user’s address structure.
 */
exports.createOrder = async (req, res) => {
  const { items, address, paymentMethod, coupon, discount } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item' });
  }
  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }
  try {
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      let price = product.price;
      // If a variant is selected, attempt to find a matching variant to override price
      if (item.selectedVariation && product.variants && product.variants.length > 0) {
        const variant = product.variants.find(v => v.name === item.selectedVariation || v.sku === item.selectedVariation);
        if (variant && variant.price) {
          price = variant.price;
        }
      }
      total += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        selectedVariation: item.selectedVariation,
        price,
      });
    }
    // Apply discount or coupon if provided
    let appliedDiscount = 0;
    if (discount) {
      appliedDiscount = parseFloat(discount);
    }
    const totalAfterDiscount = Math.max(0, total - appliedDiscount);
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      total: totalAfterDiscount,
      address,
      paymentMethod,
      coupon,
      discount: appliedDiscount,
      status: 'pending',
      paymentStatus: 'pending',
    });
    await order.save();
    const obj = order.toObject();
    return res.status(201).json({ id: obj._id.toString(), userId: obj.userId.toString(), items: obj.items, total: obj.total, address: obj.address, status: obj.status, paymentStatus: obj.paymentStatus, createdAt: obj.createdAt, updatedAt: obj.updatedAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

/**
 * Retrieve orders for the authenticated user.  If the `all` query
 * parameter is true and the user has an admin or vendor role, all
 * orders are returned.  Otherwise only orders belonging to the user
 * are returned.
 */
exports.getOrders = async (req, res) => {
  const { all } = req.query;
  try {
    let orders;
    if ((all === true || all === 'true') && ['admin', 'vendor'].includes(req.user.role)) {
      orders = await Order.find().lean();
    } else {
      orders = await Order.find({ userId: req.user.id }).lean();
    }
    const formatted = orders.map(o => {
      const { _id, userId, ...rest } = o;
      return { id: _id.toString(), userId: userId.toString(), ...rest };
    });
    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

/**
 * Update the status of an order.  Only admins or vendors may call
 * this.  Accepts status, paymentStatus, deliveryDate or trackingId
 * in the request body.
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const { status, paymentStatus, deliveryDate, trackingId } = req.body;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryDate) order.deliveryDate = new Date(deliveryDate);
    if (trackingId) order.trackingId = trackingId;
    await order.save();
    const obj = order.toObject();
    return res.json({ id: obj._id.toString(), userId: obj.userId.toString(), items: obj.items, total: obj.total, address: obj.address, status: obj.status, paymentStatus: obj.paymentStatus, deliveryDate: obj.deliveryDate, trackingId: obj.trackingId, createdAt: obj.createdAt, updatedAt: obj.updatedAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

/**
 * Summarise sales data across all orders.  Returns total revenue,
 * total orders count and a list of best‑selling products based on
 * quantity sold.  Only admins or vendors may call this.
 */
exports.getSalesSummary = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').exec();
    let totalRevenue = 0;
    const productCounts = {};
    orders.forEach(order => {
      totalRevenue += order.total || 0;
      order.items.forEach(item => {
        const product = item.productId;
        if (product) {
          productCounts[product.name] = (productCounts[product.name] || 0) + item.quantity;
        }
      });
    });
    const totalOrders = orders.length;
    const bestSellers = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
    return res.json({ totalRevenue, totalOrders, bestSellers });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate sales summary', error: err.message });
  }
};