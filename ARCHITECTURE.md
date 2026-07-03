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
| Clients & memberships Query | Facade hooks + `AppSessionProvider`; client routes pass `{ client }` only | `src/lib/queries.ts`, `src/lib/AppSessionContext.tsx` |
| Store split | `collections.js` + domain modules + `store.js` barrel | `src/lib/data/`, `src/lib/store/` |
| Zod write validation | `parseOrThrow` at mutation entry | `src/lib/schemas.ts`, `src/lib/store/{clientRecords,scheduling,clinicalDocs,organisation,templates}.js` |
| Service Lead folder | Move domain to `src/features/<name>/`, fix imports | `src/features/service-lead/` |
| Service Lead shell + blocks | `PageHeader`, grouped nav, `OrgConfigBlock`, `role-block` chrome | `ServiceLeadLayout.jsx`, `blocks/`, `home-calendar.css` |
| Home / workplace role blocks | Stacked `RoleBlockShell`, headless `homeBlocks.js` | `src/features/home/`, `src/lib/roleBlocks.js` |
| Service Lead org queries (SL-B5) | TanStack Query + Zod for org config mutations | `src/lib/orgQueries.js` |
| CSS platform | Token bridge + layered partials | `src/styles/tokens.css`, `src/index.css` |
| Toast / dialog UX | `useToast`, `useConfirm`, `usePrompt` | `src/components/ui/` |
| Inline validation | Field errors + clear-on-change | `AddClient.jsx`, `AppointmentEditor.jsx`, template editors, client modals |
| TypeScript pilot | Strict `.ts` for pure lib modules | `commaTags.ts`, `serviceColors.ts`, `permissions.ts`, `dateArchitecture.ts`, `appointmentUtils.ts`, `clinicalProfile.ts`, `mergeFields.ts`, `schemas.ts` |
| TypeScript migration | Remaining `lib/` + store domain modules | See `src/lib/types/collections.ts`; `tiptapExtensions.ts` uses `@ts-nocheck` for TipTap command surface |

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

- [x] Feature folders — **client**, **calendar**, **service-lead**, **home**, **workplace**, **profile** under `src/features/`
- [x] Feature folder: `features/client/` (PatientProfile, panels, appointments, notes)
- [x] Feature folder: `features/calendar/` (`CalendarPage`, `CalendarModule`)
- [x] Feature folder: `features/workplace/` (`WorkplacePage`, dashboard, team panels)
- [x] Feature folder: `features/home/` (`HomePage`, role blocks)
- [x] Feature folder: `features/profile/` (`ProfileLayout`, details, journal)
- [x] Clinician profile — stacked `role-block` hub: identity, workplace membership, private letterhead; journal route uses `profile_journal` block
- [x] Service Lead screens — unified shell (`PageHeader` + grouped nav + `OrgConfigBlock` / overview blocks)
- [x] Tailwind: shared shells (`PageHeader`, `RecordListLayout`, `RecordTable`)
- [x] Tailwind: client workspace (`PatientProfile`, `ClientNav`, `ClientDetailsBar`)
- [x] Tailwind: calendar module header/toolbar (`PageHeader` + utility toolbar in `CalendarModule`)
- [x] Tailwind: rich-text / doc editor chrome (toolbar/canvas/sheet via editor theme tokens; ProseMirror prose stays in CSS)
- [~] Service Lead service catalogue widgets — `.svc-*` in `dashboards.css` (deferred; tagged in CSS)

### Pillar 2 — Unidirectional data flow

- [~] TanStack Query — **clients** via `useAppClients()` + `useClientsQuery`; **workplace contexts** in `AppLayout`; **org config + overview** in `orgQueries.ts`; **appointments** in `appointmentQueries.ts`; **progress notes** in `progressNoteQueries.ts`; **workplace team** in `workplaceQueries.ts`
- [x] Query slice: appointments (`CalendarModule`, `ClientAppointmentsIndex`, `UpcomingAppointments`, `AppointmentEditor`)
- [x] Query slice: progress notes (`ProgressNotesPage`, `NotesHistoryPanel`)
- [x] Query slice: workplace / team (`WorkplaceDashboard`, `WorkplaceTeamMember`, join/invite panels)
- [x] App session context — `AppSessionProvider` + `useAppSession()` replace fat `Outlet` context; nested client routes pass `{ client }` only
- [x] Further trim — list screens use `useAppClients()`; `clients` removed from `AppSessionProvider` value

