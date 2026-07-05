import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getEffectivePrice } from '@/utils/pricing';
import Rating from '@/components/Rating';
import Message from '@/components/Message';

const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (productId: string) => {
    const product = wishlist.find((p) => p._id === productId);
    if (!product) return;
    addToCart(product, 1);
    removeFromWishlist(productId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold mb-8">{t('wishlist.title')}</h1>

      {wishlist.length === 0 ? (
        <Message>
          {t('wishlist.emptyPre')} <Link to="/products" className="font-medium text-brand-600">{t('wishlist.browseProducts')}</Link>
        </Message>
      ) : (
        <div className="space-y-4">
          {wishlist.map((product) => (
            <div key={product._id} className="flex items-center gap-4 bg-white border border-ink/8 rounded-2xl p-4">
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover bg-brand-50" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.slug}`} className="font-medium hover:text-brand-600 line-clamp-1">
                  {product.name}
                </Link>
                <Rating value={product.rating} numReviews={product.numReviews} />
                {product.onSale && getEffectivePrice(product) < product.price ? (
                  <p className="text-sm mt-1">
                    <span className="font-semibold text-red-500">${getEffectivePrice(product).toFixed(2)}</span>{' '}
                    <span className="text-ink/35 line-through">${product.price.toFixed(2)}</span>
                  </p>
                ) : (
                  <p className="text-sm font-semibold mt-1">${product.price.toFixed(2)}</p>
                )}
              </div>
              <button
                onClick={() => moveToCart(product._id)}
                disabled={product.countInStock === 0}
                className="hidden sm:inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-30"
              >
                <FiShoppingBag className="w-4 h-4" /> {t('wishlist.moveToCart')}
              </button>
              <button
                onClick={() => moveToCart(product._id)}
                disabled={product.countInStock === 0}
                aria-label={t('wishlist.moveToCart')}
                className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-ink text-white disabled:opacity-30"
              >
                <FiShoppingBag className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeFromWishlist(product._id)}
                aria-label={t('wishlist.removeFromWishlist')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 text-ink/40 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
