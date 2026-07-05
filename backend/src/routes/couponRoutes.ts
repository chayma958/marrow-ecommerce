import express from 'express';
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, admin, createCoupon).get(protect, admin, getCoupons);
router.post('/validate', protect, validateCoupon);
router.route('/:id').delete(protect, admin, deleteCoupon);

export default router;
