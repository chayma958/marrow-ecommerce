import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiX } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import Message from '@/components/Message';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    cartItems,
    updateQty,
    removeFromCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || t('cart.invalidCoupon'));
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('cart.title')}</h1>

      {cartItems.length === 0 ? (
        <Message>
          {t('cart.emptyPre')} <Link to="/products" className="font-medium text-brand-600">{t('cart.continueShopping')}</Link>
        </Message>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="flex gap-4 bg-white border border-ink/8 rounded-2xl p-4">
                <Link to={`/products/${item.product}`} className="w-24 h-24 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${item.product}`} className="font-medium text-sm hover:text-brand-600 leading-snug">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-ink/30 hover:text-red-500 transition-colors shrink-0"
                      aria-label={t('cart.removeItem')}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-ink/15 rounded-full">
                      <button
                        onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 rounded-full"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product, Math.min(item.countInStock, item.qty + 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 rounded-full"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-display font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-ink/8 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-semibold mb-4">{t('orderSummary.title')}</h2>

            {coupon ? (
              <div className="mb-4 flex items-center justify-between bg-brand-50 text-brand-700 text-sm rounded-xl px-3.5 py-2.5">
                <span className="font-medium">{t('cart.couponApplied', { code: coupon.code })}</span>
                <button onClick={removeCoupon} aria-label={t('cart.removeCoupon')} className="hover:text-brand-900">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="mb-4">
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t('cart.couponPlaceholder')}
                    className="flex-1 min-w-0 border border-ink/15 rounded-full px-3.5 py-2 text-sm outline-none focus:border-brand-400"
                  />
                  <button
                    disabled={applyingCoupon}
                    className="shrink-0 bg-ink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
                  >
                    {t('cart.apply')}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              </form>
            )}

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>{t('orderSummary.subtotal')}</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>{t('orderSummary.shipping')}</span>
                <span>{shippingPrice === 0 ? t('orderSummary.free') : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>{t('orderSummary.tax')}</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t('orderSummary.discount')}</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-ink/8 pt-2.5 flex justify-between font-semibold text-base">
                <span>{t('orderSummary.total')}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/shipping')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-ink text-white py-3.5 rounded-full font-medium hover:bg-brand-600 transition-colors"
            >
              {t('cart.checkout')} <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
