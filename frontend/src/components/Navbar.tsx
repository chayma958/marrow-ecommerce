import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchBar from '@/components/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-ink/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-display font-bold text-xl tracking-tight shrink-0">
            Marrow<span className="text-brand-500">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/70">
            <Link to="/products" className="hover:text-ink transition-colors">{t('nav.shop')}</Link>
            <Link to="/products?category=Electronics" className="hover:text-ink transition-colors">{t('nav.electronics')}</Link>
            <Link to="/products?category=Home" className="hover:text-ink transition-colors">{t('nav.home')}</Link>
            <Link to="/products?category=Apparel" className="hover:text-ink transition-colors">{t('nav.apparel')}</Link>
          </nav>

          <SearchBar className="hidden md:block flex-1 max-w-xs" />

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user && (
              <Link
                to="/wishlist"
                className="relative w-10 h-10 hidden sm:flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
                aria-label={t('nav.wishlist')}
              >
                <FiHeart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
              aria-label={t('nav.cart')}
            >
              <FiShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
                aria-label={t('nav.account')}
              >
                <FiUser className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-cardHover border border-ink/5 py-2 text-sm"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-ink/50 text-xs">{t('nav.signedInAs')}<br /><span className="text-ink font-medium">{user.name}</span></div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-ink/5">{t('nav.profileOrders')}</Link>
                      <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-ink/5">{t('nav.wishlist')}</Link>
                      {user.isAdmin && (
                        <>
                          <div className="border-t border-ink/8 my-1" />
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-ink/5">{t('nav.adminPanel')}</Link>
                        </>
                      )}
                      <div className="border-t border-ink/8 my-1" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-ink/5 text-red-600">{t('nav.signOut')}</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-ink/5">{t('nav.signIn')}</Link>
                      <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-ink/5">{t('nav.createAccount')}</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5"
              aria-label={t('nav.menu')}
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink/8 bg-paper px-4 py-4 space-y-4">
          <SearchBar onNavigate={() => setMenuOpen(false)} />
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link to="/products" onClick={() => setMenuOpen(false)}>{t('nav.shop')}</Link>
            <Link to="/products?category=Electronics" onClick={() => setMenuOpen(false)}>{t('nav.electronics')}</Link>
            <Link to="/products?category=Home" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/products?category=Apparel" onClick={() => setMenuOpen(false)}>{t('nav.apparel')}</Link>
            <div className="border-t border-ink/8 pt-3 flex items-center justify-between">
              <span className="text-ink/50 text-xs">{t('language.label')}</span>
              <LanguageSwitcher compact />
            </div>
            <div className="border-t border-ink/8 pt-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-1">{t('nav.profileOrders')}</Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-1">{t('nav.wishlist')}</Link>
                  {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-1">{t('nav.adminPanel')}</Link>}
                  <button onClick={handleLogout} className="block py-1 text-red-600">{t('nav.signOut')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-1">{t('nav.signIn')}</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-1">{t('nav.createAccount')}</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
