const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error', err.message);
  });

// Ensure the uploads directory exists for storing uploaded product images
fs.mkdirSync('uploads', { recursive: true });

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Import route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);



// ---------------------------------------------------------------------------
// Server bootstrap
// ---------------------------------------------------------------------------

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Momo backend server running on port ${PORT}`);
});