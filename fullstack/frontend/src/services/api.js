import axios from 'axios'
import { getToken } from '../utils/auth'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config)=>{
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
