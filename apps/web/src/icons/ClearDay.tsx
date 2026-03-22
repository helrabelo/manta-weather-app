export function ClearDay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="28" fill="#FBBF24" className="animate-pulse-slow" />
      <g className="animate-spin-slow origin-center">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="60"
            y1="18"
            x2="60"
            y2="8"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
      </g>
    </svg>
  )
}
