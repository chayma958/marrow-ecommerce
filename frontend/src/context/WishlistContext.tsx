import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import * as wishlistApi from '@/api/wishlist';

interface WishlistContextType {
  wishlist: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      wishlistApi.fetchWishlist().then(setWishlist).catch(() => {});
    } else {
      setWishlist([]);
    }
  }, [user]);

  const isWishlisted = (productId: string) => wishlist.some((p) => p._id === productId);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Sign in to save items to your wishlist');
      return;
    }
    try {
      if (isWishlisted(product._id)) {
        const updated = await wishlistApi.removeFromWishlist(product._id);
        setWishlist(updated);
        toast.success(`${product.name} removed from wishlist`);
      } else {
        const updated = await wishlistApi.addToWishlist(product._id);
        setWishlist(updated);
        toast.success(`${product.name} added to wishlist`);
      }
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const updated = await wishlistApi.removeFromWishlist(productId);
      setWishlist(updated);
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
