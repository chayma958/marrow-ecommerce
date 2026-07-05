import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/api/orders';
import CheckoutSteps from '@/components/CheckoutSteps';
import Message from '@/components/Message';

const PlaceOrderPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    coupon,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
    else if (!paymentMethod) navigate('/payment');
    else if (cartItems.length === 0) navigate('/cart');
  }, []);

  const placeOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const order = await createOrder({
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: shippingAddress!,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode: coupon?.code,
      });
      if (paymentMethod === 'CashOnDelivery') {
        clearCart();
      }
      navigate(`/orders/${order._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('placeOrder.errorPlaceOrder'));
    } finally {
      setLoading(false);
    }
  };

  if (!shippingAddress) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <CheckoutSteps current={3} />
      <h1 className="text-2xl font-bold mb-8">{t('placeOrder.title')}</h1>

      {error && <div className="mb-6"><Message variant="error">{error}</Message></div>}

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-2">{t('placeOrder.shipping')}</h2>
            <p className="text-sm text-ink/60">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p className="text-sm text-ink/60">{shippingAddress.phone}</p>
            <Link to="/shipping" className="text-xs text-brand-600 font-medium mt-2 inline-block">{t('placeOrder.edit')}</Link>
          </div>

          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-2">{t('placeOrder.paymentMethod')}</h2>
            <p className="text-sm text-ink/60">{paymentMethod === 'Stripe' ? t('placeOrder.cardMethod') : t('placeOrder.codMethod')}</p>
            <Link to="/payment" className="text-xs text-brand-600 font-medium mt-2 inline-block">{t('placeOrder.edit')}</Link>
          </div>

          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-4">{t('placeOrder.items')}</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-brand-50" />
                  <Link to={`/products/${item.product}`} className="flex-1 text-sm hover:text-brand-600">{item.name}</Link>
                  <span className="text-sm text-ink/50">{item.qty} × ${item.price.toFixed(2)}</span>
                  <span className="text-sm font-medium w-16 text-right">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink/8 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold mb-4">{t('orderSummary.title')}</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-ink/60"><span>{t('orderSummary.subtotal')}</span><span>${itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-ink/60"><span>{t('orderSummary.shipping')}</span><span>{shippingPrice === 0 ? t('orderSummary.free') : `$${shippingPrice.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-ink/60"><span>{t('orderSummary.tax')}</span><span>${taxPrice.toFixed(2)}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>{t('orderSummary.discount')} {coupon ? `(${coupon.code})` : ''}</span><span>-${discountAmount.toFixed(2)}</span></div>
            )}
            <div className="border-t border-ink/8 pt-2.5 flex justify-between font-semibold text-base"><span>{t('orderSummary.total')}</span><span>${totalPrice.toFixed(2)}</span></div>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading || cartItems.length === 0}
            className="mt-6 w-full bg-ink text-white py-3.5 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {loading ? t('placeOrder.placingOrder') : t('placeOrder.placeOrderButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
