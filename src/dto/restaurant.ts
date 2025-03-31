export interface Restaurant {
  id: string
  name: string
  address: string
  rating: number
  user_ratings_total: number | null
  price_level: number | null
  icon_url: string
}

export interface RestaurantResponse {
  totalRestaurants: number
  totalPages: number
  currentPage: number
  restaurants: Restaurant[]
  hasSampleLimit: boolean
  fixedSampleSize: number
  maxRecords: number
}
