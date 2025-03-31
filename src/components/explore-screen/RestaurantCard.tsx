import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Restaurant } from '@/dto/restaurant'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  restaurant: Restaurant
  index?: number
}

export const RestaurantCard: React.FC<Props> = ({ restaurant, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false)
  const isClosed = index % 3 === 0 && index !== 0

  return (
    <View className='relative w-full gap-1 overflow-hidden shadow-md'>
      {isClosed && (
        <View className='absolute inset-0 z-10 items-center justify-center w-full h-full bg-gray-800/90 rounded-xl'>
          <Text className='text-xl font-bold text-white'>Opening at 8 AM</Text>
        </View>
      )}
      <View className='relative'>
        <Image
          source={{ uri: restaurant.icon_url }}
          className='w-full bg-gray-800 rounded-xl aspect-[21/9]'
          resizeMode='cover'
        />
        <View className='absolute flex-row items-center p-2 rounded-lg bg-black/70 bottom-4 right-4'>
          <Ionicons name='star' size={16} color='#FFD700' />
          <Text className='ml-1 font-semibold text-white'>{!isClosed && restaurant.rating.toFixed(1)}</Text>
          <Text className='ml-1 text-white'>({restaurant.user_ratings_total || 0})</Text>
        </View>
      </View>
      <TouchableOpacity className='absolute p-2 top-2 right-2' onPress={() => setIsLiked(!isLiked)}>
        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? '#FF3B30' : '#fff'} />
      </TouchableOpacity>
      <View className='px-2'>
        <View className='flex-row items-center gap-1'>
          <Text className='text-lg font-bold'>{restaurant.name}</Text>
          <Ionicons name='checkmark-circle' size={16} color={isClosed ? '#9CA3AF' : '#22C55E'} />
        </View>
        <Text className='text-xs text-gray-600' numberOfLines={1}>
          {restaurant.address.split(',')[0]}
        </Text>
      </View>
    </View>
  )
}
