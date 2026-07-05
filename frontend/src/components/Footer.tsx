import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-ink text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <Link to="/" className="font-display font-bold text-xl text-white">
            Marrow<span className="text-brand-400">.</span>
          </Link>
          <p className="mt-3 text-sm max-w-xs leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">{t('footer.shop')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=Electronics" className="hover:text-white">{t('footer.electronics')}</Link></li>
            <li><Link to="/products?category=Home" className="hover:text-white">{t('footer.home')}</Link></li>
            <li><Link to="/products?category=Apparel" className="hover:text-white">{t('footer.apparel')}</Link></li>
            <li><Link to="/products?category=Accessories" className="hover:text-white">{t('footer.accessories')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">{t('footer.account')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white">{t('footer.orders')}</Link></li>
            <li><Link to="/login" className="hover:text-white">{t('footer.signIn')}</Link></li>
            <li><Link to="/register" className="hover:text-white">{t('footer.createAccount')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">{t('footer.company')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">{t('footer.aboutUs')}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t('footer.contactUs')}</Link></li>
            <li><Link to="/faq" className="hover:text-white">{t('footer.faq')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">{t('footer.legal')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shipping-delivery" className="hover:text-white">{t('footer.shippingDelivery')}</Link></li>
            <li><Link to="/returns" className="hover:text-white">{t('footer.returnsRefund')}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">{t('footer.privacyPolicy')}</Link></li>
            <li><Link to="/terms" className="hover:text-white">{t('footer.termsConditions')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        {t('footer.builtAs')}
      </div>
    </footer>
  );
};

export default Footer;
