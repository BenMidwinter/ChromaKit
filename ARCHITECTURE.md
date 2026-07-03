# ChromaKit — Architecture Rollout Tracker

Living checklist for incremental adoption of the four-pillar design philosophy. Work **one vertical slice at a time** — prove the pattern in one feature, then roll forward.

## Design pillars

1. **Radical encapsulation** — feature folders, co-located concerns, theme-aware Tailwind over global CSS bleed.
2. **Unidirectional data flow** — server state (TanStack Query) separate from UI state; derive, don't duplicate.
3. **Headless core logic** — pure functions in `lib/`, typed and tested, framework-agnostic.
4. **Defensive boundaries** — Zod at write seams, error boundaries, inline/toast UX (no native dialogs).

---

## Vertical slices completed (reference patterns)

| Slice | Pattern to copy | Key files |
| --- | --- | --- |
| Clients & memberships Query | Facade hooks + cache invalidation; Outlet API unchanged | `src/lib/queries.js`, `src/components/AppLayout.jsx` |
| Store split | `collections.js` + domain modules + `store.js` barrel | `src/lib/data/`, `src/lib/store/` |
| Zod write validation | `parseOrThrow` at mutation entry | `src/lib/schemas.ts`, `src/lib/store/{clientRecords,scheduling,clinicalDocs,organisation,templates}.js` |
| Service Lead folder | Move domain to `src/features/<name>/`, fix imports | `src/features/service-lead/` |
| Service Lead shell + blocks | `PageHeader`, grouped nav, `OrgConfigBlock`, `role-block` chrome | `ServiceLeadLayout.jsx`, `blocks/`, `home-calendar.css` |
| Home / workplace role blocks | Stacked `RoleBlockShell`, headless `homeBlocks.js` | `src/components/home/`, `src/lib/roleBlocks.js` |
| Service Lead org queries (SL-B5) | TanStack Query + Zod for org config mutations | `src/lib/orgQueries.js` |
| CSS platform | Token bridge + layered partials | `src/styles/tokens.css`, `src/index.css` |
| Toast / dialog UX | `useToast`, `useConfirm`, `usePrompt` | `src/components/ui/` |
| Inline validation | Field errors + clear-on-change | `AddClient.jsx`, `AppointmentEditor.jsx`, template editors, client modals |
| TypeScript pilot | Strict `.ts` for pure lib modules | `commaTags.ts`, `serviceColors.ts`, `permissions.ts`, `dateArchitecture.ts`, `appointmentUtils.ts`, `clinicalProfile.ts`, `mergeFields.ts`, `schemas.ts` |

---

## Master rollout checklist

Status key: `[x]` done · `[~]` partial · `[ ]` not started

### Platform (global)

- [x] Split monolithic `index.css` into `src/styles/*` partials
- [x] Bridge design tokens into Tailwind `@theme` (`tokens.css`)
- [x] Import legacy CSS into `@layer components` (utilities override safely)
- [x] Store barrel + thin `collections.js` data layer
- [x] Vitest + unit tests on pure `lib/` functions (run `npm test` locally after `npm install`)
- [x] Replace all native `alert()` / `confirm()` / `prompt()` with toast/dialog providers
- [x] `npm run typecheck` script (strict TS on `.ts` files only)

### Pillar 1 — Encapsulation

- [~] Feature folders — **Service Lead** (`src/features/service-lead/`, 11 files); home/workplace block components co-located under `components/home|workplace/`
- [x] Feature folder: `features/client/` (PatientProfile, panels, appointments, notes)
- [x] Feature folder: `features/calendar/` (`CalendarPage`, `CalendarModule`)
- [ ] Feature folder: `features/workplace/` (promote from `components/workplace/`)
- [ ] Feature folder: `features/home/` (promote from `components/home/`)
- [ ] Feature folder: `features/profile/` (promote `components/profile/`)
- [x] Service Lead screens — unified shell (`PageHeader` + grouped nav + `OrgConfigBlock` / overview blocks)
- [x] Tailwind: shared shells (`PageHeader`, `RecordListLayout`, `RecordTable`)
- [x] Tailwind: client workspace (`PatientProfile`, `ClientNav`, `ClientDetailsBar`)
- [x] Tailwind: calendar module header/toolbar (`PageHeader` + utility toolbar in `CalendarModule`)
- [ ] Tailwind: rich-text / doc editor chrome
- [~] Service Lead service catalogue widgets — `.svc-*` in `dashboards.css` (deferred; tagged in CSS)

### Pillar 2 — Unidirectional data flow

- [~] TanStack Query — **clients + workplace contexts** in `AppLayout`; **org config + overview** in `orgQueries.js`; **appointments** in `appointmentQueries.js`; **progress notes** in `progressNoteQueries.js`; **workplace team** in `workplaceQueries.js`
- [x] Query slice: appointments (`CalendarModule`, `ClientAppointmentsIndex`, `UpcomingAppointments`, `AppointmentEditor`)
- [x] Query slice: progress notes (`ProgressNotesPage`, `NotesHistoryPanel`)
- [x] Query slice: workplace / team (`WorkplaceDashboard`, `WorkplaceTeamMember`, join/invite panels)
- [ ] Audit Outlet context — remove redundant props as hooks replace them (per domain, not big-bang)

### Pillar 3 — Headless core logic

