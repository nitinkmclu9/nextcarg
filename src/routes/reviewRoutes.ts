import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, addReview);
router.get('/product/:productId', getProductReviews);

export default router;
