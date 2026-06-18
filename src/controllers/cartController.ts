import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  let cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user?.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity, color, size } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check stock
  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  let cart = await Cart.findOne({ user: req.user?.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user?.id,
      items: [{ product: productId, quantity, color, size }]
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color, size });
    }
  }

  // Calculate totals
  await cart.save();
  
  // Recalculate with populated products
  cart = await Cart.findById(cart._id).populate('items.product');
  
  // Calculate total price
  let totalPrice = 0;
  let totalItems = 0;
  
  if (cart && cart.items) {
    for (const item of cart.items) {
      const productItem = item.product as any;
      totalPrice += productItem.price * item.quantity;
      totalItems += item.quantity;
    }
  }
  
  cart.totalPrice = totalPrice;
  cart.totalItems = totalItems;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user?.id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    throw new AppError('Item not found in cart', 404);
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user?.id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== req.params.itemId
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Cart.findOneAndDelete({ user: req.user?.id });

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully'
  });
});
