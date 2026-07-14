# ChromaKit

Clinical practice management for creative arts therapies — client records, scheduling, progress notes, letters, and organisation administration in a single workspace.

**Status:** Prototype (v0.2.0). Frontend-only with in-memory seed data; no backend or authentication yet.

## What's new in v0.2.0

- **Clinician profile hub** — job title vs professional title, biography, photo, handwritten signature upload, per-location availability and services
- **Workplace branding** — letterhead editable by clinical leads; flows into note and letter exports
- **Progress notes** — draft/complete lifecycle, filterable notes history, rich signature module (draw / account / script font)
- **Calendar** — appointment **Other info** on session blocks; leads and admins pick which clinician to book with
- **Architecture** — home, workplace, and profile promoted to `features/`; most `lib/` and store modules typed in TypeScript
- **Tests** — 156 unit tests on headless `lib/` logic

## Features

### Clinician workspace

- Home dashboard, calendar, and upcoming appointments
- Client list, intake, and patient profiles
- Appointment booking (with other info and clinician assignment for leads/admins)
- Progress notes with TipTap rich-text editing, sign-off, and notes history
- Letters, case history, working documents, and clinical insights
- Body map and expressive colour wheel tooling
- Multi-workplace context switching
- Clinician profile: availability, private-practice letterhead, signature assets

### Service Lead / organisation admin

- Workplace, user, and service management (`/service-lead/*`)
- Note, letter, and outcome form templates
- Role-based access with privacy masking for aggregate views

### Platform

- Demo persona switcher (Clinical Lead, Clinician, Service Lead, Administrator)
- Light Chroma and Dark Studio themes
- Toast and dialog UX (no native browser alerts)
- Zod validation at data-write boundaries
- TanStack Query for clients, appointments, progress notes, workplace team, and org config

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, React Router 7 |
| Build | Vite (rolldown) |
| Styling | Tailwind CSS 4 + design-token bridge |
| Data | TanStack Query, in-memory store (`lib/store/`) |
| Editors | TipTap, React Flow (`@xyflow/react`) |
| Validation | Zod |
| Tests | Vitest (156 tests) |

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
| **Ben** | Clinical Lead | Profile, workplace branding, calendar booking for team, client add/edit |
| **Sarah** | Clinician | Day-to-day clinical workflows, own calendar |
| **Daniel** | Service Lead | `/service-lead/*` admin screens, blurred client identity |
| **Alex** | Administrator | Operations, calendar booking for clinicians |

## Project structure

```
src/
├── components/          # Shared UI (editors, layout, signature pad…)
├── features/
│   ├── calendar/        # Calendar module + page
│   ├── client/          # Patient profile, notes, appointments
│   ├── home/            # Role-based home dashboard blocks
│   ├── profile/         # Clinician profile hub + journal
│   ├── service-lead/    # Organisation admin
│   └── workplace/       # Team, branding, join requests
├── lib/
│   ├── data/            # Collection accessors (TypeScript)
│   ├── store/           # Domain mutations (TypeScript)
│   ├── mockData.js      # Seed data — replace with a backend when ready
│   └── *.ts             # Headless logic + unit tests
├── styles/              # CSS partials and design tokens
├── App.jsx              # Route definitions
└── main.jsx             # App shell, QueryClient, providers
```

## Architecture

ChromaKit follows four design pillars: feature encapsulation, unidirectional data flow, headless core logic, and defensive boundaries.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the rollout checklist, completed vertical slices, v0.2.0 delivery notes, and the clinical operations roadmap.

## Deployment

### GitHub Pages

Production builds deploy automatically to GitHub Pages on every push to `main` (workflow: `.github/workflows/deploy-pages.yml`).

**Live URL:** https://benmidwinter.github.io/ChromaKit/

**One-time setup** (if Pages is not already on the `gh-pages` branch):

1. Repo → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Branch: **`gh-pages`** / **`/`** (root) → Save

After that, every push to `main` builds the Vite production bundle and publishes it to `gh-pages`. The site root is `/ChromaKit/`; Vite `base` and React Router `basename` are set only for that Pages build (`GITHUB_PAGES=1`).

### Local production build

```bash
npm run build
npm run preview
```

Also configured for [Vercel](https://vercel.com) as a static SPA (`vercel.json` rewrites all routes to `index.html`).

## License

Private — all rights reserved.