- [x] TypeScript — **8 modules** (`commaTags`, `serviceColors`, `permissions`, `dateArchitecture`, `appointmentUtils`, `clinicalProfile`, `mergeFields`, `schemas`)
- [ ] TypeScript: remaining `lib/` (then `lib/store/` domain modules)
- [x] Store domain unit tests (selectors/filters after typing) — `journal`, `scheduling`, `clientRecords`

### Pillar 4 — Defensive boundaries

- [x] Zod at writes — clients, appointments, progress notes, working docs, letters
- [x] Zod: progress note / letter **templates** + organisation mutations (workplaces, users, services)
- [x] Zod: journal entries, clinical profile / details updates
- [x] Error boundaries — root, route (`AppLayout`), `Calendar`, `ProgressNotesPage`, `BodyMap`, `CalendarModule` panes, `RichTextEditor`
- [x] Inline form validation — **AddClient**, **AppointmentEditor**, **ClientDetailsEditModal**, **ClientProfileOverlay**, Service Lead template editors

---

## Phase A — execution plan

**Goal:** Finish the lowest-risk, highest-leverage work inside existing boundaries before opening new feature folders or Query domains.

**Status:** **[x] Complete** (branch `phase-a-rollout`)

**Exit criteria (met):**

- Service Lead on unified shell + block chrome; legacy `.service-lead-panel*` and `.lead-dashboard*` CSS removed; monolithic `LeadDashboard.jsx` deleted
- Eight `lib/` modules typed; `npm run typecheck` targets them
- Five high-traffic forms use inline validation (plus `AddClient` reference)

---

### A1 — Service Lead presentation migration

**Outcome:** Service Lead no longer uses the legacy panel/dashboard layout. SL-B delivered `PageHeader`, grouped nav, `OrgConfigBlock`, and overview `role-block` stack instead of a pure-Tailwind rewrite — same information architecture, shared chrome with Home/Workplace.

| Item | Status |
| --- | --- |
| `PageHeader` + `ServiceLeadNav` shell | [x] |
| Config routes on `OrgConfigBlock` / `role-block__panel` | [x] |
| Overview on `ServiceLeadDashboard` blocks | [x] |
| Delete `.service-lead-panel*` | [x] |
| Delete `.lead-dashboard*` + `LeadDashboard.jsx` | [x] |
| `.svc-*` service picker (deferred) | [~] tagged in `dashboards.css` |

---

### A2 — TypeScript the next tested `lib/` modules

| Module | Status |
| --- | --- |
| `dateArchitecture.ts` | [x] |
| `appointmentUtils.ts` | [x] |
| `commaTags.ts` | [x] |
| `clinicalProfile.ts` | [x] |
| `mergeFields.ts` | [x] |
| `schemas.ts` | [x] |
| `permissions.ts` | [x] |
| `serviceColors.ts` | [x] |

**Definition of done:** [x] Eight modules typed · run `npm run typecheck` after `npm install`

---

### A3 — Inline validation on high-traffic forms

| Form | Status |
| --- | --- |
| `AddClient.jsx` | [x] |
| `AppointmentEditor.jsx` | [x] date + duration |
| `ClientDetailsEditModal.jsx` | [x] form banner on store errors |
| `ClientProfileOverlay.jsx` | [x] form banner on store errors |
| `ServiceLeadNoteTemplateEditor.jsx` | [x] template name |
| `ServiceLeadLetterTemplateEditor.jsx` | [x] template name |

**Definition of done:** [x]

---

## Verification commands (run after every slice)

```bash
npm install          # if node_modules incomplete
npm run build
npm test
npm run typecheck   # after any .ts change
npm run lint        # optional; fix only new issues in touched files
```

**Manual smoke personas:**

- **Ben — Clinical Lead** — client add/edit, appointments, home dashboard
- **Daniel — Service Lead** — all `/service-lead/*` tabs, both Light Chroma and Dark Studio themes

---

## After Phase A — next phases

| Phase | Focus |
| --- | --- |
| **B** | Feature folders (`features/client/` first) |
| **C** | TanStack Query (`appointmentQueries.js` — calendar, client list, upcoming, editor) |
| **D** | Tailwind on shared shells + client workspace + calendar toolbar |
| **E** | Remaining Zod writes, error boundaries, store tests |

Update this file as items complete — change `[ ]` → `[x]` and add completion notes inline if useful.

---

## Sub-project: Service Lead organisation blocks (SL-B)

**Goal:** Apply the Home/Workplace **stacked block** visual language to Service Lead — aggregate-first, de-identified overview, shared `role-block` chrome.

**Status:** **[x] Complete** (all phases SL-B1–SL-B5)

### SL-B phases

| Phase | Scope | Status |
| --- | --- | --- |
| **SL-B1** | Overview blocks + `serviceLeadBlocks.js` | [x] done |
| **SL-B2** | `PageHeader` in `ServiceLeadLayout`, nav paired with header | [x] done |
| **SL-B3** | Config routes → `OrgConfigBlock` panels; delete `.service-lead-panel*` | [x] done |
| **SL-B4** | Nav grouping + overview deep links to config routes | [x] done |
| **SL-B5** | `orgQueries.js` + Zod for org mutations; expanded unit tests | [x] done |

**Note:** `buildLeadDashboard` in `leadDashboard.js` remains the compute engine for org aggregates; only the monolithic `LeadDashboard.jsx` UI was retired.
