# MantaWeather

A full-stack weather application built with React and Cloudflare Workers. Search any city, get current conditions with hourly and 7-day forecasts, and share weather links with others.

## Architecture

```
Browser (React 19 + Vite)
│
├── React Query ─── server state & caching
├── UnitsContext ── °C/°F toggle (localStorage)
├── URL params ──── shareable weather links
└── WebSocket ───── real-time recent searches
│
└── /api/* (Vite proxy in dev)
│
Cloudflare Worker (Hono)
├── GET  /api/weather      → Durable Object cache → Open-Meteo API
├── GET  /api/geocode       ───────────────────────→ Open-Meteo Geocoding
├── GET  /api/geolocation  → Cloudflare CF headers
├── GET|POST /api/recent   → Durable Object (SQLite)
└── WS   /api/ws           → Durable Object (broadcast)
```

**Frontend** — React 19, Vite 6, Tailwind CSS 4, TanStack React Query 5

**Backend** — Hono on Cloudflare Workers, Durable Objects with SQLite-backed storage

**Shared** — Pure TypeScript type definitions (`@manta/shared`) used by both apps

**Weather data** — [Open-Meteo](https://open-meteo.com/) (free, no API key required)

## Features

- **City search** with debounced geocoding and keyboard navigation
- **Current weather** with temperature, humidity, wind, and feels-like
- **Hourly forecast** (24h) and **daily forecast** (7 days)
- **Unit toggle** between Celsius and Fahrenheit, persisted to localStorage
- **Shareable URLs** — `?lat=XX&lon=YY&city=Name` lets you link to any city's weather
- **Geolocation** — browser Geolocation API with Cloudflare IP-based fallback
- **Recent searches** — stored in Durable Objects, broadcast via WebSocket in real-time
- **Weather-driven theming** — background gradients and animations match the weather condition
- **Stale cache fallback** — if Open-Meteo is unreachable, serves the last known data
- **Rate limiting** — per-IP sliding window (60 req/min) on all API routes
- **Accessibility** — skip-to-content, ARIA combobox, semantic HTML, reduced motion support

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) 10+

### Install & Run

```bash
pnpm install

# Start both frontend (Vite) and backend (Wrangler) in parallel
pnpm dev
```

The web app runs at `http://localhost:5173` with API requests proxied to the worker at `http://localhost:8787`.

### Other Commands

```bash
pnpm build        # Build the web app
pnpm test         # Run all tests
pnpm typecheck    # Type-check all packages
pnpm lint         # Lint all packages
```

### Deploying the API

```bash
cd apps/api
npx wrangler deploy
```

No secrets or environment variables are required — Open-Meteo is free and keyless.

## Project Structure

```
├── apps/
│   ├── api/                    # Cloudflare Workers backend
│   │   ├── src/
│   │   │   ├── durable-objects/ # WeatherStore (cache, recent searches, WS)
│   │   │   ├── middleware/      # Rate limiting
│   │   │   ├── routes/          # weather, geocode, recent, ws, geolocation
│   │   │   ├── services/        # Open-Meteo API client
│   │   │   └── test/
│   │   └── wrangler.toml
│   └── web/                    # React frontend
│       └── src/
│           ├── api/             # API client, React Query hooks
│           ├── components/      # UI components (search, weather, recent, layout)
│           ├── context/         # UnitsContext (°C/°F)
│           ├── hooks/           # useGeolocation, useWebSocket
│           ├── icons/           # Custom SVG weather icons
│           └── lib/             # weather-codes, formatting utils
└── packages/
    └── shared/                 # TypeScript type definitions
```

## Key Design Decisions

**Durable Objects over KV** — Needed both persistent storage (recent searches) and WebSocket support in a single stateful object. Durable Objects handle both. SQLite backing keeps it on Cloudflare's free plan.

**Stale-while-revalidate cache** — Weather data has a 10-minute TTL. If the upstream API fails, stale data is served rather than showing an error. Cache keys round coordinates to 2 decimal places (~1km precision) for reasonable hit rates.

**No client-side router** — The app is a single view. URL query parameters (`replaceState`) handle shareable state without the overhead of a routing library.

**Custom SVG icons** — Weather icons are small React components with CSS animations (rain, snow, drift, flash). No icon library dependency, keeps the bundle minimal.

**React Query over manual state** — Handles cache invalidation, stale time, placeholder data during transitions, and retry logic. The weather query uses `keepPreviousData` to avoid layout flicker when switching cities.

## Trade-offs & Known Limitations

- **Test coverage** — Service layer and core components are tested; route handlers, Durable Object logic, and WebSocket behavior are not. For a production app, these would need integration tests.
- **Rate limiting is per-isolate** — Cloudflare Workers spin up isolates per colo. The in-memory rate limiter doesn't share state across isolates, so the effective limit is approximate. For strict enforcement, a Durable Object-backed counter would be needed.
- **CORS allows all origins** — Appropriate for a demo but would need scoping in production.
- **WebSocket reconnection caps at 5 retries** — A tab left open for hours won't auto-recover. Production would use exponential backoff with jitter and no hard cap.
