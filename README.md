# ChromaKit

Clinical practice management for creative arts therapies — client records, scheduling, progress notes, letters, and organisation administration in a single workspace.

**Status:** Early prototype (v0.1.0). Frontend-only with in-memory seed data; no backend or authentication yet.

## Features

### Clinician workspace

- Home dashboard, calendar, and upcoming appointments
- Client list, intake, and patient profiles
- Appointment booking and session management
- Progress notes with TipTap rich-text editing
- Letters, case history, working documents, and clinical insights
- Body map and expressive colour wheel tooling
- Multi-workplace context switching

### Service Lead / organisation admin

- Workplace, user, and service management (`/service-lead/*`)
- Note, letter, and outcome form templates
- Role-based access with privacy masking for aggregate views

### Platform

- Demo persona switcher (Clinical Lead, Clinician, Service Lead, Administrator)
- Light Chroma and Dark Studio themes
- Toast and dialog UX (no native browser alerts)
- Zod validation at data-write boundaries
- 83 unit tests on pure `lib/` logic

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, React Router 7 |
| Build | Vite (rolldown) |
| Styling | Tailwind CSS 4 + design-token bridge |
| Data | TanStack Query (clients/workplaces), in-memory store |
| Editors | TipTap, React Flow (`@xyflow/react`) |
| Validation | Zod |
| Tests | Vitest |

## Getting started

**Prerequisites:** Node.js 20+ and npm

```bash
git clone https://github.com/BenMidwinter/ChromaKit.git
cd ChromaKit
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript check on `.ts` files |
| `npm run lint` | ESLint |

## Demo personas

Use the profile switcher in the app header to explore role-specific behaviour:

| Persona | Role | Good for testing |
| --- | --- | --- |
| **Ben** | Clinical Lead | Client add/edit, appointments, home dashboard |
| **Sarah** | Clinician | Day-to-day clinical workflows |
| **Daniel** | Service Lead | `/service-lead/*` admin screens, blurred client identity |
| **Alex** | Administrator | Operations and workplace views |

## Project structure

```
src/
├── components/          # Shared UI and clinical screens
├── features/
│   └── service-lead/    # Organisation admin (feature-folder pilot)
├── lib/
│   ├── data/            # Collection accessors
│   ├── store/           # Domain mutations (clients, scheduling, docs…)
│   ├── mockData.js      # Seed data — replace with a backend when ready
│   └── *.ts / *.js      # Headless logic + unit tests
├── styles/              # CSS partials and design tokens
├── App.jsx              # Route definitions
└── main.jsx             # App shell, QueryClient, providers
```

## Architecture

ChromaKit is being incrementally refactored toward four design pillars: feature encapsulation, unidirectional data flow, headless core logic, and defensive boundaries.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the rollout checklist, completed vertical slices, and the current Phase A execution plan.

## Deployment

Configured for [Vercel](https://vercel.com) as a static SPA (`vercel.json` rewrites all routes to `index.html`). The site is set to `noindex` until ready for public launch.

```bash
npm run build
```

## License

Private — all rights reserved.
