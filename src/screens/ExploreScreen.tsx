import { useEffect, useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  ImageURISource,
  TextInput,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { getCurrentUser, isAuthenticated } from '@/services/authService'
import { User } from '@/dto/user'
import { Restaurant } from '@/dto/restaurant'
import { fetchRestaurants } from '@/services/restaurantService'
import { RestaurantCard } from '@/components/explore-screen/RestaurantCard'
import { SearchBar } from '@/components/explore-screen/SearchBar'
import { Ionicons } from '@expo/vector-icons'
import { LayoutBase } from '@/components/shared/LayoutBase'
import { DEFAULT_PROFILE_IMAGE, NoProfilePhoto } from '@/constants/profilePhotos'

export const ExploreScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [profileImage, setProfileImage] = useState<ImageURISource>({ uri: DEFAULT_PROFILE_IMAGE })
  const [userLocation, setUserLocation] = useState('Ilica 1, Zagreb')
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const isRefreshing = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (loading) return

      if (!isRefreshing.current) {
        handleAuth()
        loadRestaurants(1, searchQuery, true)
      }
    }, [searchQuery, loading])
  )

  const handleAuth = async () => {
    setAuthLoading(true)
    try {
      const isAuth = await isAuthenticated()
      if (isAuth) {
        const userData = await getCurrentUser()
        setUser(userData)
      } else {
        setUser(null)
      }
      setAuthChecked(true)
    } catch (error) {
      console.error('Auth error:', error)
      setUser(null)
      setAuthChecked(true)
    } finally {
      setAuthLoading(false)
    }
  }

  const loadRestaurants = async (page: number, search: string, reset: boolean = false) => {
    if (isRefreshing.current) return

    if (reset) {
      setIsLoadingMore(true)
    }

    isRefreshing.current = true

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
      isRefreshing.current = false
    }
  }

  useEffect(() => {
    handleAuth()
  }, [])

  useEffect(() => {
    if (authChecked && !authLoading) {
      const loadInitialData = async () => {
        await loadRestaurants(1, searchQuery, true)
        setLoading(false)
      }
      loadInitialData()
    }
  }, [authChecked, authLoading])

  useEffect(() => {
    if (loading) return
    loadRestaurants(1, searchQuery, true)
  }, [searchQuery])

  const handleEndReached = () => {
    if (currentPage < totalPages && !isLoadingMore && !isRefreshing.current) {
      loadRestaurants(currentPage + 1, searchQuery)
    }
  }

  const handleRefresh = () => {
    if (isRefreshing.current) return

    setRefreshing(true)
    handleAuth()
    loadRestaurants(1, searchQuery, true)
  }

  if (loading || authLoading) {
    return (
      <View className='items-center justify-center flex-1 bg-black'>
        <ActivityIndicator size='large' color='#ffffff' />
      </View>
    )
  }

  return (
    <LayoutBase withStatusBar className='gap-4'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <View className='w-10 h-10 mr-3 overflow-hidden bg-teal-500 rounded-full'>
            <Image
              source={profileImage}
              className='w-full h-full'
              onError={() => {
                setProfileImage(NoProfilePhoto)
              }}
            />
          </View>
          <View>
            {user && <Text className='text-base font-semibold text-black'>{user.firstName + ' ' + user.lastName}</Text>}
            {isEditingLocation ? (
              <View className='flex-row items-center'>
                <TextInput
                  value={userLocation}
                  onChangeText={setUserLocation}
                  className='pr-6 text-xs text-gray-700 border-b border-gray-400'
                  autoFocus
                  onBlur={() => setIsEditingLocation(false)}
                  onSubmitEditing={() => setIsEditingLocation(false)}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 0 }}
                  onPress={() => setIsEditingLocation(false)}>
                  <Ionicons name='checkmark' size={14} color='#4CAF50' />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingLocation(true)}>
                <View className='flex-row items-center'>
                  <Text className='text-sm text-gray-600'>{userLocation}</Text>
                  <Ionicons name='pencil-outline' size={12} color='#888' style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name='map-outline' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} onClear={() => setSearchQuery('')} />
      <FlatList
        data={restaurants}
        renderItem={({ item, index }) => <RestaurantCard restaurant={item} index={index} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ItemSeparatorComponent={() => <View className='h-3' />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor='#fff' />}
        ListEmptyComponent={() => (
          <View className='items-center justify-center py-10'>
            <Text className='text-lg text-gray-400'>No restaurants found</Text>
          </View>
        )}
        ListFooterComponent={() =>
          isLoadingMore && currentPage > 1 ? (
            <View className='py-5'>
              <ActivityIndicator color='#ffffff' />
            </View>
          ) : null
        }
      />
    </LayoutBase>
  )
}
