import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoPageLayout, { InfoSection } from '@/pages/info/InfoPageLayout';

const ShippingPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <InfoPageLayout eyebrow={t('info.shippingPolicy.eyebrow')} title={t('info.shippingPolicy.title')} intro={t('info.shippingPolicy.intro')}>
      <InfoSection heading={t('info.shippingPolicy.processingHeading')}>
        <p>{t('info.shippingPolicy.processingBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.shippingPolicy.deliveryHeading')}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('info.shippingPolicy.deliveryStandard')}</li>
          <li>{t('info.shippingPolicy.deliveryExpedited')}</li>
        </ul>
        <p>{t('info.shippingPolicy.deliveryNote')}</p>
      </InfoSection>
      <InfoSection heading={t('info.shippingPolicy.costsHeading')}>
        <p>{t('info.shippingPolicy.costsBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.shippingPolicy.trackingHeading')}>
        <p>{t('info.shippingPolicy.trackingBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.shippingPolicy.internationalHeading')}>
        <p>{t('info.shippingPolicy.internationalBody')}</p>
      </InfoSection>
    </InfoPageLayout>
  );
};

export default ShippingPolicyPage;