### Pillar 3 — Headless core logic

- [x] TypeScript — **8 pilot modules** (`commaTags`, `serviceColors`, `permissions`, `dateArchitecture`, `appointmentUtils`, `clinicalProfile`, `mergeFields`, `schemas`)
- [x] TypeScript migration — remaining `lib/` pure modules, Query hooks, `data/collections.ts`, and `lib/store/*` domain modules (`.ts`); `mockData.js` and store barrel remain JS
- [x] Headless modules: `clinicianAvailability.ts`, `workplaceBranding.ts`, `progressNoteLifecycle.ts` + unit tests
- [x] Store domain unit tests (selectors/filters after typing) — `journal`, `scheduling`, `clientRecords`, `clinicianAvailability`, `workplaceBranding`, `progressNoteLifecycle`

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
| **B** | Feature folders (`features/client/` first) — [x] |
| **C** | TanStack Query (`appointmentQueries.js` — calendar, client list, upcoming, editor) — [x] |
| **D** | Tailwind on shared shells + client workspace + calendar toolbar — [x] |
| **E** | Remaining Zod writes, error boundaries, store tests — [x] |
| **F** | Structured forms platform (Option B) + promote remaining feature folders + trim session context — [~] folders promoted; forms platform not started |

### Product & UX — tracked for later

| Item | Notes | Status |
| --- | --- | --- |
| **Clinician profile redesign** | `/profile` stacked **`role-block`** hub: identity (photo, job title, professional title, biography, handwritten signature upload + printed name), workplace membership, per-location **availability** (hours + org services with overlap resolution), private-practice letterhead. Team member view shows professional title. | [x] |
| **Workplace branding** | Clinical leads edit workplace letterhead on `/workplace` (**Workplace information** block). `getClinicalExportBranding(workplaceId, clinicianUserId)` — workplace branding when in org context, else private-practice profile branding, else ChromatiK default. Used on progress-note and letter exports. | [x] |
| **Progress notes lifecycle** | Draft / complete status; notes history column + filter; explicit save & sign-off (no auto-save on navigate); locked notes after sign-off. Export via hidden iframe + print dialog (pop-up blocker safe). | [x] |
| **Rich-text signature module** | Toolbar **Signature** menu: handwrite on canvas, use account signature image, or script-font typed sign-off. `SignatureBlock` in TipTap shows image/script + name + professional title · HCPC. | [x] |
| **Calendar booking** | Appointment **Other info** field (stored as `other_info`) shown inside duration-sized calendar blocks. Clinical leads and administrators choose **Book with** clinician when scheduling workplace clients (calendar panel + client appointment editor). | [x] |
| **Direct PDF export** | Progress notes and letters currently open the **browser print dialog** (“Save as PDF”). Replace with a **direct download** pipeline so exports omit the printed URL/footer, embed workplace/practice fonts consistently, and feel like a finished clinical document. Print-via-iframe is acceptable for now. | [ ] |

Update this file as items complete — change `[ ]` → `[x]` and add completion notes inline if useful.

---

## Master roadmap — clinical operations & financial engine (offline skeleton)

**Context:** Long-horizon product track for ChromatiK as a **clinical operations and financial engine** — multi-tenant waitlists, scoped intake routing, and polymorphic invoicing. Builds on the existing store layer (`lib/store/`, `data/collections`, TanStack Query facades), not a parallel state tree.

**Goal:** Track and execute **multi-tenant automated waitlists** and **advanced polymorphic invoicing** without cross-workplace data leakage.

**Status:** **[ ] Not started** (roadmap only)

**Related:** Phase F structured forms (Option B) is the likely intake/referral capture substrate; funding modes intersect with appointments (`scheduling`), episodes (`clientRecords`), and calendar drawer UI.

### Roadmap Phase 1 — Multi-tenant automated waitlist & intake engine

