import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { protect, admin } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.route('/').post(authLimiter, registerUser).get(protect, admin, getUsers);
router.post('/login', authLimiter, loginUser);
router.post('/auth/google', authLimiter, googleAuth);
router.post('/logout', logoutUser);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPassword);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
