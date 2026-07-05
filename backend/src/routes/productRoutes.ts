import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductSuggestions,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/suggestions', getProductSuggestions);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id/reviews/:reviewId')
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);
router.get('/:id/recommendations', getRecommendedProducts);

export default router;
