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
| Zod write validation | `parseOrThrow` at mutation entry | `src/lib/schemas.js`, `src/lib/store/{clientRecords,scheduling,clinicalDocs}.js` |
| Service Lead folder | Move domain to `src/features/<name>/`, fix imports | `src/features/service-lead/` |
| Service Lead Tailwind shell | Theme-aware utilities; delete superseded CSS | `ServiceLeadLayout.jsx`, `ServiceLeadNav.jsx` |
| CSS platform | Token bridge + layered partials | `src/styles/tokens.css`, `src/index.css` |
| Toast / dialog UX | `useToast`, `useConfirm`, `usePrompt` | `src/components/ui/` |
| Inline validation pilot | Field errors + clear-on-change | `src/components/AddClient.jsx` |
| TypeScript pilot | Strict `.ts` for pure lib modules | `commaTags.ts`, `serviceColors.ts`, `permissions.ts` |
| Vitest | Pure `lib/` unit tests | `src/lib/*.test.js`, `npm test` |

---

## Master rollout checklist

Status key: `[x]` done · `[~]` partial · `[ ]` not started

### Platform (global)

- [x] Split monolithic `index.css` into `src/styles/*` partials
- [x] Bridge design tokens into Tailwind `@theme` (`tokens.css`)
- [x] Import legacy CSS into `@layer components` (utilities override safely)
- [x] Store barrel + thin `collections.js` data layer
- [x] Vitest + 83 unit tests on pure `lib/` functions
- [x] Replace all native `alert()` / `confirm()` / `prompt()` with toast/dialog providers
- [x] `npm run typecheck` script (strict TS on `.ts` files only)

### Pillar 1 — Encapsulation

- [~] Feature folders — **Service Lead only** (`src/features/service-lead/`, 11 files)
- [ ] Feature folder: `features/client/` (PatientProfile, panels, appointments, notes)
- [ ] Feature folder: `features/calendar/`
- [ ] Feature folder: `features/workplace/`
- [ ] Feature folder: `features/home/` (dashboards, active cases)
- [ ] Feature folder: `features/profile/` (promote `components/profile/`)
- [~] Tailwind component migration — **Service Lead shell/nav only**
- [ ] Tailwind: remaining Service Lead screens (see Phase A)
- [ ] Tailwind: shared shells (`PageHeader`, `RecordListLayout`, `RecordTable`)
- [ ] Tailwind: client workspace
- [ ] Tailwind: calendar module
- [ ] Tailwind: rich-text / doc editor chrome

### Pillar 2 — Unidirectional data flow

- [~] TanStack Query — **clients + workplace contexts** in `AppLayout`
- [ ] Query slice: appointments (`CalendarModule`, `ClientAppointmentsIndex`, `UpcomingAppointments`)
- [ ] Query slice: progress notes (`ProgressNotesPage`, `NotesHistoryPanel`)
- [ ] Query slice: workplace / team (`Workplace`, `WorkplaceTeamMember`)
- [ ] Query slice: org templates (Service Lead template list screens)
- [ ] Audit Outlet context — remove redundant props as hooks replace them (per domain, not big-bang)

### Pillar 3 — Headless core logic

- [~] TypeScript — **3 modules** (`commaTags`, `serviceColors`, `permissions`)
- [ ] TypeScript: `dateArchitecture`, `appointmentUtils`, `mergeFields`, `clinicalProfile`, `schemas`
- [ ] TypeScript: remaining `lib/` (then `lib/store/` domain modules)
- [ ] Store domain unit tests (selectors/filters after typing)

### Pillar 4 — Defensive boundaries

- [~] Zod at writes — clients, appointments, progress notes, working docs, letters
- [ ] Zod: progress note / letter **templates**
- [ ] Zod: organisation mutations (workplaces, services, memberships)
- [ ] Zod: journal entries, clinical profile / details updates
- [~] Error boundaries — root, route (`AppLayout`), `Calendar` page
- [ ] Error boundaries: `ProgressNotesPage`, `BodyMap`, `CalendarModule`, `RichTextEditor`
- [~] Inline form validation — **AddClient only**
- [ ] Inline validation: `AppointmentEditor`, `ClientDetailsEditModal`, `ClientProfileOverlay`, Service Lead template editors

