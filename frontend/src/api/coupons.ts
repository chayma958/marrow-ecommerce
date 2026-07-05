import api from '@/api/axios';
import { Coupon, CouponValidation } from '@/types';

export const validateCoupon = async (code: string, itemsPrice: number): Promise<CouponValidation> => {
  const { data } = await api.post<CouponValidation>('/coupons/validate', { code, itemsPrice });
  return data;
};

export const fetchCoupons = async (): Promise<Coupon[]> => {
  const { data } = await api.get<Coupon[]>('/coupons');
  return data;
};

export const createCoupon = async (payload: Partial<Coupon>): Promise<Coupon> => {
  const { data } = await api.post<Coupon>('/coupons', payload);
  return data;
};

export const deleteCoupon = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/coupons/${id}`);
  return data;
};
