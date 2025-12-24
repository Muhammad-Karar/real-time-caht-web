import api from '../api';

export const loginAPI = async (username: string) => {
  const response = await api.post('/login', { username });
  return response.data;
};

export const fetchUsersAPI = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const fetchHistoryAPI = async (user1: string, user2: string) => {
  const response = await api.get(`/messages/${user1}/${user2}`);
  return response.data;
};