import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  ImageURISource,
} from 'react-native'
import { AuthForm } from '@/components/profile-screen/AuthForm'
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [profileImage, setProfileImage] = useState<ImageURISource>({ uri: DEFAULT_PROFILE_IMAGE })

  const handleAuth = async () => {
    setLoading(true)
    const isAuth = await isAuthenticated()
    if (isAuth) {
      const userData = await getCurrentUser()
      setUser(userData)
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleAuth()
  }, [])

  useEffect(() => {
    if (!loading && user) {
      loadRestaurants(1, searchQuery, true)
    }
  }, [user, loading])

  useEffect(() => {
    if (user) {
      loadRestaurants(1, searchQuery, true)
    }
  }, [searchQuery])

  const loadRestaurants = async (page: number, search: string, reset: boolean = false) => {
    if (reset) {
      setIsLoadingMore(true)
    }

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
    }
  }

  const handleEndReached = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      loadRestaurants(currentPage + 1, searchQuery)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadRestaurants(1, searchQuery, true)
  }

  if (loading) {
    return (
      <View className='items-center justify-center flex-1 bg-black'>
        <ActivityIndicator size='large' color='#ffffff' />
      </View>
    )
  }

  if (!user) {
    return <AuthForm handleAuth={handleAuth} />
  }

  const displayName = user.email ? user.email.split('@')[0] : 'User'
  const userLocation = 'Ilica 1, Zagreb'

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
            <Text className='font-semibold text-white'>{displayName}</Text>
            <Text className='text-xs text-gray-400'>{userLocation}</Text>
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
