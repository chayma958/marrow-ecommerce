import api from '@/api/axios';
import { Product } from '@/types';

export const fetchWishlist = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/users/wishlist');
  return data;
};

export const addToWishlist = async (productId: string): Promise<Product[]> => {
  const { data } = await api.post<Product[]>(`/users/wishlist/${productId}`);
  return data;
};

export const removeFromWishlist = async (productId: string): Promise<Product[]> => {
  const { data } = await api.delete<Product[]>(`/users/wishlist/${productId}`);
  return data;
};
