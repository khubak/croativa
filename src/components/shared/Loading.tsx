import { ActivityIndicator, View } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'
import { LayoutBase } from './LayoutBase'

interface Props {
  size?: 'small' | 'large'
  fullScreen?: boolean
  color?: string
}

export const Loading: React.FC<Props> = ({ size = 'large', fullScreen = true, color }) => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light

  const indicatorColor = color || theme.primary

  if (fullScreen) {
    return (
      <LayoutBase withStatusBar className='items-center justify-center'>
        <ActivityIndicator size={size} color={indicatorColor} />
      </LayoutBase>
    )
  }

  return (
    <View className='items-center justify-center py-4'>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  )
}
