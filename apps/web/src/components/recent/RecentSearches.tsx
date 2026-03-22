import type { RecentSearch } from '@manta/shared'
import { RecentSearchCard } from './RecentSearchCard'

interface RecentSearchesProps {
  searches: RecentSearch[]
  onSelect: (search: RecentSearch) => void
  isDark?: boolean
}

export function RecentSearches({ searches, onSelect, isDark = false }: RecentSearchesProps) {
  if (searches.length === 0) return null

  return (
    <section aria-label="Recent city searches" className="w-full">
      <h2 className={`text-sm font-semibold mb-3 px-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Recent searches
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {searches.map((search, index) => (
          <RecentSearchCard
            key={search.id}
            search={search}
            onSelect={onSelect}
            isDark={isDark}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </section>
  )
}
