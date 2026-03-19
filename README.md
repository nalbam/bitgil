# bitgil

**bitgil** (빛길 — "path of light") is a school-route safety platform that helps students and parents find the safest walking route to school.

The system analyzes nearby safety infrastructure — streetlights, CCTV cameras, police stations, crosswalks, and known danger zones — and produces a safety score for each candidate route.

---

## Architecture Overview

```
src/
├── app/                   Next.js App Router pages and API routes
│   └── api/               REST API handlers
├── components/            Reusable UI components (presentational only)
├── data/mock/             Static mock data for local development
├── domain/                Pure domain logic (no infra dependencies)
│   ├── entities/          Domain entity factories
│   ├── services/          Domain services (e.g. safety scoring)
│   ├── types/             Domain type re-exports
│   └── value-objects/     Immutable value helpers
├── lib/
│   ├── api/               CSV data loaders (schools, streetlights, cctv, police, danger)
│   ├── dynamodb/          DynamoDB infrastructure (client, schema, keys, types)
│   ├── env/               Environment variable helpers
│   ├── maps/              Map types & visualization config (Google Maps + deck.gl)
│   └── utils/             Generic utilities
└── server/
    ├── mappers/           Domain ↔ DynamoDB item converters
    └── repositories/      Data-access layer (DB or mock fallback)
```

**Separation of concerns:**

| Layer | Responsibility |
|---|---|
| `domain/` | Business rules, scoring, entity types |
| `lib/api/` | CSV data loaders for public datasets |
| `lib/dynamodb/` | AWS SDK wiring, key patterns, item types |
| `server/mappers/` | Convert domain ↔ DynamoDB items |
| `server/repositories/` | Query/write DynamoDB; fallback to mock data |
| `app/api/` | Thin HTTP handlers using repositories |
| `components/` | Render UI; never touch DB details |

---

## Domain Overview

| Concept | Description |
|---|---|
| **School** | A physical school with a GPS position |
| **Area** | A geographic zone around a school with a radius |
| **Facility** | A safety-relevant point of interest (streetlight, CCTV, etc.) |
| **RouteOption** | A candidate walking route with a computed safety score |
| **SafetyScore** | 0–100 numeric score with per-factor explanations |
| **RouteSafetyAnalysis** | A collection of route options for a school at a point in time |

**Facility types:** `streetlight` · `cctv` · `police` · `police_station` · `crosswalk` · `danger` (danger zone) · `emergency_bell`

**Safety levels:** `safe` (≥70) · `moderate` (≥40) · `caution` (<40)

---

## DynamoDB Single-Table Design

All data lives in **one table** (`DYNAMODB_TABLE_NAME`). Every item has a `PK` (partition key) and `SK` (sort key).

### Key Patterns

| Access Pattern | PK | SK |
|---|---|---|
| Get school by ID | `SCHOOL#{schoolId}` | `META` |
| Get area by ID | `AREA#{areaId}` | `META` |
| List facilities by area | `AREA#{areaId}` | `FACILITY#*` |
| List facilities by area + type | `AREA#{areaId}` | `FACILITY#{type}#*` |
| List facilities for school | `SCHOOL#{schoolId}` | `FACILITY#*` |
| Get route analysis by ID | `ANALYSIS#{id}` | `META` |
| List route analyses for school | `SCHOOL#{schoolId}` | `ANALYSIS#*` |

> **Duplication note:** Facilities are written to both `AREA#` and `SCHOOL#` partitions at creation time. This is intentional — it supports two distinct access patterns (by area, by school) without requiring a Global Secondary Index or a table scan.

### Item Types

| Item | `_type` tag | Description |
|---|---|---|
| `SchoolMetaItem` | `SCHOOL_META` | School name, address, coordinates |
| `AreaMetaItem` | `AREA_META` | Area name, center, radius |
| `FacilityByAreaItem` | `FACILITY` | Facility under area partition |
| `FacilityBySchoolItem` | `FACILITY` | Facility under school partition |
| `RouteAnalysisMetaItem` | `ROUTE_ANALYSIS_META` | Full analysis keyed by analysis ID |
| `RouteAnalysisBySchoolItem` | `ROUTE_ANALYSIS_BY_SCHOOL` | Analysis summary keyed under school |

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start development server
pnpm dev
```

The app runs with **mock data by default** — no AWS credentials required. When you set the DynamoDB environment variables, the repositories automatically switch to real DB access.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Google Maps API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Optional | Google Maps custom map ID |
| `AWS_REGION` | For DB | AWS region (e.g. `ap-northeast-2`) |
| `AWS_ACCESS_KEY_ID` | For DB | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | For DB | AWS secret key |
| `DYNAMODB_TABLE_NAME` | For DB | DynamoDB table name (e.g. `bitgil-routes`) |

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check; reports `db: "mock"` or `db: "dynamodb"` |
| `GET` | `/api/schools?q=` | Search schools by name or address |
| `GET` | `/api/facilities?type=&areaId=` | List facilities by type and/or area |
| `GET` | `/api/routes?schoolId=` | List route options for a school |

---

## Roadmap

- [ ] DynamoDB table provisioning (CDK or CloudFormation)
- [ ] Data seeding script to populate the table from mock data
- [ ] Real facility data ingestion pipeline
- [ ] Authentication (parent/admin roles)
- [ ] LLM-powered route explanation generation
- [ ] Push notifications for route safety alerts
- [ ] Mobile app (React Native)
