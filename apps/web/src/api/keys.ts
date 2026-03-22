export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
  geocode: (query: string) => [...weatherKeys.all, 'geocode', query] as const,
  recent: () => [...weatherKeys.all, 'recent'] as const,
}