---

## Phase A — execution plan

**Goal:** Finish the lowest-risk, highest-leverage work inside existing boundaries before opening new feature folders or Query domains.

**Duration estimate:** 3–5 focused sessions  
**Exit criteria:** Service Lead fully on Tailwind utilities (panel CSS removed), five more `lib/` modules typed, four forms using inline validation pattern.

---

### A1 — Complete Service Lead Tailwind migration

**Why first:** Pilot shell/nav already works; remaining files share repeated `.service-lead-panel*` classes. CSS is isolated in `rbac-workspace.css` and `dashboards.css`.

**Reference implementation:** `ServiceLeadLayout.jsx`, `ServiceLeadNav.jsx`

**Theme-aware utilities to use:**

| Intent | Utility |
| --- | --- |
| Page / panel background | `bg-page`, `bg-surface` |
| Body / muted text | `text-ink`, `text-subtle` |
| Headings / accent | `text-accent` |
| Borders | `border-line`, `border-line-light`, `border-b-primary` |
| Spacing | `px-7` (= `--space-inline`), `py-*`, `gap-*` |

**Order of work (one PR-sized step each):**

| Step | Component(s) | CSS to remove after |
| --- | --- | --- |
| A1.1 | Extract shared **`ServiceLeadPanel`** wrapper (header + section + title) used by all tab screens | `.service-lead-panel*` in `rbac-workspace.css` |
| A1.2 | `ServiceLeadOverview.jsx` | `.lead-dashboard*` in `dashboards.css` (overview-specific blocks only) |
| A1.3 | `ServiceLeadWorkplaces.jsx`, `ServiceLeadUsers.jsx` | Any list/table overrides tied to service-lead |
| A1.4 | `ServiceLeadServices.jsx` | `.svc-type-picker*`, `.svc-color-picker*`, `.svc-list*`, `.svc-card*` in `dashboards.css` |
| A1.5 | `ServiceLeadNoteTemplates.jsx`, `ServiceLeadLetterTemplates.jsx`, `ServiceLeadOutcomeForms.jsx` | Remaining panel list styles |
| A1.6 | `ServiceLeadNoteTemplateEditor.jsx`, `ServiceLeadLetterTemplateEditor.jsx` | Editor header/actions in panel CSS |

**Per-step procedure:**

1. Read component + grep matching rules in `src/styles/{rbac-workspace,dashboards}.css`.
2. Replace BEM classes with Tailwind utilities (keep `text-muted` / `text-small` globals where they still exist).
3. For complex widgets (service type picker, colour swatches), either:
   - migrate to utilities + arbitrary values, or
   - leave a **minimal** scoped class block in CSS with a `/* tailwind-migration: deferred */` comment if `:has()` / state styling is fragile.
4. Switch persona to **Ben — Service Lead**; smoke-test the tab at `http://localhost:5180/service-lead/*`.
5. Toggle **Light Chroma** and **Dark Studio** — confirm colours follow theme.
6. Run `npm run build`.

**Definition of done (A1):**

- [ ] All 11 Service Lead components use Tailwind for layout/shell (editors may keep doc-editor CSS).
- [ ] `.service-lead-panel*` block deleted from `rbac-workspace.css`.
- [ ] Service-specific blocks in `dashboards.css` deleted or marked deferred with ticket.
- [ ] Visual parity confirmed in two themes.

---

### A2 — TypeScript the next tested `lib/` modules

**Why second:** Zero UI risk; tests already document behaviour. Extends the `permissions.ts` pattern.

**Order (dependencies first):**

| Step | File | Depends on | Existing tests |
| --- | --- | --- | --- |
| A2.1 | `dateArchitecture.js` → `.ts` | — | `dateArchitecture.test.js` |
| A2.2 | `appointmentUtils.js` → `.ts` | dateArchitecture | `appointmentUtils.test.js` |
| A2.3 | `commaTags` | already `.ts` | ✓ |
| A2.4 | `clinicalProfile.js` → `.ts` | commaTags | `clinicalProfile.test.js` |
| A2.5 | `mergeFields.js` → `.ts` | — | `mergeFields.test.js` |
| A2.6 | `schemas.js` → `.ts` | mockData enums | `schemas.test.js` |

