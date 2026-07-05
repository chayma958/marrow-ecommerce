import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoPageLayout, { InfoSection } from '@/pages/info/InfoPageLayout';

const ReturnsPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <InfoPageLayout eyebrow={t('info.returnsPolicy.eyebrow')} title={t('info.returnsPolicy.title')} intro={t('info.returnsPolicy.intro')}>
      <InfoSection heading={t('info.returnsPolicy.windowHeading')}>
        <p>{t('info.returnsPolicy.windowBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.returnsPolicy.nonReturnableHeading')}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('info.returnsPolicy.nonReturnableGiftCards')}</li>
          <li>{t('info.returnsPolicy.nonReturnableFinalSale')}</li>
          <li>{t('info.returnsPolicy.nonReturnableNoPackaging')}</li>
        </ul>
      </InfoSection>
      <InfoSection heading={t('info.returnsPolicy.howToHeading')}>
        <p>
          {t('info.returnsPolicy.howToPre')}{' '}
          <Link to="/contact" className="text-brand-600 font-medium">{t('info.returnsPolicy.contactUs')}</Link>{' '}
          {t('info.returnsPolicy.howToPost')}
        </p>
      </InfoSection>
      <InfoSection heading={t('info.returnsPolicy.refundsHeading')}>
        <p>{t('info.returnsPolicy.refundsBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.returnsPolicy.exchangesHeading')}>
        <p>{t('info.returnsPolicy.exchangesBody')}</p>
      </InfoSection>
    </InfoPageLayout>
  );
};

export default ReturnsPolicyPage;
