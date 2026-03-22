import type { RecentSearch } from '@manta/shared'
import { RecentSearchCard } from './RecentSearchCard'

interface RecentSearchesProps {
  searches: RecentSearch[]
  onSelect: (search: RecentSearch) => void
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null

  return (
    <section aria-label="Recent city searches" className="w-full">
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 px-1">
        Recent searches
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {searches.map((search, index) => (
          <RecentSearchCard
            key={search.id}
            search={search}
            onSelect={onSelect}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </section>
  )
}
