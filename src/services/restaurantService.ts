import { RestaurantResponse } from '@/dto/restaurant'
import { api } from './api'
import { API } from '@/enums/apiKeys'

export const fetchRestaurants = async (page: number = 1, search: string = ''): Promise<RestaurantResponse> => {
  try {
    const response = await api.get<RestaurantResponse>(`${API.RESTAURANTS}/${API.SAMPLE}`, {
      params: {
        page: page > 1 ? page : undefined,
        search: search || undefined,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}
