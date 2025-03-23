import * as SecureStore from 'expo-secure-store'
import { api } from '@/services/api'
import { API } from '@/enums/apiKeys'
import { AuthResponse, LoginData, RegisterData } from '@/dto/auth'
import { User } from '@/dto/user'

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${API.BASE}/${API.AUTH}/${API.LOGIN}`, data)
  await saveAuthData(response.data)
  return response.data
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${API.BASE}/${API.AUTH}/${API.REGISTER}`, data)
  await saveAuthData(response.data)
  return response.data
}

export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('token')
  await SecureStore.deleteItemAsync('refreshToken')
  await SecureStore.deleteItemAsync('user')
  await SecureStore.deleteItemAsync('password')
}

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync('token')
  return !!token
}

export const getCurrentUser = async (): Promise<User | null> => {
  const userString = await SecureStore.getItemAsync('user')
  return userString ? JSON.parse(userString) : null
}

export const saveAuthData = async (data: AuthResponse): Promise<void> => {
  await SecureStore.setItemAsync('token', data.token)
  await SecureStore.setItemAsync('refreshToken', data.refreshToken)
  await SecureStore.setItemAsync('user', JSON.stringify(data.user))
}
