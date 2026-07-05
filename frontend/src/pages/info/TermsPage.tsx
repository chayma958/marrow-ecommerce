import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoPageLayout, { InfoSection } from '@/pages/info/InfoPageLayout';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <InfoPageLayout eyebrow={t('info.terms.eyebrow')} title={t('info.terms.title')} intro={t('info.terms.intro')}>
      <InfoSection heading={t('info.terms.usingHeading')}>
        <p>{t('info.terms.usingBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.terms.ordersHeading')}>
        <p>{t('info.terms.ordersBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.terms.paymentHeading')}>
        <p>{t('info.terms.paymentBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.terms.shippingReturnsHeading')}>
        <p>
          {t('info.terms.shippingReturnsPre')}{' '}
          <Link to="/shipping-delivery" className="text-brand-600 font-medium">{t('info.terms.shippingDelivery')}</Link>{' '}
          {t('info.terms.and')}{' '}
          <Link to="/returns" className="text-brand-600 font-medium">{t('info.terms.returnsRefund')}</Link>
          {t('info.terms.shippingReturnsPost')}
        </p>
      </InfoSection>
      <InfoSection heading={t('info.terms.accountsHeading')}>
        <p>{t('info.terms.accountsBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.terms.liabilityHeading')}>
        <p>{t('info.terms.liabilityBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.terms.changesHeading')}>
        <p>{t('info.terms.changesBody')}</p>
      </InfoSection>
    </InfoPageLayout>
  );
};

export default TermsPage;
