import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import CheckoutSteps from '@/components/CheckoutSteps';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCart();
  const [method, setMethod] = useState(paymentMethod || 'Stripe');
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
  }, [shippingAddress, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(method);
    navigate('/placeorder');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <CheckoutSteps current={2} />
      <h1 className="text-2xl font-bold mb-8">{t('payment.title')}</h1>

      <form onSubmit={submit} className="space-y-3">
        <label className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors ${method === 'Stripe' ? 'border-brand-500 bg-brand-50' : 'border-ink/15'}`}>
          <input
            type="radio"
            name="paymentMethod"
            checked={method === 'Stripe'}
            onChange={() => setMethod('Stripe')}
            className="accent-brand-500"
          />
          <div>
            <p className="font-medium text-sm">{t('payment.cardTitle')}</p>
            <p className="text-xs text-ink/50">{t('payment.cardDesc')}</p>
          </div>
        </label>

        <label className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors ${method === 'CashOnDelivery' ? 'border-brand-500 bg-brand-50' : 'border-ink/15'}`}>
          <input
            type="radio"
            name="paymentMethod"
            checked={method === 'CashOnDelivery'}
            onChange={() => setMethod('CashOnDelivery')}
            className="accent-brand-500"
          />
          <div>
            <p className="font-medium text-sm">{t('payment.codTitle')}</p>
            <p className="text-xs text-ink/50">{t('payment.codDesc')}</p>
          </div>
        </label>

        <button className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors mt-4">
          {t('payment.continue')}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
