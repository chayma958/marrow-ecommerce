import api from '@/api/axios';
import { Order } from '@/types';

export const createOrder = async (payload: Partial<Order>): Promise<Order> => {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/orders/mine');
  return data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
};

export const payOrder = async (id: string, paymentResult: any): Promise<Order> => {
  const { data } = await api.put<Order>(`/orders/${id}/pay`, paymentResult);
  return data;
};

export const deliverOrder = async (id: string): Promise<Order> => {
  const { data } = await api.put<Order>(`/orders/${id}/deliver`, {});
  return data;
};

export const fetchAllOrders = async (status?: string): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/orders', { params: status ? { status } : undefined });
  return data;
};

export const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string }> => {
  const { data } = await api.post('/payments/create-payment-intent', { amount });
  return data;
};
