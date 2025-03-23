import { User } from '@/dto/user'

export interface AuthResponse {
  message: string
  user: User
  token: string
  refreshToken: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  firstName: string
  lastName: string
}
