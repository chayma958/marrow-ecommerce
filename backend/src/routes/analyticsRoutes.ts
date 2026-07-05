import express from 'express';
import {
  getRevenueByMonth,
  getOrdersByMonth,
  getTopProducts,
  getNewUsersByMonth,
} from '../controllers/analyticsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/revenue', protect, admin, getRevenueByMonth);
router.get('/orders', protect, admin, getOrdersByMonth);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/new-users', protect, admin, getNewUsersByMonth);

export default router;
