import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoPageLayout, { InfoSection } from '@/pages/info/InfoPageLayout';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <InfoPageLayout eyebrow={t('info.privacyPolicy.eyebrow')} title={t('info.privacyPolicy.title')} intro={t('info.privacyPolicy.intro')}>
      <InfoSection heading={t('info.privacyPolicy.collectHeading')}>
        <p>{t('info.privacyPolicy.collectBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.privacyPolicy.useHeading')}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('info.privacyPolicy.useProcessOrders')}</li>
          <li>{t('info.privacyPolicy.useCommunicate')}</li>
          <li>{t('info.privacyPolicy.useRespond')}</li>
          <li>{t('info.privacyPolicy.useImprove')}</li>
        </ul>
      </InfoSection>
      <InfoSection heading={t('info.privacyPolicy.sharingHeading')}>
        <p>{t('info.privacyPolicy.sharingBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.privacyPolicy.cookiesHeading')}>
        <p>{t('info.privacyPolicy.cookiesBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.privacyPolicy.choicesHeading')}>
        <p>
          {t('info.privacyPolicy.choicesPre')}{' '}
          <Link to="/contact" className="text-brand-600 font-medium">{t('info.privacyPolicy.contactUs')}</Link>
          {t('info.privacyPolicy.choicesPost')}
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
};

export default PrivacyPolicyPage;
