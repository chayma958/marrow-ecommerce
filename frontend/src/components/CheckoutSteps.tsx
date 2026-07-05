import React from 'react';
import { useTranslation } from 'react-i18next';

const CheckoutSteps: React.FC<{ current: number }> = ({ current }) => {
  const { t } = useTranslation();
  const steps = [t('checkoutSteps.cart'), t('checkoutSteps.shipping'), t('checkoutSteps.payment'), t('checkoutSteps.placeOrder')];

  return (
    <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <span
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full ${
              i <= current ? 'bg-ink text-white' : 'bg-ink/5 text-ink/40'
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && <span className="w-4 h-px bg-ink/15" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
