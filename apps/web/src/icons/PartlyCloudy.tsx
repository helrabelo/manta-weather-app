export function PartlyCloudy({ className, isDay = true }: { className?: string; isDay?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {isDay ? (
        <circle cx="42" cy="40" r="20" fill="#FBBF24" />
      ) : (
        <path
          d="M42 24c-10 0-18 8-18 18s8 18 18 18c3 0 5.8-.7 8.2-2C44.4 54.8 40 48.3 40 41s4.4-13.8 10.2-16.9C47.8 22.7 45 22 42 22z"
          fill="#CBD5E1"
        />
      )}
      <path
        d="M38 68c0-13.3 10.7-24 24-24 10.8 0 20 7.2 23 17h1c8.8 0 16 7.2 16 16s-7.2 16-16 16H42c-8.8 0-16-7.2-16-16 0-7.4 5-13.6 12-15.4V68z"
        fill="#E2E8F0"
        className="animate-drift"
      />
    </svg>
  )
}
