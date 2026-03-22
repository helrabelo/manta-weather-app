export function Cloudy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M30 78c0-11 9-20 20-20 1.4 0 2.8.2 4.1.4C58 48.6 66.4 42 76 42c13.3 0 24 10.7 24 24v2c6.6 1.8 12 8 12 15 0 8.8-7.2 16-16 16H36c-8.8 0-16-7.2-16-16 0-5.6 2.8-10.4 7-13.3V78z"
        fill="#94A3B8"
        className="animate-drift"
      />
      <path
        d="M20 88c0-8.8 5.6-16.2 13.4-19C36.4 60.2 44.4 54 54 54c7 0 13.2 3 17.6 7.8C74.2 58.6 78 57 82 57c8.8 0 16 7.2 16 16v1c5 2 8.6 6.8 8.6 12.4 0 7.4-6 13.6-13.6 13.6H30c-8.8 0-16-7.2-16-16 0-2.2.4-4.2 1.2-6H20z"
        fill="#B0BEC5"
        className="animate-drift-slow"
      />
    </svg>
  )
}
