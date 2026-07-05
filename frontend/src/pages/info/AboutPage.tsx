import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoPageLayout, { InfoSection } from '@/pages/info/InfoPageLayout';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <InfoPageLayout eyebrow={t('info.about.eyebrow')} title={t('info.about.title')} intro={t('info.about.intro')}>
      <InfoSection heading={t('info.about.approachHeading')}>
        <p>{t('info.about.approachBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.about.whatWeSellHeading')}>
        <p>{t('info.about.whatWeSellBody')}</p>
      </InfoSection>
      <InfoSection heading={t('info.about.getInTouchHeading')}>
        <p>
          {t('info.about.getInTouchPre')}{' '}
          <Link to="/contact" className="text-brand-600 font-medium">{t('info.about.contactUs')}</Link>
          {t('info.about.getInTouchPost')}
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
};

export default AboutPage;
