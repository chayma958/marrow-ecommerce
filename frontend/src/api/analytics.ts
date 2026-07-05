import api from '@/api/axios';

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface NamedPoint {
  name: string;
  value: number;
}

export const fetchRevenueByMonth = async (): Promise<MonthlyPoint[]> => {
  const { data } = await api.get<MonthlyPoint[]>('/admin/analytics/revenue');
  return data;
};

export const fetchOrdersByMonth = async (): Promise<MonthlyPoint[]> => {
  const { data } = await api.get<MonthlyPoint[]>('/admin/analytics/orders');
  return data;
};

export const fetchTopProducts = async (): Promise<NamedPoint[]> => {
  const { data } = await api.get<NamedPoint[]>('/admin/analytics/top-products');
  return data;
};

export const fetchNewUsersByMonth = async (): Promise<MonthlyPoint[]> => {
  const { data } = await api.get<MonthlyPoint[]>('/admin/analytics/new-users');
  return data;
};
