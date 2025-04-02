import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Switch } from 'react-native'
import { AuthForm } from '@/components/profile-screen/AuthForm'
import { logout } from '@/services/authService'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'
import { Ionicons } from '@expo/vector-icons'
import { LayoutBase } from '@/components/shared/LayoutBase'

export const ProfileScreen: React.FC = () => {
  const { user, authLoading, handleAuth, setUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    handleAuth()
  }, [handleAuth])

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    setUser(null)
    setLoggingOut(false)
  }

  if (authLoading) {
    return (
      <LayoutBase withStatusBar>
        <View className='items-center justify-center flex-1'>
          <ActivityIndicator size='large' color={theme.primary} />
        </View>
      </LayoutBase>
    )
  }

  if (!user) {
    return <AuthForm handleAuth={handleAuth} />
  }

  return (
    <LayoutBase withStatusBar className='justify-center flex-1'>
      <View className='items-center'>
        <Text className='mb-2 text-2xl font-semibold' style={{ color: theme.text }}>
          Profile
        </Text>
        <Text className='mb-6 text-xl' style={{ color: theme.textSecondary }}>
          Hello, {user.email}
        </Text>
      </View>
      <View
        className='flex-row items-center justify-between p-4 mb-4 rounded-lg'
        style={{ backgroundColor: theme.cardBackground }}>
        <View className='flex-row items-center'>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={theme.icon} />
          <Text className='ml-3 text-base font-medium' style={{ color: theme.text }}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.textTertiary, true: theme.primary }}
          thumbColor={theme.text}
        />
      </View>
      <TouchableOpacity
        className={cn('self-center rounded-md px-6 py-3', loggingOut && 'opacity-70')}
        style={{ backgroundColor: theme.error }}
        onPress={handleLogout}
        disabled={loggingOut}>
        {loggingOut ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text className='font-semibold' style={{ color: theme.text }}>
            Logout
          </Text>
        )}
      </TouchableOpacity>
    </LayoutBase>
  )
}
