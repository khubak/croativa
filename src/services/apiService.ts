import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API } from '@/enums/apiKeys'
import * as SecureStore from 'expo-secure-store'
import { logout } from './authService'

export const api = axios.create({
  baseURL: API.BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const userJson = await SecureStore.getItemAsync('user')
        const storedEmail = userJson ? JSON.parse(userJson).email : null
        const storedPassword = await SecureStore.getItemAsync('password')

        if (!storedEmail || !storedPassword) {
          await logout()
          return Promise.reject(error)
        }

        const response = await api.post(`${API.AUTH}/login`, {
          email: storedEmail,
          password: storedPassword,
        })

        if (response.data.token) {
          await SecureStore.setItemAsync('token', response.data.token)

          if (response.data.refreshToken) {
            await SecureStore.setItemAsync('refreshToken', response.data.refreshToken)
          }

          if (response.data.user) {
            await SecureStore.setItemAsync('user', JSON.stringify(response.data.user))
          }

          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return api(originalRequest)
        } else {
          await logout()
          return Promise.reject(new AxiosError('No token received during reauthentication'))
        }
      } catch (refreshError) {
        await logout()
        console.error('Authentication refresh failed:', refreshError)
        return Promise.reject(new AxiosError('Authentication expired. Please log in again.'))
      }
    }

    return Promise.reject(error)
  }
)
