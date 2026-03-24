export function WeatherSkeleton() {
  const shimmer = 'rounded bg-gray-500/15'

  return (
    <div className="flex flex-col items-center gap-4 animate-pulse" aria-label="Loading weather">
      <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gray-500/15" />
      <div className={`h-5 w-32 ${shimmer}`} />
      <div className={`h-24 w-48 ${shimmer}`} />
      <div className="flex gap-6">
        <div className={`h-4 w-16 ${shimmer}`} />
        <div className={`h-4 w-20 ${shimmer}`} />
        <div className={`h-4 w-14 ${shimmer}`} />
      </div>
    </div>
  )
}
