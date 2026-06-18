import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { products, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!products || products.length === 0) {
    throw new AppError('No order items', 400);
  }

  // Calculate totals
  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError(`Product not found: ${item.product}`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const price = product.price;
    totalAmount += price * item.quantity;

    orderProducts.push({
      product: item.product,
      quantity: item.quantity,
      price,
      color: item.color,
      size: item.size
    });

    // Update stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingCost = totalAmount > 500 ? 0 : 50;
  const tax = Math.round(totalAmount * 0.18);
  const finalAmount = totalAmount + shippingCost + tax;

  const order = await Order.create({
    user: req.user?.id,
    products: orderProducts,
    totalAmount,
    shippingCost,
    tax,
    finalAmount,
    paymentMethod,
    shippingAddress
  });

  // Clear cart after order creation
  await Cart.findOneAndDelete({ user: req.user?.id });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user?.id })
    .populate('products.product', 'name images price')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('products.product', 'name images price');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order belongs to user
  if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.status = status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});
