import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      <p className="font-display text-6xl font-bold text-brand-500">404</p>
      <h1 className="text-xl font-bold mt-4">{t('notFound.title')}</h1>
      <p className="text-ink/50 mt-2">{t('notFound.message')}</p>
      <Link to="/" className="inline-block mt-6 bg-ink text-white px-6 py-3 rounded-full font-medium hover:bg-brand-600 transition-colors">
        {t('notFound.backToHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
