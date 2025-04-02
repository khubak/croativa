import { Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'
import { LayoutBase } from '@/components/shared/LayoutBase'

export const HomeScreen: React.FC = () => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light

  return (
    <LayoutBase withStatusBar className='items-center justify-center flex-1'>
      <Text className='text-2xl font-semibold' style={{ color: theme.text }}>
        Home Screen
      </Text>
      <Text className='mt-2' style={{ color: theme.textSecondary }}>
        Welcome to the app!
      </Text>
    </LayoutBase>
  )
}
