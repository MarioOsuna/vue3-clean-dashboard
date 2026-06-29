# Cybersecurity Threat Dashboard

Real-time threat analysis dashboard that consumes a FastAPI cybersecurity API. It allows you to visualize indicators of compromise (IOCs), investigate IPs with risk scoring, register security events, and explore threat intelligence.

## Stack

- **Vue 3** + **Composition API** + **TypeScript** strict
- **Vuetify 4** — Material Design components with custom dark theme
- **Vue Router 4** — navigation with lazy loading per route
- **Vite 5** — build + proxy for CORS-free development

## Architecture

```
src/
  domain/        # Pure TS types (1:1 with backend Pydantic schemas)
  api/           # One typed function per endpoint, no UI logic
  composables/   # Reactive state + business logic per domain
  components/ui/ # Pure presentation (props in, events out, no fetch)
  plugins/       # Vuetify configuration (theme, defaults)
  views/         # Orchestration of composables + components per route
  router/        # Routes with lazy loading
```

**Dependency rule**: `domain` imports nothing. `api` imports `domain`. `composables` import `api` + `domain`. `views` import `composables` + `components`. Components never fetch data.

## Views

| View | Route | Description |
|---|---|---|
| Dashboard | `/` | KPIs, average risk score, distribution by type, recent indicators table |
| Investigate IP | `/investigate` | Search → SVG risk gauge with score breakdown |
| Register Event | `/events/new` | POST form with validation (IP, JSON) and toast feedback |
| Threat Intel | `/intelligence` | Filterable IOC table (server-side by type + client-side by text) |

## API consumed

The dashboard connects to a FastAPI backend (`fastapi-cibersecurity`) running on `localhost:8000`:

| Endpoint | Usage |
|---|---|
| `GET /health/ready` | Status bar — polling every 30s |
| `GET /api/v1/threats/indicators` | Dashboard + Threat Intel |
| `GET /api/v1/threats/{ip}/score` | Investigate IP |
| `POST /api/v1/events` | Register Event |

The Vite proxy redirects `/api` and `/health` to the backend during development.

## How to run

```bash
# 1. Start the backend (in the fastapi-cibersecurity repo)
docker compose up -d

# 2. Install dependencies and start the dashboard
npm install
npm run dev
```

## CI/CD

GitHub Actions with two workflows:

- **CI** (`ci.yml`) — type-check + build on PRs and pushes to main
- **Deploy** (`deploy.yml`) — build and deploy to GitHub Pages on push to main

## Technical decisions

**Types as contract**: the interfaces in `domain/` exactly replicate the backend's Pydantic schemas. If the API changes, type errors are caught at build time.

**Composables as application layer**: `useThreatScore()`, `useIndicators()`, `useHealthCheck()` encapsulate loading/error/data and API calls. Views only consume reactive refs.

**Pure presentation components**: `SeverityBadge` and `RiskGauge` receive props and have no side effects. The gauge is pure SVG with an animated needle and color zones (green/yellow/orange/red).

**Toast as singleton state**: `useToast()` shares state at module level (not instance level) so any view can display notifications without prop drilling.

**No Pinia for this scope**: composables with module-scope or instance-scope state cover current needs. Pinia remains available if shared state grows.
