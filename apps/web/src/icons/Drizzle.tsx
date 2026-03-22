export function Drizzle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M28 62c0-11 9-20 20-20 1.4 0 2.8.2 4.1.4C56 32.6 64.4 26 74 26c13.3 0 24 10.7 24 24v2c6.6 1.8 12 8 12 15 0 8.8-7.2 16-16 16H34c-8.8 0-16-7.2-16-16 0-5.6 2.8-10.4 7-13.3V62z"
        fill="#94A3B8"
      />
      {[44, 62, 80].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="88"
          x2={x - 2}
          y2="96"
          stroke="#93C5FD"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-rain"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </svg>
  )
}