**Per-step procedure:**

1. Rename `.js` → `.ts`; add minimal exported types (prefer inferred return types where obvious).
2. Fix any `strict` issues (`noImplicitAny`, null checks) — do **not** widen types to `any`.
3. Run `npm test` and `npm run typecheck`.
4. Leave `.jsx` consumers unchanged (Vite resolves `.ts` automatically).

**Definition of done (A2):**

- [ ] Six additional modules typed (8 total including existing three).
- [ ] `npm run typecheck` clean.
- [ ] `npm test` — 83+ tests passing.

**Optional CI hook (recommended after A2):** add `"typecheck"` to pre-push or GitHub Actions alongside `test` + `build`.

---

### A3 — Inline validation on high-traffic forms

**Why third:** `AddClient.jsx` is the template; other forms still use toast-only for missing required fields.

**Reference implementation:** `src/components/AddClient.jsx` (`errors` state, `clearError`, `aria-invalid`, form banner, toast for server/Zod errors).

| Step | Form | Validations to inline | Keep as toast |
| --- | --- | --- | --- |
| A3.1 | `AppointmentEditor.jsx` | session date, time, duration | session unavailable, save errors |
| A3.2 | `ClientDetailsEditModal.jsx` | (optional: required clinical fields if added) | Zod/store errors |
| A3.3 | `ClientProfileOverlay.jsx` | — | save success + errors |
| A3.4 | `ServiceLeadNoteTemplateEditor.jsx` | template name required | save errors |
| A3.5 | `ServiceLeadLetterTemplateEditor.jsx` | template name required | save errors |

**Per-step procedure:**

1. Add `const [errors, setErrors] = useState({})` and `clearError(field)`.
2. Replace pre-submit `toast.error('…required')` with `setErrors({ field: '…' })`.
3. Render `{errors.field && <p className="mt-1 text-[0.8rem] text-secondary">…</p>}` under inputs.
4. Set `aria-invalid={!!errors.field}`; use `noValidate` on `<form>` if removing native validation.
5. Keep `toast.success` on successful save where navigation doesn't already confirm.
6. Manual test: submit empty → inline errors; fix field → error clears; invalid server payload → toast.

**Definition of done (A3):**

- [ ] Five forms migrated.
- [ ] No new native `alert()` / `confirm()` introduced.
- [ ] Accessible invalid states on all migrated inputs.

---

## Phase A — suggested session breakdown

| Session | Focus | Deliverable |
| --- | --- | --- |
| **1** | A1.1 + A1.2 | `ServiceLeadPanel` component; Overview on Tailwind |
| **2** | A1.3 + A1.4 | Workplaces, Users, Services on Tailwind |
| **3** | A1.5 + A1.6 | Template lists + editors on Tailwind; delete panel CSS |
| **4** | A2.1 – A2.3 | `dateArchitecture`, `appointmentUtils` typed |
| **5** | A2.4 – A2.6 + A3.1 | Remaining lib TS; `AppointmentEditor` inline errors |
| **6** | A3.2 – A3.5 | Remaining forms; Phase A sign-off |

---

## Verification commands (run after every slice)

```bash
npm run build
npm test
npm run typecheck   # after any .ts change
npm run lint        # optional; fix only new issues in touched files
```

**Manual smoke personas:**

- **Daniel — Clinical Lead** — client add/edit, appointments, home dashboard
- **Ben — Service Lead** — all `/service-lead/*` tabs, both Light Chroma and Dark Studio themes

---

## After Phase A — next phases (preview)

| Phase | Focus |
| --- | --- |
| **B** | Feature folders (`features/client/` first) |
| **C** | TanStack Query (`useAppointmentsQuery` vertical slice) |
| **D** | Tailwind on shared shells + client workspace |
| **E** | Remaining Zod writes, error boundaries, store tests |

Update this file as items complete — change `[ ]` → `[x]` and add completion notes inline if useful.
