import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Message from '@/components/Message';

interface StripeCheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || t('stripeCheckout.paymentFailed'));
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError(t('stripeCheckout.paymentNotCompleted'));
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <Message variant="error">{error}</Message>}
      <PaymentElement />
      <button
        disabled={!stripe || processing}
        className="w-full bg-ink text-white py-3.5 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
      >
        {processing ? t('stripeCheckout.processing') : t('stripeCheckout.payNow')}
      </button>
      <p className="text-xs text-ink/40 text-center">
        {t('stripeCheckout.testModeNote')}
      </p>
    </form>
  );
};

export default StripeCheckoutForm;
