import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { fetchOrderById, payOrder, deliverOrder, createPaymentIntent } from '@/api/orders';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import StripeCheckoutForm from '@/components/StripeCheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const OrderPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [delivering, setDelivering] = useState(false);

  const load = () => {
    if (!id) return;
    fetchOrderById(id)
      .then(setOrder)
      .catch(() => setError(t('order.notFound')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (order && !order.isPaid && order.paymentMethod === 'Stripe') {
      createPaymentIntent(order.totalPrice).then((data) => setClientSecret(data.clientSecret));
    }
  }, [order]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!order) return;
    try {
      await payOrder(order._id, {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: (order.user as any)?.email || '',
      });
      clearCart();
      toast.success(t('order.toastPaymentSuccess'));
      load();
    } catch {
      toast.error(t('order.toastPaymentUpdateFailed'));
    }
  };

  const handleDeliver = async () => {
    if (!order) return;
    setDelivering(true);
    try {
      await deliverOrder(order._id);
      toast.success(t('order.toastDelivered'));
      load();
    } finally {
      setDelivering(false);
    }
  };

  if (loading) return <Loader full />;
  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Message variant="error">{error || t('order.notFound')}</Message>
      </div>
    );
  }

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('order.orderNumber', { id: order._id.slice(-8).toUpperCase() })}</h1>
        <p className="text-sm text-ink/50 mt-1">{t('order.placedOn', { date: new Date(order.createdAt).toLocaleDateString(locale) })}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-3">{t('order.shipping')}</h2>
            <p className="text-sm text-ink/60 mb-1">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p className="text-sm text-ink/60 mb-3">{order.shippingAddress.phone}</p>
            <div className="flex items-center gap-2 text-sm">
              {order.isDelivered ? <FiCheckCircle className="text-emerald-500" /> : <FiCircle className="text-ink/30" />}
              {order.isDelivered ? t('order.deliveredOn', { date: new Date(order.deliveredAt!).toLocaleDateString(locale) }) : t('order.notDelivered')}
            </div>
          </div>

          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-3">{t('order.payment')}</h2>
            <p className="text-sm text-ink/60 mb-3">
              {order.paymentMethod === 'Stripe' ? t('order.cardMethod') : t('order.codMethod')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              {order.isPaid ? <FiCheckCircle className="text-emerald-500" /> : <FiCircle className="text-ink/30" />}
              {order.isPaid ? t('order.paidOn', { date: new Date(order.paidAt!).toLocaleDateString(locale) }) : t('order.notPaid')}
            </div>
            {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && (
              <p className="text-xs text-ink/40 mt-2">{t('order.codNote')}</p>
            )}
          </div>

          <div className="bg-white border border-ink/8 rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-4">{t('order.items')}</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-brand-50" />
                  <Link to={`/products/${item.product}`} className="flex-1 text-sm hover:text-brand-600">{item.name}</Link>
                  <span className="text-sm text-ink/50">{item.qty} × ${item.price.toFixed(2)}</span>
                  <span className="text-sm font-medium w-16 text-right">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-ink/8 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">{t('orderSummary.title')}</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-ink/60"><span>{t('orderSummary.subtotal')}</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-ink/60"><span>{t('orderSummary.shipping')}</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-ink/60"><span>{t('orderSummary.tax')}</span><span>${order.taxPrice.toFixed(2)}</span></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600"><span>{t('orderSummary.discount')} {order.couponCode ? `(${order.couponCode})` : ''}</span><span>-${order.discountAmount.toFixed(2)}</span></div>
              )}
              <div className="border-t border-ink/8 pt-2.5 flex justify-between font-semibold text-base"><span>{t('orderSummary.total')}</span><span>${order.totalPrice.toFixed(2)}</span></div>
            </div>
          </div>

          {!order.isPaid && order.paymentMethod === 'Stripe' && clientSecret && (
            <div className="bg-white border border-ink/8 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">{t('order.completePayment')}</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}

          {user?.isAdmin && !order.isDelivered && (order.isPaid || order.paymentMethod === 'CashOnDelivery') && (
            <button
              onClick={handleDeliver}
              disabled={delivering}
              className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {delivering ? t('order.updating') : t('order.markDelivered')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
