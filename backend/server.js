  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  // Load environment variables
  dotenv.config();

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://abdurrahmanbatavia:1981@candleapp.abjdle7.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Define Schemas
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String }
  });

  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });

  const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    taxAmount: { type: Number },
    taxPercentage: { type: Number },
    status: { 
      type: String, 
      required: true, 
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    date: { type: Date },
    createdAt: { type: Date, default: Date.now }
  });

  const shipmentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: { 
      type: String, 
      required: true, 
      default: 'Preparing',
      enum: ['Preparing', 'In Transit', 'Ready for Pickup', 'Delivered', 'Cancelled']
    },
    trackingNumber: { type: String },
    shippingMethod: { type: String, required: true },
    estimatedDelivery: { type: Date },
    createdAt: { type: Date, default: Date.now }
  });

  const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
  });

  // Create models
  const User = mongoose.model('User', userSchema);
  const Product = mongoose.model('Product', productSchema);
  const Order = mongoose.model('Order', orderSchema);
  const Shipment = mongoose.model('Shipment', shipmentSchema);
  const Wishlist = mongoose.model('Wishlist', wishlistSchema);

  // Generate JWT token
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d'
    });
  };

  // Auth middleware
  const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };

  // Admin middleware
  const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Check if user exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check for user email
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // User routes
  app.get('/api/users/me', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Update user profile
  app.put('/api/users/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.city = req.body.city || user.city;
      user.country = req.body.country || user.country;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Update user password
  app.put('/api/users/password', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check current password
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);

      await user.save();
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Admin product routes
  app.post('/api/products', protect, admin, async (req, res) => {
    try {
      const product = new Product(req.body);
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.put('/api/products/:id', protect, admin, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.delete('/api/products/:id', protect, admin, async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Order routes
  app.post('/api/orders', protect, async (req, res) => {
    try {
      const { 
        items,
        shippingAddress,
        paymentMethod,
        totalPrice,
        taxAmount,
        taxPercentage
      } = req.body;

      // Check stock availability and update stock
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.name} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${item.name}. Available: ${product.stock}`
          });
        }
        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Generate order number
      const orderCount = await Order.countDocuments();
      const orderNumber = `${10001 + orderCount}`;

      const order = new Order({
        user: req.user._id,
        orderNumber,
        items,
        shippingAddress,
        paymentMethod,
        totalPrice,
        taxAmount,
        taxPercentage,
        date: new Date(),
        status: 'Processing'
      });

      const createdOrder = await order.save();

      // Create shipment
      const shipment = new Shipment({
        order: createdOrder._id,
        shippingMethod: 'Standard Shipping',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      await shipment.save();

      const populatedOrder = await Order.findById(createdOrder._id)
        .populate('user', 'name email');
      
      res.status(201).json(populatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Cancel order
  app.post('/api/orders/:id/cancel', protect, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if order can be cancelled
      if (order.status === 'Delivered' || order.status === 'Shipped') {
        return res.status(400).json({ 
          message: 'Cannot cancel order that is already shipped or delivered' 
        });
      }

      if (order.status === 'Cancelled') {
        return res.status(400).json({ message: 'Order is already cancelled' });
      }

      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      // Update order status
      order.status = 'Cancelled';
      await order.save();

      // Update shipment status
      const shipment = await Shipment.findOne({ order: order._id });
      if (shipment) {
        shipment.status = 'Cancelled';
        await shipment.save();
      }

      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Get shipment tracking
  app.get('/api/orders/:id/tracking', protect, async (req, res) => {
    try {
      const shipment = await Shipment.findOne({ order: req.params.id });
      
      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      res.json(shipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Add to wishlist
  app.post('/api/wishlist', protect, async (req, res) => {
    try {
      const { productId } = req.body;
      
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Find or create wishlist
      let wishlist = await Wishlist.findOne({ user: req.user._id });
      if (!wishlist) {
        wishlist = new Wishlist({
          user: req.user._id,
          items: []
        });
      }

      // Check if product is already in wishlist
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
        await wishlist.save();
      }

      res.json(wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Get wishlist
  app.get('/api/wishlist', protect, async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate('items');
      
      res.json(wishlist?.items || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Remove from wishlist
  app.delete('/api/wishlist/:productId', protect, async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id });
      
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }

      wishlist.items = wishlist.items.filter(
        item => item.toString() !== req.params.productId
      );
      await wishlist.save();

      res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.get('/api/orders', protect, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      
      // Transform the data to match the expected format
      const transformedOrders = orders.map(order => ({
        ...order.toObject(),
        date: order.date || order.createdAt, // Use date if available, fallback to createdAt
        customer: {
          _id: order.user._id,
          name: order.user.name,
          email: order.user.email
        }
      }));
      
      res.json(transformedOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.get('/api/orders/:id', protect, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
      
      if (order && (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin)) {
        // Transform the data to match the expected format
        const transformedOrder = {
          ...order.toObject(),
          date: order.date || order.createdAt,
          customer: {
            _id: order.user._id,
            name: order.user.name,
            email: order.user.email
          }
        };
        res.json(transformedOrder);
      } else if (!order) {
        res.status(404).json({ message: 'Order not found' });
      } else {
        res.status(401).json({ message: 'Not authorized to access this order' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Admin order routes
  app.get('/api/admin/orders', protect, admin, async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      
      // Transform the data to match the expected format
      const transformedOrders = orders.map(order => ({
        ...order.toObject(),
        date: order.date || order.createdAt,
        customer: {
          _id: order.user._id,
          name: order.user.name,
          email: order.user.email
        }
      }));
      
      res.json(transformedOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.put('/api/admin/orders/:id', protect, admin, async (req, res) => {
    try {
      const { status } = req.body;
      
      const order = await Order.findById(req.params.id);
      
      if (order) {
        order.status = status || order.status;
        
        const updatedOrder = await order.save();
        
        // Update shipment status based on order status
        if (status) {
          const shipment = await Shipment.findOne({ order: order._id });
          
          if (shipment) {
            if (status === 'Processing') {
              shipment.status = 'Preparing';
            } else if (status === 'Shipped') {
              shipment.status = 'In Transit';
            } else if (status === 'Delivered') {
              shipment.status = 'Delivered';
            }
            
            await shipment.save();
          }
        }
        
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Shipment routes
  app.get('/api/admin/shipments', protect, admin, async (req, res) => {
    try {
      const shipments = await Shipment.find({}).populate({
        path: 'order',
        populate: {
          path: 'user',
          select: 'name email'
        }
      }).sort({ createdAt: -1 });
      
      res.json(shipments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.put('/api/admin/shipments/:id', protect, admin, async (req, res) => {
    try {
      const { status, trackingNumber, shippingMethod, estimatedDelivery } = req.body;
      
      const shipment = await Shipment.findById(req.params.id);
      
      if (shipment) {
        shipment.status = status || shipment.status;
        shipment.trackingNumber = trackingNumber || shipment.trackingNumber;
        shipment.shippingMethod = shippingMethod || shipment.shippingMethod;
        shipment.estimatedDelivery = estimatedDelivery || shipment.estimatedDelivery;
        
        const updatedShipment = await shipment.save();
        
        // Update order status based on shipment status
        if (status) {
          const order = await Order.findById(shipment.order);
          
          if (order) {
            if (status === 'Preparing') {
              order.status = 'Processing';
            } else if (status === 'In Transit') {
              order.status = 'Shipped';
            } else if (status === 'Delivered') {
              order.status = 'Delivered';
            }
            
            await order.save();
          }
        }
        
        res.json(updatedShipment);
      } else {
        res.status(404).json({ message: 'Shipment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Dashboard routes
  app.get('/api/admin/dashboard', protect, admin, async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalSales = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' }
          }
        }
      ]);
      
      const totalCustomers = await User.countDocuments({ isAdmin: false });
      
      const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
      
      const recentOrders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalOrders,
        totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
        totalCustomers,
        lowStockProducts,
        recentOrders
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));