export function WeatherSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse" aria-label="Loading weather">
      <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gray-200/50 dark:bg-gray-700/50" />
      <div className="h-5 w-32 rounded bg-gray-200/50 dark:bg-gray-700/50" />
      <div className="h-24 w-48 rounded bg-gray-200/50 dark:bg-gray-700/50" />
      <div className="flex gap-6">
        <div className="h-4 w-16 rounded bg-gray-200/50 dark:bg-gray-700/50" />
        <div className="h-4 w-20 rounded bg-gray-200/50 dark:bg-gray-700/50" />
        <div className="h-4 w-14 rounded bg-gray-200/50 dark:bg-gray-700/50" />
      </div>
    </div>
  )
}
