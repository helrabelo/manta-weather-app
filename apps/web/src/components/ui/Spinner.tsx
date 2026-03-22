export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-gray-400 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
