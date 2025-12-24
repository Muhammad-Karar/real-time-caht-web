import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;