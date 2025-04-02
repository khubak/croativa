import { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Restaurant } from '@/dto/restaurant'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

interface Props {
  restaurant: Restaurant
  index?: number
}

export const RestaurantCard: React.FC<Props> = ({ restaurant, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false)
  const isClosed = index % 3 === 0 && index !== 0
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light

  return (
    <View className='relative w-full gap-1 overflow-hidden shadow-md'>
      <View className='relative'>
        <Image
          source={{ uri: restaurant.icon_url }}
          className='w-full rounded-xl aspect-[21/9]'
          style={{ backgroundColor: theme.placeholder }}
          resizeMode='cover'
        />
        <View
          className='absolute flex-row items-center p-2 rounded-lg bottom-4 right-4'
          style={{ backgroundColor: theme.overlay }}>
          <Ionicons name='star' size={16} color={theme.warning} />
          <Text className='ml-1 font-semibold' style={{ color: theme.text }}>
            {restaurant.rating !== null ? restaurant.rating.toFixed(1) : '-'}
          </Text>
          <Text className='ml-1' style={{ color: theme.text }}>
            ({restaurant.user_ratings_total || 0})
          </Text>
        </View>
        {isClosed && (
          <View
            className='absolute inset-0 z-10 items-center justify-center w-full h-full rounded-xl'
            style={{ backgroundColor: theme.overlay }}>
            <Text className='text-xl font-bold' style={{ color: theme.text }}>
              Opening at 8 AM
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity className='absolute p-2 top-2 right-2' onPress={() => setIsLiked(!isLiked)}>
        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? theme.error : theme.primary} />
      </TouchableOpacity>
      <View className='px-2'>
        <View className='flex-row items-center gap-1'>
          <Text
            className='text-lg font-bold'
            style={{
              color: theme.text,
              opacity: isClosed ? 0.4 : 1,
            }}>
            {restaurant.name}
          </Text>
          <Ionicons name='checkmark-circle' size={16} color={isClosed ? theme.textTertiary : theme.success} />
        </View>
        <Text
          className='text-xs'
          style={{
            color: theme.textSecondary,
            opacity: isClosed ? 0.4 : 1,
          }}
          numberOfLines={1}>
          {restaurant.address.split(',')[0]}
        </Text>
      </View>
    </View>
  )
}
