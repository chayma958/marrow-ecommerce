import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import { countries, getFlagEmoji, Country } from '@/utils/countries';

const DEFAULT_COUNTRY = countries.find((c) => c.code === 'TN') || countries[0];

const parsePhone = (value: string): { country: Country; localNumber: string } => {
  const match = countries
    .filter((c) => value.startsWith(c.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length)[0];
  if (match) {
    return { country: match, localNumber: value.slice(match.dialCode.length).trim() };
  }
  return { country: DEFAULT_COUNTRY, localNumber: value };
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, required }) => {
  const { t } = useTranslation();
  const initial = parsePhone(value);
  const [country, setCountry] = useState<Country>(initial.country);
  const [localNumber, setLocalNumber] = useState(initial.localNumber);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const emitChange = (nextCountry: Country, nextLocal: string) => {
    onChange(nextLocal ? `${nextCountry.dialCode} ${nextLocal}` : '');
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    setOpen(false);
    setSearch('');
    emitChange(c, localNumber);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalNumber(e.target.value);
    emitChange(country, e.target.value);
  };

  const filtered = countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={containerRef} className="relative flex gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('phoneInput.chooseCountryCode')}
        className="shrink-0 flex items-center gap-1.5 border border-ink/15 rounded-lg px-3 py-2.5 text-sm hover:bg-ink/5 transition-colors"
      >
        <span className="text-base leading-none">{getFlagEmoji(country.code)}</span>
        <span>{country.dialCode}</span>
        <FiChevronDown className="w-3.5 h-3.5 text-ink/40" />
      </button>
      <input
        type="tel"
        required={required}
        value={localNumber}
        onChange={handleLocalChange}
        placeholder={t('phoneInput.numberPlaceholder')}
        className="flex-1 min-w-0 border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
      />
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-ink/8 rounded-xl shadow-cardHover">
          <div className="p-2 border-b border-ink/8">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('phoneInput.searchCountry')}
              className="w-full text-sm border border-ink/15 rounded-lg px-3 py-1.5 outline-none focus:border-brand-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCountry(c)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-ink/5 text-left"
              >
                <span className="text-base leading-none">{getFlagEmoji(c.code)}</span>
                <span className="flex-1 line-clamp-1">{c.name}</span>
                <span className="text-ink/40">{c.dialCode}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-2 text-sm text-ink/40">{t('phoneInput.noMatches')}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
