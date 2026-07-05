export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  brand: string;
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  onSale: boolean;
  salePrice?: number;
  countInStock: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface ProductSuggestion {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  onSale: boolean;
  salePrice?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token?: string;
}

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  couponCode?: string;
  discountAmount: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export interface Coupon {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  expiresAt?: string;
  minOrderValue: number;
  createdAt: string;
}

export interface CouponValidation {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  discountAmount: number;
  freeShipping: boolean;
}
