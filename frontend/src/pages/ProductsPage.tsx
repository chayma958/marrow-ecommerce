import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFilter, FiX } from 'react-icons/fi';
import { fetchProducts, fetchCategories } from '@/api/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import Pagination from '@/components/Pagination';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const sortOptions = [
    { value: 'newest', label: t('products.sortNewest') },
    { value: 'price_asc', label: t('products.sortPriceAsc') },
    { value: 'price_desc', label: t('products.sortPriceDesc') },
    { value: 'rating', label: t('products.sortRating') },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts({
      keyword: keyword || undefined,
      category: category !== 'all' ? category : undefined,
      sort,
      page,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((data) => {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      })
      .catch(() => setError(t('products.loadError')))
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const handleMinPriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      updateParam('minPrice', '');
      return;
    }
    let val = Math.max(0, Number(raw) || 0);
    if (maxPrice && val > Number(maxPrice)) val = Number(maxPrice);
    e.target.value = String(val);
    updateParam('minPrice', String(val));
  };

  const handleMaxPriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === '') {
      updateParam('maxPrice', '');
      return;
    }
    let val = Math.max(0, Number(raw) || 0);
    if (minPrice && val < Number(minPrice)) val = Number(minPrice);
    e.target.value = String(val);
    updateParam('maxPrice', String(val));
  };

  const hasActiveFilters = category !== 'all' || minPrice || maxPrice || keyword;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-ink/40">{t('products.eyebrow')}</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            {keyword ? t('products.resultsFor', { keyword }) : category !== 'all' ? category : t('products.allProducts')}
          </h1>
          {!loading && <p className="text-sm text-ink/50 mt-1">{t('products.productCount', { count: total })}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="md:hidden inline-flex items-center gap-2 text-sm font-medium border border-ink/15 rounded-full px-4 py-2"
          >
            <FiFilter className="w-4 h-4" /> {t('products.filters')}
          </button>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="text-sm border border-ink/15 rounded-full px-4 py-2 bg-white outline-none focus:border-brand-400"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-2xl border border-ink/8 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{t('products.filters')}</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-brand-600 flex items-center gap-1 hover:text-brand-700">
                  <FiX className="w-3.5 h-3.5" /> {t('products.clear')}
                </button>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-2">{t('products.category')}</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg ${category === 'all' ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-ink/5'}`}
                >
                  {t('products.allCategories')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg ${category === cat ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-ink/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-2">{t('products.priceRange')}</h4>
              <div className="flex items-center gap-2">
                <input
                  key={`min-${minPrice}`}
                  type="number"
                  min={0}
                  placeholder={t('products.min')}
                  defaultValue={minPrice}
                  onBlur={handleMinPriceBlur}
                  className="w-full text-sm border border-ink/15 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-400"
                />
                <span className="text-ink/30">–</span>
                <input
                  key={`max-${maxPrice}`}
                  type="number"
                  min={0}
                  placeholder={t('products.max')}
                  defaultValue={maxPrice}
                  onBlur={handleMaxPriceBlur}
                  className="w-full text-sm border border-ink/15 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-400"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : products.length === 0 ? (
            <Message>{t('products.noProducts')}</Message>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                page={page}
                pages={pages}
                basePath="/products"
                queryParams={{
                  ...(keyword && { keyword }),
                  ...(category !== 'all' && { category }),
                  sort,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
