import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Must use NEXT_PUBLIC_ prefix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required if backend uses cookies
});

export default api;
