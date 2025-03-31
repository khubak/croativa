import React, { useState, useEffect, useCallback } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  value: string
  onChangeText: (text: string) => void
  onClear?: () => void
  placeholder?: string
}

export const SearchBar: React.FC<Props> = ({ value, onChangeText, onClear, placeholder = 'Find your restaurant' }) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const debouncedSearch = useCallback(
    (text: string) => {
      const handler = setTimeout(() => {
        onChangeText(text)
      }, 500)

      return () => {
        clearTimeout(handler)
      }
    },
    [onChangeText]
  )

  const handleChangeText = (text: string) => {
    setInputValue(text)
    debouncedSearch(text)
  }

  const handleClear = () => {
    setInputValue('')
    if (onClear) {
      onClear()
    } else {
      onChangeText('')
    }
  }

  return (
    <>
      <View className='flex-row items-center bg-gray-800 rounded-xl px-3 py-2.5'>
        <Ionicons name='search-outline' size={20} color='#9ca3af' />
        <TextInput
          className='flex-1 ml-2 text-base text-white'
          placeholder={placeholder}
          placeholderTextColor='#9ca3af'
          value={inputValue}
          onChangeText={handleChangeText}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name='close-circle' size={20} color='#9ca3af' />
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}
