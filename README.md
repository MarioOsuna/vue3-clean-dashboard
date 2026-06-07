# vue3-clean-dashboard

Dashboard de métricas con Vue 3 + TypeScript organizado con Clean Architecture. El foco está en la estructura y la separación de responsabilidades, no en la cantidad de features.

## Stack

- **Vue 3** + **Composition API** — componentes funcionales sin Options API
- **TypeScript** strict — sin `any`, interfaces en domain layer
- **Pinia** — estado global tipado
- **Vue Router 4** — navegación declarativa
- **Vite** — build tool

## Arquitectura

```
src/
  domain/          # Interfaces y tipos de negocio puros (sin dependencias)
  application/     # Composables que orquestan casos de uso
  infrastructure/  # Implementaciones concretas (API, mock, localStorage)
  components/      # Componentes Vue (solo UI, sin lógica de negocio)
  stores/          # Pinia stores
  views/           # Páginas (ensamblaje de componentes)
```

La regla es simple: las dependencias solo van hacia adentro. `domain` no importa nada del proyecto. `application` importa `domain`. `infrastructure` implementa interfaces de `domain`. Los componentes importan `application`.

## Cómo correrlo

```bash
npm install
npm run dev
```

## Decisiones técnicas

**Domain como contratos**: `MetricsRepository` es una interfaz en `domain/`. `MockMetricsRepository` en `infrastructure/` la implementa. Cuando haya una API real, se crea `HttpMetricsRepository` sin tocar la aplicación.

**Composables en application layer**: `useMetrics()` no sabe si los datos vienen de un mock, una API REST o GraphQL. El repositorio se inyecta como dependencia. Los componentes consumen el composable, no el repositorio directamente.

**Sin Vuex**: Pinia es más simple, mejor tipado y compatible con la Composition API de forma nativa. Para un dashboard de esta escala, un store por entidad es suficiente.