- [ ] **1.1 Update workplace state structure**
  Expand `db.workplaces` / workplace seed data beyond branding and join codes. Each workplace record should include:
  - `id` — unique identifier (e.g. `wp-st-judes`)
  - `name` — institutional partner name (e.g. *St Jude's School*)
  - `referralSlug` — unique, secure routing string for public intake entry points
  - `waitlist` — isolated array of triage client records, scoped to that workplace portfolio (not a global client table leak)
- [ ] **1.2 Implement scoped “smart scan” routing logic**
  Headless utility in the store layer that intercepts raw referral-form submissions:
  - **Extract:** first name + last name + date of birth *or* postcode
  - **Constraint:** lookup runs *only* within the active workplace (`myWorkplace.id`); no cross-tenant visibility
  - **Branch A — match found:** do not duplicate the client profile; surface an active notification banner (“Existing client detected”), auto-initialise a fresh **episode**, and map new referral variables into that client’s episodic workspace
  - **Branch B — no match:** provision a new client profile with explicit status `Waitlist`, attached locally to that workplace portfolio
- [ ] **1.3 Scaffold waitlist dashboard view**
  Reuse `RecordListLayout` / `RecordTable` (or equivalent high-density grid) for an admin-facing waitlist control panel filtered by `myWorkplace.id`. Columns/headers for prioritisation, funding classification, and geographical tags.

### Roadmap Phase 2 — Polymorphic invoicing & funding allocation engine

- [ ] **2.1 Extend client / episode schema for funding structure modes**
  Extend client and episode records to accept `fundingSource: 'PAYG' | 'SLA' | 'Advance'`, plus supporting fields: `advanceBalance: number`, `parentPayerId: string | null`.
- [ ] **2.2 Mode A — Pay-as-you-go (PAYG) line-item automation**
  Wire store handlers to calendar drawer / appointment completion flows. When attendance moves to **Completed**, auto-generate a draft invoice line item assigned to the private client or insurer.
- [ ] **2.3 Mode B — Service-level agreement (SLA / institutional blocks)**
  - Map patient profiles as child entities under a corporate or institutional **parent payer** container (e.g. a school profile acting as payer)
  - On session log for a child under an SLA wrapper: force line items to read *SLA Cover — £0 billable to client*
  - Background utilisation ledger: aggregate practitioner delivery hours against the contract container for monthly cross-referenced reports and LA/board invoices
- [ ] **2.4 Mode C — Advance funding & drawdown safeties (“invoice in advance”)**
  - Support an explicit `invoiceInAdvance` flag on cases
  - Virtual wallet ledger for upfront blocks (e.g. LA grant of £2,500)
  - Real-time session cost computation: on appointment completion, subtract session fee from remaining balance
  - **Financial integrity indicator** in `AppointmentDrawer`: if a scheduled or completed session would breach remaining drawdown, flash warning state and block further bookings unless an admin role authorises override

### Roadmap Phase 3 — UI & drawer prerequisite interlocks

- [ ] **3.1 Upgrade `AppointmentDrawer` state queries**
  Extend the polymorphic drawer / `InfoRow` template to evaluate an appointment’s active funding-tracking properties (mode, balance, payer linkage, billing lock state).
- [ ] **3.2 Contextual task evaluation checks**
  Drawer UI should reflect structural block conditions:
  - **View note** link with `Draft` / `Finalised` badge when a clinical session note exists
  - Billing compile readiness vs lock-down when conditional tasks are incomplete (note missing, outcome form pending, drawdown breach, etc.)

---

## Phase F — structured forms platform (Option B)

**Goal:** Scalable capture (intake, referral, consent) and instrument (outcome measures) forms without a new Zod schema per form. Report on **field content**, not just submission counts.

**Status:** **[ ] Not started** (roadmap only)

### Design choice: Option B — JSON blueprint + normalized answer facts

Rejected for now: **Option C (EAV / clinical facts layer)** — likely superseded by AI extraction APIs rather than hand-maintained fact tables.

| Layer | Responsibility |
| --- | --- |
| `form_definitions` | Org/workplace form blueprints: `direction` (`capture` \| `instrument`), `fields_json`, optional `scoring_json`, version |
| `form_submissions` | Envelope: client, episode, appointment, author, `answers_jsonb`, optional `computed_jsonb` (scores) |
| `form_submission_values` | Denormalized facts for reporting: `field_key`, typed columns (`value_text`, `value_number`, …), workplace/client/date |

**Validation:** one fixed `formSubmissionEnvelopeSchema` (Zod) + runtime `validateFormAnswers(definition, answers)` — no per-form compile-time schemas.

**Directions:**

- **Capture (get)** — intake, referral, consent; post-submit hooks merge into clinical profile / alerts.
- **Instrument (give)** — SDQ, GAD-7, custom scales; post-submit computes scores into `computed_jsonb` + fact rows.

### F phases (planned)

| Phase | Scope | Status |
| --- | --- | --- |
| **F1** | Headless store: definitions, submissions, dual-write to `form_submission_values`; envelope Zod + runtime field validator | [ ] |
| **F2** | Replace hardcoded `intakeForm.js` with first capture form + submission adapter | [ ] |
| **F3** | Service Lead form builder (`ServiceLeadOutcomeForms`) — CRUD definitions | [ ] |
| **F4** | Generic `FormRenderer` on client `/forms` and `/outcomes` routes | [ ] |
| **F5** | Reporting hooks in `leadDashboard` / Service Lead blocks (field-level SQL) | [ ] |

### F0 — feature folders + session context (encapsulation)

| Item | Status |
| --- | --- |
| Promote `components/home/` → `features/home/` | [x] |
| Promote `components/workplace/` → `features/workplace/` | [x] |
| Promote `components/profile/` → `features/profile/` | [x] |
| `AppSessionProvider` + `useAppSession()` replace app-wide `Outlet` context | [x] |
| Client nested routes pass `{ client }` via Outlet only | [x] |

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

---

## Recent delivery notes (v0.2.0)

Consolidated changelog for the profile, workplace, notes, and calendar work landed on `main` after Phase A–E.

### Profile & team (`features/profile/`)

| Area | Implementation |
| --- | --- |
| Identity block | Photo URL, full name, HCPC, **job title** (organisational role) vs **professional title** (clinical qualifications), biography |
| Signature | Handwritten image upload (`signature_image_url`), printed name fallback (`signature_text`) |
| Availability | Location picker; working hours left / services offered right; `applyDayHoursWithOverlapResolution` — latest edit wins on overlap |
| Private practice | Letterhead panel (`practice_*` fields) for solo export branding |
| Team profile | `WorkplaceTeamMember` shows job title, professional title, hours, offered services |

### Workplace (`features/workplace/`)

| Area | Implementation |
| --- | --- |
| Layout | **Workplace information** (branding) beside **Team operations**; stacks below 900px |
| Branding | `WorkplaceBrandingPanel` — editable by clinical leads; persisted on `db.workplaces` |
| Join / invite | Tighter action rows; per-result role selector |

### Progress notes & exports

| Area | Key files |
| --- | --- |
| Lifecycle | `progressNoteLifecycle.ts` — draft, complete, sign-off lock |
| History | `NotesHistoryPanel` — status column + filter |
| Editor | `SignatureMenu.jsx`, `SignaturePad.jsx`, `tiptapExtensions.ts` (`SignatureBlock`) |
| Export | `clinicalExport.ts` — `getClinicalExportBranding`, iframe print |

### Scheduling & calendar

| Area | Implementation |
| --- | --- |
| Other info | `other_info` on appointments; `appointmentOtherInfo()`; shown in `EventChip` calendar blocks |
| Clinician assignment | `canAssignAppointmentClinician` — clinical leads + administrators for workplace clients; `ScheduleSessionPanel` **Book with** dropdown |
| Schema | `appointmentInputSchema` includes `other_info`, `clinician_id` |

### App session & queries

- `AppSessionContext.tsx` — session, workplaces, persona; client routes pass `{ client }` only
- Query facades: `appointmentQueries.ts`, `progressNoteQueries.ts`, `workplaceQueries.ts`, `orgQueries.ts`
