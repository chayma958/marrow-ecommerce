import api from '@/api/axios';
import { Product, ProductListResponse, ProductSuggestion } from '@/types';

export interface ProductQuery {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const fetchProducts = async (query: ProductQuery = {}): Promise<ProductListResponse> => {
  const { data } = await api.get<ProductListResponse>('/products', { params: query });
  return data;
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/products/featured');
  return data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>('/products/categories');
  return data;
};

export const fetchProductSuggestions = async (keyword: string): Promise<ProductSuggestion[]> => {
  const { data } = await api.get<ProductSuggestion[]>('/products/suggestions', { params: { keyword } });
  return data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export const fetchRecommendedProducts = async (id: string): Promise<Product[]> => {
  const { data } = await api.get<Product[]>(`/products/${id}/recommendations`);
  return data;
};

export const createProductReview = async (
  productId: string,
  review: { rating: number; comment: string }
): Promise<{ message: string }> => {
  const { data } = await api.post(`/products/${productId}/reviews`, review);
  return data;
};

export const updateProductReview = async (
  productId: string,
  reviewId: string,
  review: { rating: number; comment: string }
): Promise<{ message: string }> => {
  const { data } = await api.put(`/products/${productId}/reviews/${reviewId}`, review);
  return data;
};

export const deleteProductReview = async (
  productId: string,
  reviewId: string
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/products/${productId}/reviews/${reviewId}`);
  return data;
};

export const createProduct = async (payload: Partial<Product>): Promise<Product> => {
  const { data } = await api.post<Product>('/products', payload);
  return data;
};

export const updateProduct = async (id: string, payload: Partial<Product>): Promise<Product> => {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
