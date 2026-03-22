export function Fog({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M28 55c0-11 9-20 20-20 1.4 0 2.8.2 4.1.4C56 25.6 64.4 19 74 19c13.3 0 24 10.7 24 24v2c6.6 1.8 12 8 12 15 0 8.8-7.2 16-16 16H34c-8.8 0-16-7.2-16-16 0-5.6 2.8-10.4 7-13.3V55z"
        fill="#CBD5E1"
      />
      {[80, 88, 96].map((y, i) => (
        <line
          key={y}
          x1="30"
          y1={y}
          x2="90"
          y2={y}
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.6 - i * 0.15}
        />
      ))}
    </svg>
  )
}
