import { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Image, ImageURISource, TextInput } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Restaurant } from '@/dto/restaurant'
import { fetchRestaurants } from '@/services/restaurantService'
import { RestaurantCard } from '@/components/explore-screen/RestaurantCard'
import { SearchBar } from '@/components/explore-screen/SearchBar'
import { Ionicons } from '@expo/vector-icons'
import { LayoutBase } from '@/components/shared/LayoutBase'
import { Loading } from '@/components/shared/Loading'
import { PHOTOS } from '@/constants/profilePhotos'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

export const ExploreScreen: React.FC = () => {
  const { me } = useAuth()
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light
  const [isLoading, setIsLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [profileImage, setProfileImage] = useState<ImageURISource>({ uri: PHOTOS.DEFAULT_PROFILE })
  const [userLocation, setUserLocation] = useState('Ilica 1, Zagreb')
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const isDataOperation = useRef(false)

  useEffect(() => {
    me.handleAuth()
  }, [me.handleAuth])

  useEffect(() => {
    if (me.authChecked && !me.authLoading) {
      loadInitialData()
    }
  }, [me.authChecked, me.authLoading])

  const loadInitialData = async () => {
    await loadRestaurants(1, searchQuery, true)
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      if (isLoading) return

      if (!isDataOperation.current) {
        loadRestaurants(1, searchQuery, true)
      }
    }, [isLoading, searchQuery])
  )

  const loadRestaurants = async (page: number, search: string, reset: boolean = false) => {
    if (isDataOperation.current) return

    if (reset) {
      setIsLoadingMore(true)
    } else if (page > 1) {
      setIsLoadingMore(true)
    }

    isDataOperation.current = true

    try {
      const response = await fetchRestaurants(page, search)

      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)

      if (reset) {
        setRestaurants(response.restaurants)
      } else {
        setRestaurants((prev) => [...prev, ...response.restaurants])
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    } finally {
      setIsLoadingMore(false)
      setRefreshing(false)
      isDataOperation.current = false
    }
  }

  const handleEndReached = () => {
    if (currentPage < totalPages && !isLoadingMore && !isDataOperation.current) {
      loadRestaurants(currentPage + 1, searchQuery)
    }
  }

  const handleRefresh = () => {
    if (isDataOperation.current) return

    setRefreshing(true)
    me.handleAuth()
    loadRestaurants(1, searchQuery, true)
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    if (!isDataOperation.current) {
      loadRestaurants(1, text, true)
    }
  }

  if (isLoading || me.authLoading) {
    return <Loading color={theme.textTertiary} />
  }

  return (
    <LayoutBase withStatusBar className='gap-4'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <View className='w-10 h-10 mr-3 overflow-hidden rounded-full' style={{ backgroundColor: theme.tealAccent }}>
            <Image
              source={profileImage}
              className='w-full h-full'
              onError={() => {
                setProfileImage(PHOTOS.NO_PROFILE)
              }}
            />
          </View>
          <View>
            {me.user && (
              <Text className='text-base font-semibold' style={{ color: theme.text }}>
                {me.user.firstName + ' ' + me.user.lastName}
              </Text>
            )}
            {isEditingLocation ? (
              <View className='flex-row items-center'>
                <TextInput
                  value={userLocation}
                  onChangeText={setUserLocation}
                  className='pr-6 text-xs border-b'
                  style={{
                    color: theme.textSecondary,
                    borderBottomColor: theme.border,
                  }}
                  autoFocus
                  onBlur={() => setIsEditingLocation(false)}
                  onSubmitEditing={() => setIsEditingLocation(false)}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 0 }}
                  onPress={() => setIsEditingLocation(false)}>
                  <Ionicons name='checkmark' size={14} color={theme.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingLocation(true)}>
                <View className='flex-row items-center'>
                  <Text className='text-sm' style={{ color: theme.textSecondary }}>
                    {userLocation}
                  </Text>
                  <Ionicons name='pencil-outline' size={12} color={theme.icon} style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name='map-outline' size={24} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <SearchBar value={searchQuery} onChangeText={handleSearchChange} onClear={() => handleSearchChange('')} />
      <FlatList
        style={{ backgroundColor: theme.background }}
        data={restaurants}
        renderItem={({ item, index }) => <RestaurantCard restaurant={item} index={index} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View className='h-3' style={{ backgroundColor: 'transparent' }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.textTertiary}
            colors={[theme.textTertiary]}
          />
        }
        ListEmptyComponent={() => (
          <View className='items-center justify-center py-10'>
            <Text className='text-lg' style={{ color: theme.textTertiary }}>
              No restaurants found
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          isLoadingMore ? <Loading size='small' fullScreen={false} color={theme.textTertiary} /> : null
        }
      />
    </LayoutBase>
  )
}
