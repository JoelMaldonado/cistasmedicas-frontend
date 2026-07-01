import axios from 'axios'
import { readStoredToken } from '@/services/authToken'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3005',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = readStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
