import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CartItem, CouponValidation, Product, ShippingAddress } from '@/types';
import { validateCoupon } from '@/api/coupons';
import { getEffectivePrice } from '@/utils/pricing';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  coupon: CouponValidation | null;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  itemsCount: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  discountAmount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const scopedKey = (base: string, userId: string | null) => `${base}:${userId || 'guest'}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id || null;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Stripe');
  const [coupon, setCoupon] = useState<CouponValidation | null>(null);

  // Reload every piece of scoped state whenever the signed-in user changes.
  useEffect(() => {
    if (authLoading) return;

    const storedCart = localStorage.getItem(scopedKey('cartItems', userId));
    setCartItems(storedCart ? JSON.parse(storedCart) : []);

    const storedShipping = userId ? localStorage.getItem(`shippingAddress:${userId}`) : null;
    setShippingAddress(storedShipping ? JSON.parse(storedShipping) : null);

    const storedPayment = localStorage.getItem(scopedKey('paymentMethod', userId));
    setPaymentMethod(storedPayment || 'Stripe');

    const storedCoupon = localStorage.getItem(scopedKey('coupon', userId));
    setCoupon(storedCoupon ? JSON.parse(storedCoupon) : null);
  }, [userId, authLoading]);

  const addToCart = (product: Product, qty: number) => {
    const price = getEffectivePrice(product);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      const next = existing
        ? prev.map((item) => (item.product === product._id ? { ...item, qty, price } : item))
        : [
            ...prev,
            {
              product: product._id,
              name: product.name,
              image: product.image,
              price,
              countInStock: product.countInStock,
              qty,
            },
          ];
      localStorage.setItem(scopedKey('cartItems', userId), JSON.stringify(next));
      return next;
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.product !== productId);
      localStorage.setItem(scopedKey('cartItems', userId), JSON.stringify(next));
      return next;
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setCartItems((prev) => {
      const next = prev.map((item) => (item.product === productId ? { ...item, qty } : item));
      localStorage.setItem(scopedKey('cartItems', userId), JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(scopedKey('cartItems', userId));
    removeCoupon();
  };

  const saveShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address);
    if (userId) localStorage.setItem(`shippingAddress:${userId}`, JSON.stringify(address));
  };

  const savePaymentMethod = (method: string) => {
    setPaymentMethod(method);
    localStorage.setItem(scopedKey('paymentMethod', userId), method);
  };

  const applyCoupon = async (code: string) => {
    const result = await validateCoupon(code, itemsPrice);
    setCoupon(result);
    localStorage.setItem(scopedKey('coupon', userId), JSON.stringify(result));
    toast.success(`Coupon ${result.code} applied`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem(scopedKey('coupon', userId));
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  const baseShippingPrice = itemsPrice > 100 ? 0 : itemsPrice > 0 ? 9.99 : 0;
  const shippingPrice = coupon?.freeShipping ? 0 : baseShippingPrice;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const discountAmount = coupon
    ? coupon.type === 'percentage'
      ? Number(((coupon.value / 100) * itemsPrice).toFixed(2))
      : coupon.type === 'fixed'
      ? Number(Math.min(coupon.value, itemsPrice).toFixed(2))
      : 0
    : 0;
  const totalPrice = Math.max(0, Number((itemsPrice + shippingPrice + taxPrice - discountAmount).toFixed(2)));

  // A coupon that no longer meets its minimum order value must stop applying.
  useEffect(() => {
    if (coupon && itemsPrice < coupon.minOrderValue) {
      removeCoupon();
      toast.error(`Coupon ${coupon.code} removed - order no longer meets its $${coupon.minOrderValue.toFixed(2)} minimum`);
    }
  }, [itemsPrice, coupon]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        coupon,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        saveShippingAddress,
        savePaymentMethod,
        applyCoupon,
        removeCoupon,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
