import { Response } from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any
});

const razorpay = new Razorpay({
  key_id: "test",
  key_secret: "test"
});

// @desc    Create Stripe checkout session
// @route   POST /api/payments/stripe
// @access  Private
export const createStripeSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Order #${order._id}`
          },
          unit_amount: Math.round(order.finalAmount * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    metadata: {
      orderId: order._id.toString()
    }
  });

  res.status(200).json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
});

// @desc    Stripe webhook
// @route   POST /api/payments/stripe/webhook
// @access  Public
export const stripeWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sig = req.headers['stripe-signature']!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'paid';
      order.paymentId = session.payment_intent;
      order.status = 'processing';
      await order.save();
    }
  }

  res.json({ received: true });
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const options = {
    amount: Math.round(order.finalAmount * 100),
    currency: 'INR',
    receipt: `order_${orderId}`,
    notes: {
      orderId: order._id.toString()
    }
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400);
  }

  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.status = 'processing';
    await order.save();
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully'
  });
});
