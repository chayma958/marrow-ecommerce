import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import { setLanguage, supportedLanguages, SupportedLanguage } from '@/i18n';

const FlagGB: React.FC = () => (
  <svg viewBox="0 0 24 16" width="16" height="11" className="shrink-0 rounded-[2px]">
    <rect width="24" height="16" fill="#00247d" />
    <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" strokeWidth="3" />
    <path d="M0,0 L24,16 M24,0 L0,16" stroke="#cf142b" strokeWidth="1.2" />
    <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="5" />
    <path d="M12,0 V16 M0,8 H24" stroke="#cf142b" strokeWidth="3" />
  </svg>
);

const FlagFR: React.FC = () => (
  <svg viewBox="0 0 24 16" width="16" height="11" className="shrink-0 rounded-[2px]">
    <rect width="8" height="16" fill="#0055A4" />
    <rect x="8" width="8" height="16" fill="#fff" />
    <rect x="16" width="8" height="16" fill="#EF4135" />
  </svg>
);

const flagIcons: Record<SupportedLanguage, React.FC> = {
  en: FlagGB,
  fr: FlagFR,
};

const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = (i18n.language in flagIcons ? i18n.language : 'en') as SupportedLanguage;
  const CurrentFlag = flagIcons[current];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const choose = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('language.label')}
        className={`flex items-center gap-1.5 rounded-full hover:bg-ink/5 transition-colors ${
          compact ? 'px-2 py-1.5 text-xs' : 'w-10 h-10 justify-center'
        }`}
      >
        {compact ? (
          <>
            <CurrentFlag />
            <span className="font-medium uppercase">{current}</span>
          </>
        ) : (
          <FiGlobe className="w-5 h-5" />
        )}
        <FiChevronDown className="w-3 h-3 text-ink/40" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-20 bg-white rounded-xl shadow-cardHover border border-ink/5 py-1.5 text-sm z-50">
          {supportedLanguages.map((lang) => {
            const Flag = flagIcons[lang];
            return (
              <button
                key={lang}
                onClick={() => choose(lang)}
                className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-ink/5 text-left ${
                  current === lang ? 'text-brand-600 font-medium' : ''
                }`}
              >
                <Flag />
                <span className="uppercase">{lang}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
