import { ICoupon } from '../models/Coupon';

export interface DiscountResult {
  discountAmount: number;
  freeShipping: boolean;
}

export const computeDiscount = (coupon: ICoupon, itemsPrice: number): DiscountResult => {
  switch (coupon.type) {
    case 'percentage':
      return { discountAmount: Number(((coupon.value / 100) * itemsPrice).toFixed(2)), freeShipping: false };
    case 'fixed':
      return { discountAmount: Number(Math.min(coupon.value, itemsPrice).toFixed(2)), freeShipping: false };
    case 'free_shipping':
      return { discountAmount: 0, freeShipping: true };
  }
};

export const getCouponValidationError = (coupon: ICoupon | null, itemsPrice: number): string | null => {
  if (!coupon) return 'Invalid coupon code';
  if (!coupon.isActive) return 'This coupon is no longer active';
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) return 'This coupon has expired';
  if (itemsPrice < coupon.minOrderValue) return `Minimum order of $${coupon.minOrderValue.toFixed(2)} required for this coupon`;
  return null;
};
