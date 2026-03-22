export interface ApiErrorResponse {
  error: string
  status: number
}

export interface GeolocationResponse {
  latitude: number
  longitude: number
  city: string
  country: string
}

export interface WeatherRequest {
  latitude: number
  longitude: number
}

export interface GeocodeRequest {
  query: string
  count?: number
}

export interface AddRecentSearchRequest {
  cityName: string
  country: string
  latitude: number
  longitude: number
}
