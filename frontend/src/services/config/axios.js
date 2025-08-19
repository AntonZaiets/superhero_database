import axios from 'axios';
import { config } from './env';

export const api = axios.create({
  baseURL: config.api.baseUrl || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
