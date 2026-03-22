export function Showers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="38" cy="36" r="16" fill="#FBBF24" />
      <path
        d="M34 64c0-11 9-20 20-20 1.4 0 2.8.2 4.1.4C62 34.6 70.4 28 80 28c13.3 0 24 10.7 24 24v2c6.6 1.8 10 8 10 15 0 8.8-5.2 16-14 16H40c-8.8 0-16-7.2-16-16 0-5.6 2.8-10.4 7-13.3V64z"
        fill="#94A3B8"
        className="animate-drift"
      />
      {[48, 66].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="90"
          x2={x - 3}
          y2="100"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-rain"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  )
}
