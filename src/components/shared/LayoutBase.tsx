import { SafeAreaView, ViewProps, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

interface Props extends ViewProps {
  withStatusBar?: boolean
}

export const LayoutBase: React.FC<Props> = ({ children, withStatusBar, className }) => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light

  return (
    <>
      {withStatusBar && <StatusBar style={isDark ? 'light' : 'dark'} />}
      <View className={cn('flex-1', withStatusBar && 'pt-9')} style={{ backgroundColor: theme.background }}>
        <SafeAreaView className={cn('flex-1 px-4', className)}>{children}</SafeAreaView>
      </View>
    </>
  )
}
