import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import { fetchFeaturedProducts } from '@/api/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const perks = [
    { icon: FiTruck, title: t('home.perk1Title'), desc: t('home.perk1Desc') },
    { icon: FiRefreshCw, title: t('home.perk2Title'), desc: t('home.perk2Desc') },
    { icon: FiShield, title: t('home.perk3Title'), desc: t('home.perk3Desc') },
  ];

  useEffect(() => {
    fetchFeaturedProducts()
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-6">
              {t('home.badge')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              {t('home.titleLine1')}
              <br />
              {t('home.titleLine2Pre')} <span className="text-brand-500">{t('home.titleLine2Accent')}</span>
            </h1>
            <p className="mt-6 text-ink/60 text-lg max-w-md leading-relaxed">
              {t('home.intro')}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-ink text-white px-6 py-3.5 rounded-full font-medium hover:bg-brand-600 transition-colors"
              >
                {t('home.shopCollection')} <FiArrowRight />
              </Link>
              <Link to="/products?sort=newest" className="text-sm font-medium text-ink/60 hover:text-ink">
                {t('home.seeWhatsNew')}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-100 relative">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
                alt="Curated everyday goods"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-cardHover px-5 py-4 hidden sm:block">
              <p className="text-2xl font-display font-bold">12+</p>
              <p className="text-xs text-ink/50">{t('home.curatedCategories')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-3 gap-8">
        {perks.map((perk) => (
          <div key={perk.title} className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <perk.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{perk.title}</h3>
              <p className="text-sm text-ink/50 mt-0.5">{perk.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-ink/40">{t('home.handpicked')}</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">{t('home.featuredProducts')}</h2>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
            {t('home.viewAll')} <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
