# Cybersecurity Threat Dashboard

Dashboard de análisis de amenazas en tiempo real que consume una API FastAPI de ciberseguridad. Permite visualizar indicadores de compromiso (IOCs), investigar IPs con scoring de riesgo, registrar eventos de seguridad y explorar threat intelligence.

## Stack

- **Vue 3** + **Composition API** + **TypeScript** strict
- **Vuetify 4** — componentes Material Design con dark theme custom
- **Vue Router 4** — navegación con lazy loading por ruta
- **Vite 5** — build + proxy para desarrollo sin CORS

## Arquitectura

```
src/
  domain/        # Tipos TS puros (1:1 con schemas Pydantic del backend)
  api/           # Una función tipada por endpoint, sin lógica de UI
  composables/   # Estado reactivo + lógica de negocio por dominio
  components/ui/ # Presentación pura (props in, events out, sin fetch)
  plugins/       # Configuración de Vuetify (theme, defaults)
  views/         # Orquestación de composables + componentes por ruta
  router/        # Rutas con lazy loading
```

**Regla de dependencias**: `domain` no importa nada. `api` importa `domain`. `composables` importan `api` + `domain`. `views` importan `composables` + `components`. Los componentes nunca hacen fetch.

## Vistas

| Vista | Ruta | Qué hace |
|---|---|---|
| Dashboard | `/` | KPIs, risk score promedio, distribución por tipo, tabla de indicadores recientes |
| Investigate IP | `/investigate` | Buscador → gauge SVG de riesgo con desglose de puntos |
| Register Event | `/events/new` | Formulario POST con validación (IP, JSON) y toast feedback |
| Threat Intel | `/intelligence` | Tabla filtrable de IOCs (server-side por tipo + client-side por texto) |

## API consumida

El dashboard se conecta a un backend FastAPI (`fastapi-cibersecurity`) que corre en `localhost:8000`:

| Endpoint | Uso |
|---|---|
| `GET /health/ready` | Status bar — polling cada 30s |
| `GET /api/v1/threats/indicators` | Dashboard + Threat Intel |
| `GET /api/v1/threats/{ip}/score` | Investigate IP |
| `POST /api/v1/events` | Register Event |

El proxy de Vite redirige `/api` y `/health` al backend en desarrollo.

## Cómo correrlo

```bash
# 1. Levantar el backend (en el repo fastapi-cibersecurity)
docker compose up -d

# 2. Instalar dependencias e iniciar el dashboard
npm install
npm run dev
```

## CI/CD

GitHub Actions con dos workflows:

- **CI** (`ci.yml`) — type-check + build en PRs y pushes a main
- **Deploy** (`deploy.yml`) — build y deploy a GitHub Pages en push a main

## Decisiones técnicas

**Tipos como contrato**: las interfaces en `domain/` replican exactamente los schemas Pydantic del backend. Si la API cambia, el error de tipos salta en build time.

**Composables como capa de aplicación**: `useThreatScore()`, `useIndicators()`, `useHealthCheck()` encapsulan loading/error/data y las llamadas a la API. Las vistas solo consumen refs reactivas.

**Componentes de presentación puros**: `SeverityBadge` y `RiskGauge` reciben props y no tienen side effects. El gauge es SVG puro con aguja animada y zonas de color (verde/amarillo/naranja/rojo).

**Toast como estado singleton**: `useToast()` comparte estado a nivel de módulo (no de instancia) para que cualquier vista pueda mostrar notificaciones sin prop drilling.

**Sin Pinia para este alcance**: los composables con module-scope o instance-scope state cubren las necesidades actuales. Pinia queda disponible si el estado compartido crece.
