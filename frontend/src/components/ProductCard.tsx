import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getEffectivePrice } from '@/utils/pricing';
import Rating from '@/components/Rating';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart, cartItems } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const inCart = cartItems.find((i) => i.product === product._id);
  const wishlisted = isWishlisted(product._id);
  const effectivePrice = getEffectivePrice(product);
  const onSale = product.onSale && effectivePrice < product.price;

  return (
    <div className="group relative bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-shadow duration-300 overflow-hidden flex flex-col">
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-brand-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.countInStock === 0 ? (
          <span className="absolute top-3 left-3 bg-ink text-white text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full">
            {t('productCard.soldOut')}
          </span>
        ) : onSale ? (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
            {t('productCard.sale')}
          </span>
        ) : product.isFeatured && (
          <span className="absolute top-3 left-3 bg-amber-400 text-ink text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
            {t('productCard.featured')}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={wishlisted ? t('productCard.removeFromWishlist', { name: product.name }) : t('productCard.addToWishlist', { name: product.name })}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        >
          <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-brand-500 text-brand-500' : 'text-ink/60'}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-ink/40 font-medium">{product.brand}</span>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display font-medium text-[15px] leading-snug line-clamp-2 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <Rating value={product.rating} numReviews={product.numReviews} />
        <div className="mt-auto pt-2 flex items-center justify-between">
          {onSale ? (
            <span className="flex items-baseline gap-1.5">
              <span className="font-display font-semibold text-lg text-red-500">${effectivePrice.toFixed(2)}</span>
              <span className="text-sm text-ink/35 line-through">${product.price.toFixed(2)}</span>
            </span>
          ) : (
            <span className="font-display font-semibold text-lg">${product.price.toFixed(2)}</span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            disabled={product.countInStock === 0}
            aria-label={t('productCard.addToCart', { name: product.name })}
            className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center hover:bg-brand-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>
        </div>
        {inCart && (
          <span className="text-[11px] text-brand-600 font-medium">{t('productCard.inCart', { count: inCart.qty })}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
