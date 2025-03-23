import React from 'react'
import { View, Text } from 'react-native'

export const HomeScreen: React.FC = () => {
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <Text className='text-2xl font-semibold'>Home Screen</Text>
      <Text className='mt-2 text-gray-600'>Welcome to the app!</Text>
    </View>
  )
}
