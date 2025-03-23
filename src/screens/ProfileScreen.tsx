import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { AuthForm } from '@/components/profile-screen/AuthForm'
import { getCurrentUser, logout, isAuthenticated } from '@/services/authService'
import { User } from '@/dto/user'

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const checkAuth = async () => {
    setLoading(true)
    const isAuth = await isAuthenticated()
    if (isAuth) {
      const userData = await getCurrentUser()
      setUser(userData)
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    checkAuth()
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    setUser(null)
    setLoggingOut(false)
  }

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <View className='flex-1 items-center justify-center p-6'>
      <Text className='mb-2 text-2xl font-semibold'>Profile</Text>
      <Text className='mb-6 text-xl'>Hello, {user.email}</Text>
      <TouchableOpacity className='rounded-md bg-red-500 px-6 py-3' onPress={handleLogout} disabled={loggingOut}>
        {loggingOut ? <ActivityIndicator color='#ffffff' /> : <Text className='font-semibold text-white'>Logout</Text>}
      </TouchableOpacity>
    </View>
  )
}
