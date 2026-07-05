import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingBag, FiChevronRight, FiHeart, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  fetchProductById,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  fetchRecommendedProducts,
} from '@/api/products';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { getEffectivePrice } from '@/utils/pricing';
import Rating from '@/components/Rating';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import ProductCard from '@/components/ProductCard';

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const load = () => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
        const existing = cartItems.find((i) => i.product === data._id);
        setQty(existing ? existing.qty : 1);
        fetchRecommendedProducts(data._id).then(setRecommendations).catch(() => setRecommendations([]));
      })
      .catch(() => setError(t('product.notFound')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewError('');
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateProductReview(product._id, editingReviewId, { rating, comment });
        toast.success(t('product.toastReviewUpdated'));
      } else {
        await createProductReview(product._id, { rating, comment });
        toast.success(t('product.toastReviewSubmitted'));
      }
      setEditingReviewId(null);
      setRating(5);
      setComment('');
      load();
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || t('product.errorSubmitReview'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const startEditReview = (review: { _id: string; rating: number; comment: string }) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setReviewError('');
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment('');
    setReviewError('');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!product) return;
    if (!window.confirm(t('product.confirmDeleteReview'))) return;
    try {
      await deleteProductReview(product._id, reviewId);
      toast.success(t('product.toastReviewDeleted'));
      if (editingReviewId === reviewId) cancelEditReview();
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('product.errorDeleteReview'));
    }
  };

  if (loading) return <Loader full />;
  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Message variant="error">{error || t('product.notFound')}</Message>
      </div>
    );
  }

  const gallery = [product.image, ...product.images];
  const myReview = user ? product.reviews.find((r) => r.user === user._id) : undefined;
  const effectivePrice = getEffectivePrice(product);
  const onSale = product.onSale && effectivePrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-1.5 text-xs text-ink/40 mb-8">
        <Link to="/" className="hover:text-ink">{t('product.home')}</Link>
        <FiChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-ink">{t('product.shop')}</Link>
        <FiChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${product.category}`} className="hover:text-ink">{product.category}</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-brand-50">
            <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImage === i ? 'border-brand-500' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs uppercase tracking-widest text-ink/40 font-medium">{product.brand}</span>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted(product._id) ? t('product.removeFromWishlist') : t('product.addToWishlist')}
              className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5 transition-colors shrink-0"
            >
              <FiHeart className={`w-4 h-4 ${isWishlisted(product._id) ? 'fill-brand-500 text-brand-500' : 'text-ink/60'}`} />
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} numReviews={product.numReviews} size="md" />
          </div>
          {onSale ? (
            <div className="flex items-baseline gap-3 mt-5">
              <p className="text-3xl font-display font-bold text-red-500">${effectivePrice.toFixed(2)}</p>
              <p className="text-lg text-ink/35 line-through">${product.price.toFixed(2)}</p>
              <span className="bg-red-500 text-white text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">{t('product.sale')}</span>
            </div>
          ) : (
            <p className="text-3xl font-display font-bold mt-5">${product.price.toFixed(2)}</p>
          )}
          <p className="text-ink/60 leading-relaxed mt-5">{product.description}</p>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {product.countInStock > 0 ? t('product.inStock', { count: product.countInStock }) : t('product.outOfStock')}
          </div>

          {product.countInStock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-ink/15 rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ink/5 rounded-full"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ink/5 rounded-full"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-white py-3.5 rounded-full font-medium hover:bg-brand-600 transition-colors"
              >
                <FiShoppingBag /> {t('product.addToCart')}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              addToCart(product, qty);
              navigate('/cart');
            }}
            disabled={product.countInStock === 0}
            className="mt-3 w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-30"
          >
            {t('product.buyItNow')}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 max-w-3xl">
        <h2 className="text-xl font-bold mb-6">{t('product.reviewsHeading', { count: product.numReviews })}</h2>

        {product.reviews.length === 0 && <p className="text-ink/50 text-sm mb-8">{t('product.noReviews')}</p>}

        <div className="space-y-6 mb-10">
          {product.reviews.map((r) => (
            <div key={r._id} className="border-b border-ink/8 pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{r.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink/40">{new Date(r.createdAt).toLocaleDateString()}</span>
                  {user && r.user === user._id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditReview(r)}
                        aria-label={t('product.editReview')}
                        className="text-ink/40 hover:text-brand-600 transition-colors"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        aria-label={t('product.deleteReview')}
                        className="text-ink/40 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Rating value={r.rating} />
              <p className="text-sm text-ink/60 mt-2">{r.comment}</p>
            </div>
          ))}
        </div>

        {!user ? (
          <Message>
            <Link to="/login" className="font-medium text-brand-600">{t('product.signIn')}</Link> {t('product.signInToReviewPost')}
          </Message>
        ) : myReview && !editingReviewId ? null : (
          <form onSubmit={submitReview} className="bg-white border border-ink/8 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">{editingReviewId ? t('product.editYourReview') : t('product.writeReview')}</h3>
            {reviewError && <div className="mb-4"><Message variant="error">{reviewError}</Message></div>}
            <label className="block text-sm font-medium mb-1.5">{t('product.rating')}</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 outline-none focus:border-brand-400"
            >
              <option value={5}>{t('product.ratingExcellent')}</option>
              <option value={4}>{t('product.ratingVeryGood')}</option>
              <option value={3}>{t('product.ratingGood')}</option>
              <option value={2}>{t('product.ratingFair')}</option>
              <option value={1}>{t('product.ratingPoor')}</option>
            </select>
            <label className="block text-sm font-medium mb-1.5">{t('product.comment')}</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 outline-none focus:border-brand-400 resize-none"
              placeholder={t('product.commentPlaceholder')}
            />
            <div className="flex items-center gap-3">
              <button
                disabled={submittingReview}
                className="bg-ink text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
              >
                {submittingReview ? t('product.saving') : editingReviewId ? t('product.saveChanges') : t('product.submitReview')}
              </button>
              {editingReviewId && (
                <button type="button" onClick={cancelEditReview} className="text-sm font-medium text-ink/50 hover:text-ink">
                  {t('product.cancel')}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold mb-6">{t('product.youMayAlsoLike')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommendations.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
