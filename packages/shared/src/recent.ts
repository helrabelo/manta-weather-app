export interface RecentSearch {
  id: string
  cityName: string
  country: string
  latitude: number
  longitude: number
  temperature: number
  weatherCode: number
  isDay: boolean
  searchedAt: string
}

export type WSMessageType = 'recent:update' | 'recent:initial'

export interface WSMessage {
  type: WSMessageType
  payload: RecentSearch[]
}
