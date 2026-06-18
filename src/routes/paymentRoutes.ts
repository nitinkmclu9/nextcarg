import { Router } from 'express';
import { createStripeSession, stripeWebhook, createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/stripe', protect, createStripeSession);
router.post('/stripe/webhook', stripeWebhook);
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

export default router;
