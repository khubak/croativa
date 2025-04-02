import { useState, useCallback } from 'react'
import { getCurrentUser, isAuthenticated } from '@/services/authService'
import { User } from '@/dto/user'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  const handleAuth = useCallback(async () => {
    setAuthLoading(true)
    try {
      const isAuth = await isAuthenticated()
      if (isAuth) {
        const userData = await getCurrentUser()
        setUser(userData)
      } else {
        setUser(null)
      }
      setAuthChecked(true)
    } catch (error) {
      console.error('Auth error:', error)
      setUser(null)
      setAuthChecked(true)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  return {
    user,
    authLoading,
    authChecked,
    handleAuth,
    setUser,
  }
}
