import { Router } from 'express';
import {
  getAnalytics,
  getUsers,
  toggleUserBlock,
  getAllOrders,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleUserBlock);
router.get('/orders', getAllOrders);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
