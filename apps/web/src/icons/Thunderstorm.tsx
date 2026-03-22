export function Thunderstorm({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M28 58c0-11 9-20 20-20 1.4 0 2.8.2 4.1.4C56 28.6 64.4 22 74 22c13.3 0 24 10.7 24 24v2c6.6 1.8 12 8 12 15 0 8.8-7.2 16-16 16H34c-8.8 0-16-7.2-16-16 0-5.6 2.8-10.4 7-13.3V58z"
        fill="#64748B"
      />
      <path
        d="M62 78l-6 14h10l-4 16 14-20H66l6-10H62z"
        fill="#FBBF24"
        className="animate-flash"
      />
    </svg>
  )
}
