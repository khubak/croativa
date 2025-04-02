import { useState, useEffect, useCallback } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

interface Props {
  value: string
  onChangeText: (text: string) => void
  onClear?: () => void
  placeholder?: string
}

export const SearchBar: React.FC<Props> = ({ value, onChangeText, onClear, placeholder = 'Find your restaurant' }) => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const debouncedSearch = useCallback(
    (text: string) => {
      const handler = setTimeout(() => {
        onChangeText(text)
      }, 300)

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
      <View
        className='flex-row items-center rounded-xl px-3 py-2.5'
        style={{ backgroundColor: isDark ? theme.cardBackground : theme.highlight }}>
        <Ionicons name='search-outline' size={20} color={theme.placeholder} />
        <TextInput
          className='flex-1 ml-2 text-base'
          style={{ color: theme.text }}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          value={inputValue}
          onChangeText={handleChangeText}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name='close-circle' size={20} color={theme.icon} />
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}
