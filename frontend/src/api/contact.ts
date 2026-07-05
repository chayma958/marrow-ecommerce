import api from '@/api/axios';

export const sendContactMessage = async (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ message: string }> => {
  const { data } = await api.post('/contact', payload);
  return data;
};
