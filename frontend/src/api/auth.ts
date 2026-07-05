import api from '@/api/axios';
import { User } from '@/types';

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/users/login', { email, password });
  return data;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/users', { name, email, password });
  return data;
};

export const googleLogin = async (idToken: string): Promise<User> => {
  const { data } = await api.post<User>('/users/auth/google', { idToken });
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/users/logout');
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await api.post('/users/forgot-password', { email });
  return data;
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const { data } = await api.put(`/users/reset-password/${token}`, { password });
  return data;
};

export const updateProfile = async (payload: { name: string; email: string; password?: string }): Promise<User> => {
  const { data } = await api.put<User>('/users/profile', payload);
  return data;
};

export const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
