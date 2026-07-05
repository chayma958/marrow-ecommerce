import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';

const FaqPage: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = t('info.faq.items', { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <span className="text-xs font-semibold tracking-widest uppercase text-ink/40">{t('info.faq.eyebrow')}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-1">{t('info.faq.title')}</h1>
      <p className="text-ink/60 mt-3 leading-relaxed">
        {t('info.faq.introPre')}{' '}
        <Link to="/contact" className="text-brand-600 font-medium">{t('info.faq.contactUs')}</Link>{t('info.faq.introPost')}
      </p>

      <div className="mt-8 divide-y divide-ink/10 border-t border-b border-ink/10">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium">{item.q}</span>
                <FiChevronDown
                  className={`shrink-0 text-ink/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && <p className="text-sm text-ink/60 leading-relaxed pb-4 pr-8">{item.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqPage;
