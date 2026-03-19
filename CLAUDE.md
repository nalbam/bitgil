# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**bitgil (빛길)** — A web application helping students and parents find the safest walking routes to school by analyzing safety infrastructure (streetlights, CCTV, police stations, crosswalks, danger zones, emergency bells).

## Commands

```bash
pnpm dev              # Dev server with Turbopack
pnpm build            # Production build
pnpm start            # Production server
pnpm lint             # ESLint check
pnpm type-check       # TypeScript type check (tsc --noEmit)
pnpm format           # Prettier format all files
pnpm format:check     # Prettier check without writing
```

No test framework is configured yet.

## Architecture

Clean architecture with strict separation of concerns:

```
src/
├── domain/           # Business logic (framework-independent)
│   ├── entities/     # School, Facility types
│   ├── services/     # Safety score calculation
│   ├── types/        # Domain type re-exports
│   └── value-objects/# SafetyLevel conversions
├── server/           # Server-side data layer
│   ├── repositories/ # DynamoDB queries with mock data fallback
│   └── mappers/      # Domain ↔ DynamoDB item conversion
├── lib/
│   ├── api/          # CSV data loaders (schools, streetlights, cctv, police, danger)
│   ├── dynamodb/     # AWS SDK client, key patterns, schema, types
│   ├── constants/    # Site-wide constants
│   ├── env/          # Environment variable helpers
│   ├── maps/         # Map/route domain types & visualization config
│   └── utils/        # cn() (clsx + tailwind-merge)
├── app/              # Next.js App Router
│   ├── api/          # REST endpoints (health, schools, facilities, routes)
│   └── page.tsx      # Landing page
├── components/       # Reusable UI (layout, map, route, search, ui)
├── data/mock/        # Development mock data
└── hooks/            # Client-side React hooks
```

### Key Design Decisions

- **DynamoDB single-table design** — All entities share one table with composite PK/SK keys. Key patterns are generated in `lib/dynamodb/keys.ts`.
- **Mock data fallback** — Repositories auto-detect `isDynamoDbConfigured()` and fall back to mock data in `data/mock/` when AWS credentials are not set.
- **Safety scoring model** — Base score 50, facility weights (cctv: +10, streetlight: +8, police/police_station: +15, crosswalk: +5, danger: -25, emergency_bell: +7), unlit segment penalty: -10, clamped 0-100, mapped to levels: safe(≥70), moderate(≥40), caution(<40).

### DynamoDB Access Patterns

| Pattern | PK | SK prefix |
|---------|-----|-----------|
| School by ID | `SCHOOL#{id}` | `META` |
| Facilities in area | `AREA#{areaId}` | `FACILITY#` |
| Facilities by type in area | `AREA#{areaId}` | `FACILITY#{type}#` |
| Route analyses for school | `SCHOOL#{schoolId}` | `ANALYSIS#` |

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + PostCSS
- **Map:** Google Maps + deck.gl (ScatterplotLayer, PathLayer)
- **Database:** AWS DynamoDB (single-table)
- **Deployment:** AWS Amplify
- **Package Manager:** pnpm
- **Path alias:** `@/*` → `./src/*`

## Environment Variables

See `.env.example`. Server-only: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `DYNAMODB_TABLE_NAME`. Client: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (optional).

## Code Conventions

- **Formatting:** Prettier with double quotes, semicolons, trailing commas, 100 char width, tailwindcss plugin
- **API responses:** `{ ok: boolean, data?: T, total?: number }`
- **Imports:** Use `@/` path alias for all src imports
