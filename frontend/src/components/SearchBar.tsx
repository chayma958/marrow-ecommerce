import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import { fetchProductSuggestions } from '@/api/products';
import { ProductSuggestion } from '@/types';
import { getEffectivePrice } from '@/utils/pricing';

const SearchBar: React.FC<{ className?: string; onNavigate?: () => void }> = ({ className, onNavigate }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const handle = setTimeout(() => {
      fetchProductSuggestions(query.trim())
        .then((results) => {
          setSuggestions(results);
          setOpen(results.length > 0);
        })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToProduct = (slug: string) => {
    setQuery('');
    setOpen(false);
    navigate(`/products/${slug}`);
    onNavigate?.();
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate(query.trim() ? `/products?keyword=${encodeURIComponent(query.trim())}` : '/products');
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <form onSubmit={submitSearch} className="flex items-center relative">
        <FiSearch className="absolute left-3 w-4 h-4 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          type="text"
          placeholder={t('searchBar.placeholder')}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-white border border-ink/10 focus:border-brand-400 outline-none transition-colors"
        />
      </form>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-ink/8 rounded-2xl shadow-cardHover py-2 z-50 max-h-80 overflow-y-auto">
          {suggestions.map((p) => {
            const effectivePrice = getEffectivePrice(p);
            return (
              <button
                key={p._id}
                onClick={() => goToProduct(p.slug)}
                className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-ink/5 text-left"
              >
                <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-brand-50 shrink-0" />
                <span className="flex-1 text-sm line-clamp-1">{p.name}</span>
                {p.onSale && effectivePrice < p.price ? (
                  <span className="text-xs text-right">
                    <span className="text-ink/30 line-through mr-1">${p.price.toFixed(2)}</span>
                    <span className="text-brand-600 font-medium">${effectivePrice.toFixed(2)}</span>
                  </span>
                ) : (
                  <span className="text-xs text-ink/40">${p.price.toFixed(2)}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
