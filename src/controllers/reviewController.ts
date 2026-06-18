import { Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
export const addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, rating, comment } = req.body;

  const review = await Review.create({
    user: req.user?.id,
    product: productId,
    rating,
    comment
  });

  // Update product ratings
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    'ratings.average': Math.round(avgRating * 10) / 10,
    'ratings.count': reviews.length
  });

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

export default { addReview, getProductReviews };
