# HoraDoc

Registra tus horas médicas por clínica y especialidad, revisa tu histórico
mensual y genera borradores de cuenta de cobro (con retención en la fuente).

Built as a **modular monolith** so it can grow into a larger app without a
rewrite: cross-cutting tokens, framework-agnostic domain logic, and
self-contained feature modules are kept in separate layers.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react (icons), Poppins via `next/font`

## Architecture

```
src/
  app/                 Next.js App Router (layout, page, globals.css)
  core/                Cross-cutting, framework-agnostic
    theme.ts           Brand tokens, fonts, clinic palette
    format.ts          Money + Spanish date formatting
    clock.ts           Single source of truth for "today"
  domain/              The stable heart — no React
    types.ts           Clinic, Entry, ClinicSummary, ...
    seed.ts            Demo data (swap for a data layer later)
    calculations.ts    Pure billing/rollup logic
  shared/ui/           Reusable primitives (Card, GradientText, PulseDivider)
  modules/             One folder per feature
    shell/             App shell + navigation + useHoraDoc() state hook
    inicio/            Home dashboard
    registro/          Log / edit hours
    clinicas/          Clinics & per-specialty rates
    resumen/           Monthly summary
    factura/           Cuenta de cobro draft
    historico/         Monthly history + day detail
```

**Where things go as the app grows:** business rules → `domain/`, shared visual
primitives → `shared/ui/`, a new feature → a new folder under `modules/`.
Persistence (DB/API) slots in behind `domain/` — modules keep importing the same
typed shapes, so the UI doesn't change when the data layer lands.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` runs a production build with a full TypeScript check.
