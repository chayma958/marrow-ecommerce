import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { PrivateRoute, AdminRoute } from '@/components/RouteGuards';

import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ShippingPage from '@/pages/ShippingPage';
import PaymentPage from '@/pages/PaymentPage';
import PlaceOrderPage from '@/pages/PlaceOrderPage';
import OrderPage from '@/pages/OrderPage';
import ProfilePage from '@/pages/ProfilePage';
import WishlistPage from '@/pages/WishlistPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AboutPage from '@/pages/info/AboutPage';
import ContactPage from '@/pages/info/ContactPage';
import FaqPage from '@/pages/info/FaqPage';
import ShippingPolicyPage from '@/pages/info/ShippingPolicyPage';
import ReturnsPolicyPage from '@/pages/info/ReturnsPolicyPage';
import PrivacyPolicyPage from '@/pages/info/PrivacyPolicyPage';
import TermsPage from '@/pages/info/TermsPage';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminProductListPage from '@/pages/admin/AdminProductListPage';
import AdminProductEditPage from '@/pages/admin/AdminProductEditPage';
import AdminOrderListPage from '@/pages/admin/AdminOrderListPage';
import AdminUserListPage from '@/pages/admin/AdminUserListPage';
import AdminCouponListPage from '@/pages/admin/AdminCouponListPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/shipping-delivery" element={<ShippingPolicyPage />} />
                  <Route path="/returns" element={<ReturnsPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  <Route element={<PrivateRoute />}>
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/placeorder" element={<PlaceOrderPage />} />
                    <Route path="/orders/:id" element={<OrderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductListPage />} />
                      <Route path="products/:id/edit" element={<AdminProductEditPage />} />
                      <Route path="orders" element={<AdminOrderListPage />} />
                      <Route path="coupons" element={<AdminCouponListPage />} />
                      <Route path="users" element={<AdminUserListPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
