/**
 * ChromaKit seed data — replace with a real backend when ready.
 * All records use plain text (no encryption).
 */

/**
 * Canonical demo persona → store user mapping.
 * Persona switcher labels/roles live in demoPersonas.js; user ids and memberships live here.
 */
export const DEMO_PERSONA_ACCOUNTS = {
  ben: {
    userId: 'user-ben',
    name: 'Ben',
    serviceLead: false,
    memberships: [
      { workplace_id: 'wp-chroma', role: 'clinical_lead' },
      { workplace_id: 'wp-east', role: 'clinical_lead' },
    ],
  },
  sarah: {
    userId: 'user-sarah',
    name: 'Sarah',
    serviceLead: false,
    memberships: [
      { workplace_id: 'wp-chroma', role: 'clinician' },
      { workplace_id: 'wp-east', role: 'clinician' },
    ],
  },
  daniel: {
    userId: 'user-daniel',
    name: 'Daniel',
    serviceLead: true,
    memberships: [],
  },
  alex: {
    userId: 'user-alex',
    name: 'Alex',
    serviceLead: false,
    memberships: [
      { workplace_id: 'wp-chroma', role: 'administrator' },
    ],
  },
}

export const DEMO_CLINICAL_LEAD_USER_ID = DEMO_PERSONA_ACCOUNTS.ben.userId
export const DEMO_SERVICE_LEAD_USER_ID = DEMO_PERSONA_ACCOUNTS.daniel.userId
export const DEFAULT_DEMO_PERSONA_ID = 'ben'

export const CURRENT_USER = {
  id: DEMO_CLINICAL_LEAD_USER_ID,
  email: 'ben@chromakit.local',
  name: DEMO_PERSONA_ACCOUNTS.ben.name,
  isAdmin: false,
  isServiceLead: false,
}

export const CLINICIAN_WORKPLACES = Object.values(DEMO_PERSONA_ACCOUNTS).flatMap((account) =>
  account.memberships.map((membership) => ({
    user_id: account.userId,
    workplace_id: membership.workplace_id,
    role: membership.role,
  })),
)

export const WORKPLACES = [
  {
    id: 'wp-chroma',
    name: 'Chroma Main HQ',
    join_code: 'CHROMA2026',
    logo_url: null,
    address_line1: 'Chroma Main HQ',
    address_line2: '42 Creative Quarter',
    address_line3: 'London',
    postcode: 'SE1 4AA',
    country: 'United Kingdom',
  },
  {
    id: 'wp-east',
    name: 'Chroma East Hub',
    join_code: 'CHROMAEAST',
    logo_url: null,
    address_line1: 'Chroma East Hub',
    address_line2: '18 Riverside Studios',
    address_line3: 'Stratford',
    postcode: 'E15 2GW',
    country: 'United Kingdom',
  },
]

export const CLINICIAN_PROFILES = [
  {
    id: 'user-daniel',
    full_name: 'Daniel',
    hcpc_number: 'SL10001',
    job_title: 'Service Lead',
    professional_title: 'Organisation Admin',
    signature_text: 'Daniel',
  },
  {
    id: 'user-ben',
    full_name: 'Ben',
    hcpc_number: 'MT12345',
    job_title: 'Clinical Lead',
    professional_title: 'Music Therapist, Integrative Psychotherapist',
    signature_text: 'Ben',
    bio: 'Clinical lead across Chroma sites with a focus on regulation, transition work, and team mentoring.',
    workplace_settings: [
      {
        workplace_id: 'wp-chroma',
        weekly_hours: {
          mon: { enabled: true, start: '09:00', end: '17:00' },
          tue: { enabled: true, start: '09:00', end: '17:00' },
          wed: { enabled: true, start: '09:00', end: '17:00' },
          thu: { enabled: true, start: '09:00', end: '17:00' },
          fri: { enabled: true, start: '09:00', end: '16:00' },
          sat: { enabled: false, start: '09:00', end: '13:00' },
          sun: { enabled: false, start: '09:00', end: '13:00' },
        },
        service_ids: ['svc-1', 'svc-5'],
      },
      {
        workplace_id: 'wp-east',
        weekly_hours: {
          mon: { enabled: false, start: '09:00', end: '17:00' },
          tue: { enabled: true, start: '10:00', end: '18:00' },
          wed: { enabled: false, start: '09:00', end: '17:00' },
          thu: { enabled: true, start: '10:00', end: '18:00' },
          fri: { enabled: true, start: '09:00', end: '15:00' },
          sat: { enabled: false, start: '09:00', end: '13:00' },
          sun: { enabled: false, start: '09:00', end: '13:00' },
        },
        service_ids: ['svc-1'],
      },
      {
        workplace_id: 'private',
        weekly_hours: {
          mon: { enabled: true, start: '08:30', end: '12:30' },
          tue: { enabled: false, start: '09:00', end: '17:00' },
          wed: { enabled: true, start: '08:30', end: '12:30' },
          thu: { enabled: false, start: '09:00', end: '17:00' },
          fri: { enabled: true, start: '08:30', end: '12:30' },
          sat: { enabled: false, start: '09:00', end: '13:00' },
          sun: { enabled: false, start: '09:00', end: '13:00' },
        },
        service_ids: ['svc-1', 'svc-2'],
      },
    ],
  },
  {
    id: 'user-sarah',
    full_name: 'Sarah',
    hcpc_number: 'AT44556',
    job_title: 'Clinician',
    professional_title: 'Art Therapist',
    signature_text: 'Sarah',
  },
  {
    id: 'user-alex',
    full_name: 'Alex',
    hcpc_number: 'AD77889',
    job_title: 'Administrator',
    professional_title: 'Operations',
    signature_text: 'Alex',
  },
  {
    id: 'user-maya',
    full_name: 'Maya Patel',
    hcpc_number: 'MT99887',
    job_title: 'Clinician',
    professional_title: 'Music Therapist',
    signature_text: 'Maya Patel',
    bio: 'Community music therapy with a neurodiversity-affirming approach.',
  },
  {
    id: 'user-jordan',
    full_name: 'Jordan Lee',
    hcpc_number: 'AT11223',
    job_title: 'Clinician',
    professional_title: 'Art Therapist',
    signature_text: 'Jordan Lee',
    bio: 'Visual arts therapy in CAMHS and educational settings.',
  },
]

export const CLIENTS = [
  {
    id: 'client-1',
    user_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    first_name: 'Alex',
    surname: 'Johnson',
    real_name: 'Alex Johnson',
    dob: '2008-04-12',
    school: 'Oak Academy',
    diagnosis: 'ADHD, SEMH',
    medication: 'Methylphenidate 18mg (morning)',
    workplace_id: 'wp-chroma',
    workplace_name: 'Chroma Main HQ',
    is_active: true,
    created_at: '2026-06-20',
    clinical_profile: {
      recurring_themes: 'Fortress / safe place, Bridge / transition, Rhythm as regulation',
      working_formulation: 'Transition anxiety linked to school move; sensory regulation via rhythmic and tactile arts.',
      sensory_considerations: 'High sensory sensitivity, Auditory sensitivity (hand dryers), Fluorescent lighting, Wet clay initially aversive',
      preferred_modalities_notes: 'Clay sculpting, digital art (iPad), songwriting / lyric scribing',
      clinical_goals: 'Tolerate transition cues, Initiate interaction within 10 minutes of session start',
    },
  },
  {
    id: 'client-2',
    user_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    first_name: 'Sarah',
    surname: 'Smith',
    real_name: 'Sarah Smith',
    dob: '2010-11-05',
    school: 'Riverside Primary',
    diagnosis: 'Autism Spectrum Condition (ASC)',
    workplace_id: 'wp-chroma',
    workplace_name: 'Chroma Main HQ',
    is_active: true,
    created_at: '2026-06-22',
    clinical_profile: {
      recurring_themes: 'Masks / identity, Order vs chaos',
      working_formulation: 'ASC profile with high sensory load; structure and predictability essential.',
      sensory_considerations: 'High sensory sensitivity, Sudden volume changes, Paint on hands, Strong art material smells',
      preferred_modalities_notes: 'Watercolour, piano / melodic improvisation',
      clinical_goals: 'Expand tolerable session length with headphones, Mask-making for identity work',
    },
  },
  {
    id: 'client-3',
    user_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    first_name: 'Private',
    surname: 'Patient',
    real_name: 'Private Patient',
    dob: '1995-02-28',
    school: '',
    diagnosis: 'Anxiety',
    workplace_id: null,
    workplace_name: 'Private Practice',
    is_active: true,
    created_at: '2026-06-15',
  },
  {
    id: 'client-4',
    user_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    first_name: 'Jamie',
    surname: 'Cole',
    real_name: 'Jamie Cole',
    dob: '2012-07-19',
    school: 'Oak Academy',
    diagnosis: 'Trauma / ACEs',
    workplace_id: 'wp-chroma',
    workplace_name: 'Chroma Main HQ',
    is_active: false,
    created_at: '2025-11-01',
  },
  {
    id: 'client-5',
    user_id: 'user-ben',
    assigned_therapist: 'Ben',
    first_name: 'Morgan',
    surname: 'Reed',
    real_name: 'Morgan Reed',
    dob: '2011-03-08',
    school: 'Eastside College',
    diagnosis: 'Social communication difficulties',
    workplace_id: 'wp-east',
    workplace_name: 'Chroma East Hub',
    is_active: true,
    created_at: '2026-06-10',
  },
  {
    id: 'client-6',
    user_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    first_name: 'Taylor',
    surname: 'Brooks',
    real_name: 'Taylor Brooks',
    dob: '2009-08-14',
    school: 'Eastside College',
    diagnosis: 'Anxiety, school refusal',
    workplace_id: 'wp-east',
    workplace_name: 'Chroma East Hub',
    is_active: true,
    created_at: '2026-06-05',
  },
]

export const BODY_MAPS = {
  'client-1': {
    snapshotId: 'snap-1',
    nodes: [
      {
        id: 'node-1',
        type: 'clinical',
        position: { x: 320, y: -80 },
        data: {
          label: 'Rumination',
          description: 'Gets stuck in negative thought loops during transitions.',
          domain: 'middle_cognitive',
          is_intervention: false,
          isExpanded: false,
        },
      },
      {
        id: 'node-2',
        type: 'clinical',
        position: { x: 40, y: 60 },
        data: {
          label: 'Physical tension',
          description: 'Shoulder tightness and shallow breathing in new settings.',
          domain: 'center_physiological',
          is_intervention: false,
          isExpanded: false,
        },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'impact',
        data: { relationship_type: 'negative', weight: 3 },
        markerEnd: { type: 'arrowclosed', color: '#ef4444' },
      },
    ],
  },
}

export const WORKPLACE_AUDIT_LOGS = [
  {
    id: 'log-1',
    workplace_id: 'wp-chroma',
    actor_id: 'user-ben',
    action: 'role_change',
    detail: 'Promoted Sam Rivera to clinician',
    created_at: '2026-06-18T11:00:00Z',
  },
]

/** Pending / resolved requests to join a workplace — approved by clinical lead only. */
export const MEMBERSHIP_REQUESTS = [
  {
    id: 'req-1',
    user_id: 'user-maya',
    workplace_id: 'wp-chroma',
    requested_role: 'clinician',
    status: 'pending',
    message: 'Experienced in school-based music therapy — hoping to join the Main HQ team.',
    created_at: '2026-06-25T10:00:00Z',
  },
  {
    id: 'req-2',
    user_id: 'user-jordan',
    workplace_id: 'wp-east',
    requested_role: 'clinician',
    status: 'pending',
    message: 'Available for part-time art therapy cover at East Hub.',
    created_at: '2026-06-26T14:30:00Z',
  },
]

export const TIMELINE_EVENTS = [
  {
    id: 'evt-1',
    client_id: 'client-1',
    type: 'created',
    title: 'Client record created',
    summary: 'Added to Chroma Main HQ caseload.',
    created_at: '2026-06-20T10:00:00Z',
    author_id: 'user-ben',
  },
  {
    id: 'evt-2',
    client_id: 'client-1',
    type: 'session',
    title: 'Initial assessment session',
    summary: '45-minute music therapy assessment at Oak Academy.',
    created_at: '2026-06-21T14:00:00Z',
    author_id: 'user-ben',
  },
  {
    id: 'evt-3',
    client_id: 'client-1',
    type: 'referral',
    title: 'Referral received',
    summary: 'Referral from SENCO regarding transition support.',
    created_at: '2026-06-19T09:30:00Z',
    author_id: 'user-ben',
  },
]

export const PROGRESS_NOTES = [
  {
    id: 'note-1',
    client_id: 'client-1',
    author_id: 'user-sarah',
    title: 'Session 1 — Initial contact',
    template_name: 'Standard 1:1 session',
    session_date: '2026-06-21',
    modality_used: 'music',
    therapeutic_theme: 'Rhythm as regulation',
    artwork_attachments: [],
    content: '<p>Alex engaged well with rhythmic activities. Showed preference for drum work over melodic instruments.</p><p><strong>Plan:</strong> Continue building rapport; introduce turn-taking games next session.</p>',
    created_at: '2026-06-21',
    updated_at: '2026-06-21',
  },
  {
    id: 'note-2',
    client_id: 'client-1',
    author_id: 'user-sarah',
    appointment_id: 'appt-2',
    title: 'Session 2 — Rapport building',
    template_name: 'Standard 1:1 session',
    session_date: '2026-06-24',
    modality_used: 'mixed',
    therapeutic_theme: 'Bridge / transition',
    artwork_attachments: [
      { id: 'art-1', name: 'fortress-clay-sculpture.jpg', uploaded_at: '2026-06-24' },
    ],
    content: '<p>Increased verbal communication during free improvisation. Some difficulty with transitions between activities.</p><p>Client created clay fortress sculpture — linked to intake theme of safe place.</p><p>Parent feedback: positive response at home following last session.</p>',
    created_at: '2026-06-24',
    updated_at: '2026-06-24',
  },
  {
    id: 'note-3',
    client_id: 'client-1',
    author_id: 'user-sarah',
    title: 'Session 3 — Digital art exploration',
    template_name: 'Standard 1:1 session',
    session_date: '2026-06-26',
    modality_used: 'art',
    therapeutic_theme: 'Fortress / safe place',
    artwork_attachments: [
      { id: 'art-2', name: 'ipad-safe-place.png', uploaded_at: '2026-06-26' },
      { id: 'art-3', name: 'bridge-collage.jpg', uploaded_at: '2026-06-26' },
    ],
    content: '<p>Used iPad digital art app — high engagement, minimal sensory distress compared to wet materials.</p><p>Explored bridge imagery in relation to upcoming school transition.</p>',
    created_at: '2026-06-26',
    updated_at: '2026-06-26',
  },
  {
    id: 'note-4',
    client_id: 'client-2',
    author_id: 'user-sarah',
    appointment_id: 'appt-7',
    title: 'Initial art therapy session',
    template_name: 'Standard 1:1 session',
    session_date: '2026-06-23',
    modality_used: 'art',
    therapeutic_theme: 'Masks / identity',
    artwork_attachments: [
      { id: 'art-4', name: 'watercolour-mask.jpg', uploaded_at: '2026-06-23' },
    ],
    content: '<p>Sarah tolerated watercolour for 20 minutes with headphones. Mask theme emerged spontaneously.</p>',
    created_at: '2026-06-23',
    updated_at: '2026-06-23',
  },
]

export const WORKING_DOCUMENTS = [
  {
    id: 'doc-1',
    client_id: 'client-1',
    author_id: 'user-ben',
    title: 'Formulation draft',
    content: '<h2>Presenting concerns</h2><p>Transition difficulties between classroom and therapy space. Hypervigilance in group settings.</p><h2>Working hypotheses</h2><ul><li>Sensory regulation needs</li><li>Attachment-informed approach</li></ul>',
    created_at: '2026-06-22T11:00:00Z',
    updated_at: '2026-06-23T09:00:00Z',
  },
  {
    id: 'doc-2',
    client_id: 'client-1',
    author_id: 'user-ben',
    title: 'SMART goals',
    content: '<p><strong>Goal 1:</strong> Alex will initiate a musical interaction with the therapist within 10 minutes of session start (baseline: 20 min).</p><p><strong>Goal 2:</strong> Alex will tolerate a transition cue without escalation on 3/5 occasions.</p>',
    created_at: '2026-06-23T14:00:00Z',
    updated_at: '2026-06-23T14:00:00Z',
  },
]

/** Care episodes — one per referral; maps to a future Supabase `episodes` table. */
export const EPISODES = [
  {
    id: 'ep-1',
    client_id: 'client-1',
    episode_number: 1,
    referral_date: '2025-09-01',
    referral_source: 'Oak Academy SENCO',
    presenting_issue: 'Transition support and emotional regulation in school.',
    status: 'active',
    start_date: '2025-09-15',
    end_date: null,
    discharge_summary: '',
    workplace_id: 'wp-chroma',
    created_at: '2025-09-01T09:00:00Z',
  },
  {
    id: 'ep-2',
    client_id: 'client-4',
    episode_number: 1,
    referral_date: '2025-11-01',
    referral_source: 'CAMHS discharge pathway',
    presenting_issue: 'Trauma-informed music therapy following ACEs.',
    status: 'discharged',
    start_date: '2025-11-15',
    end_date: '2026-05-01',
    discharge_summary: 'Goals met; discharged to school pastoral team with summary report.',
    workplace_id: 'wp-chroma',
    created_at: '2025-11-01T08:00:00Z',
  },
  {
    id: 'ep-3',
    client_id: 'client-4',
    episode_number: 2,
    referral_date: '2026-06-10',
    referral_source: 'Self-referral (private)',
    presenting_issue: 'Brief re-engagement for summer transition planning.',
    status: 'active',
    start_date: '2026-06-12',
    end_date: null,
    discharge_summary: '',
    workplace_id: null,
    created_at: '2026-06-10T10:00:00Z',
  },
]

export const LETTERS = [
  {
    id: 'letter-1',
    client_id: 'client-1',
    author_id: 'user-ben',
    title: 'Letter to GP',
    recipient: 'Dr Patel, Riverside Medical Centre',
    letter_date: '2026-06-18',
    content: '<p>Dear Dr Patel,</p><p>Re: Alex Johnson (DOB 12/04/2008)</p><p>I am writing following our music therapy assessment at Oak Academy. Alex has engaged well with structured rhythmic activities and would benefit from continued support around transitions.</p><p>Please do not hesitate to contact me if you require further information.</p><p>Yours sincerely,</p><p>Ben</p>',
    created_at: '2026-06-18T11:00:00Z',
    updated_at: '2026-06-18T11:00:00Z',
  },
]

/** Organisation-wide templates managed by Service Lead. */
export const PROGRESS_NOTE_TEMPLATES = [
  {
    id: 'pnt-1',
    name: 'Standard 1:1 session',
    description: 'Default structure for individual music therapy sessions.',
    workplace_id: null,
    workplace_name: 'All workplaces',
    content: `<h2>Session details</h2>
<p><strong>Client:</strong> <span data-merge-field="client_name" class="merge-field">Client name</span></p>
<p><strong>Date:</strong> <span data-merge-field="session_date" class="merge-field">Session date</span></p>
<p><strong>Service:</strong> <span data-merge-field="service_type" class="merge-field">Service delivered</span></p>
<p><strong>Location:</strong> <span data-merge-field="appointment_location" class="merge-field">Location</span></p>
<h2>Clinical note</h2>
<p></p>
<h2>Plan</h2>
<p></p>`,
    is_active: true,
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-06-01T12:00:00Z',
  },
  {
    id: 'pnt-2',
    name: 'Group session (school)',
    description: 'For group interventions with brief individual observations.',
    workplace_id: 'wp-chroma',
    workplace_name: 'Chroma Main HQ',
    content: `<h2>Group session</h2>
<p><strong>Date:</strong> <span data-merge-field="session_date" class="merge-field">Session date</span> · <strong>Setting:</strong> <span data-merge-field="appointment_location" class="merge-field">Location</span></p>
<h2>Group focus</h2>
<p></p>
<h2>Individual observations</h2>
<table><tr><th>Client</th><th>Participation</th><th>Notes</th></tr><tr><td></td><td></td><td></td></tr></table>
<h2>Plan</h2>
<p></p>`,
    is_active: true,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-05-20T14:00:00Z',
  },
  {
    id: 'pnt-3',
    name: 'Initial assessment',
    description: 'First-appointment assessment and formulation snapshot.',
    workplace_id: null,
    workplace_name: 'All workplaces',
    content: `<h2>Assessment — <span data-merge-field="client_name" class="merge-field">Client name</span></h2>
<p><strong>DOB:</strong> <span data-merge-field="client_dob" class="merge-field">Date of birth</span></p>
<p><strong>Session date:</strong> <span data-merge-field="session_date" class="merge-field">Session date</span></p>
<h2>Presenting concerns</h2>
<p></p>
<h2>Assessment findings</h2>
<p></p>
<h2>Initial formulation</h2>
<p></p>
<h2>Recommendations</h2>
<p></p>`,
    is_active: true,
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-03-01T08:00:00Z',
  },
]

export const LETTER_TEMPLATES = [
  {
    id: 'lt-1',
    name: 'Letter to GP',
    description: 'Standard clinical update for primary care.',
    workplace_id: null,
    workplace_name: 'All workplaces',
    content: `<p>Dear Colleague,</p>
<p><strong>Re:</strong> <span data-merge-field="client_name" class="merge-field">Client name</span> (DOB <span data-merge-field="client_dob" class="merge-field">Date of birth</span>)</p>
<p>I am writing as the music therapist involved in this client's care. </p>
<p></p>
<p>Please do not hesitate to contact me if you require further information.</p>
<p>Yours sincerely,</p>`,
    is_active: true,
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-04-12T11:00:00Z',
  },
  {
    id: 'lt-2',
    name: 'Letter to school SENCO',
    description: 'Update for school special educational needs coordinator.',
    workplace_id: 'wp-chroma',
    workplace_name: 'Chroma Main HQ',
    content: `<p>Dear SENCO,</p>
<p><strong>Re:</strong> <span data-merge-field="client_name" class="merge-field">Client name</span></p>
<p>Thank you for your ongoing collaboration. Following our recent session on <span data-merge-field="session_date" class="merge-field">Session date</span>, I wanted to share the following update:</p>
<p></p>
<p>Please let me know if a meeting would be helpful.</p>
<p>Kind regards,</p>`,
    is_active: true,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-06-08T09:30:00Z',
  },
  {
    id: 'lt-3',
    name: 'Discharge summary letter',
    description: 'End-of-episode summary for referrers and carers.',
    workplace_id: null,
    workplace_name: 'All workplaces',
    content: `<h2>Discharge summary</h2>
<p><strong>Client:</strong> <span data-merge-field="client_name" class="merge-field">Client name</span></p>
<p><strong>Final session:</strong> <span data-merge-field="session_date" class="merge-field">Session date</span></p>
<h2>Episode overview</h2>
<p></p>
<h2>Outcomes</h2>
<p></p>
<h2>Recommendations on discharge</h2>
<p></p>`,
    is_active: true,
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-01T08:00:00Z',
  },
]

/** Organisation services — trackable inputs classified by time type. */
export const ORG_SERVICE_TYPES = {
  appointment: 'Appointment',
  admin: 'Admin',
  busy: 'Busy',
}

export const ORG_SERVICES = [
  {
    id: 'svc-1',
    service_type: 'appointment',
    slug: 'music_therapy',
    name: 'Music Therapy',
    description: 'Direct clinical music therapy sessions in educational and community settings.',
    color: '#557a61',
    is_active: true,
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'svc-2',
    service_type: 'appointment',
    slug: 'clay_work',
    name: 'Clay Work',
    description: 'Hands-on art therapy using clay and tactile media.',
    color: '#8b5a7a',
    is_active: true,
    created_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 'svc-3',
    service_type: 'admin',
    slug: 'notetaking',
    name: 'Notetaking',
    description: 'Clinical documentation, progress notes, and report writing.',
    color: '#4a7c9e',
    is_active: true,
    created_at: '2026-02-10T09:00:00Z',
  },
  {
    id: 'svc-4',
    service_type: 'busy',
    slug: 'travel',
    name: 'Travel',
    description: 'Protected travel time between sites — not counted as direct clinical input.',
    color: '#6b7280',
    is_active: true,
    created_at: '2026-03-01T09:00:00Z',
  },
  {
    id: 'svc-5',
    service_type: 'appointment',
    slug: 'somatic_expression',
    name: 'Somatic Expression',
    description: 'Body-based creative therapy integrating movement and expression.',
    color: '#7c6b9e',
    is_active: true,
    created_at: '2026-03-15T09:00:00Z',
  },
]

export const APPOINTMENT_TYPES = {
  one_to_one: '1:1 session',
  group: 'Group session',
  consultation: 'Consultation',
}

export const ATTENDANCE_STATUSES = {
  attended: 'Attended',
  did_not_attend: 'Did not attend',
  cancelled: 'Cancelled',
}

/** Appointments — dates strictly YYYY-MM-DD; times as HH:mm. */
export const APPOINTMENTS = [
  {
    id: 'appt-1',
    client_id: 'client-1',
    client_name: 'Alex Johnson',
    episode_id: 'ep-1',
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-26',
    start_time: '14:00',
    end_time: '15:00',
    therapy_modality: 'music_therapy',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Oak Academy — music room',
    other_info: 'Parent attending — use side entrance',
    notes: '',
    created_at: '2026-06-20',
    updated_at: '2026-06-20',
  },
  {
    id: 'appt-2',
    client_id: 'client-1',
    client_name: 'Alex Johnson',
    episode_id: 'ep-1',
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-24',
    start_time: '15:00',
    end_time: '15:45',
    therapy_modality: 'music_therapy',
    appointment_type: 'one_to_one',
    attendance_status: 'attended',
    location: 'Oak Academy — music room',
    notes: '<p>45-minute session. Alex engaged well with drum work.</p>',
    created_at: '2026-06-18',
    updated_at: '2026-06-24',
  },
  {
    id: 'appt-3',
    client_id: 'client-3',
    client_name: 'Private Patient',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-27',
    start_time: '10:00',
    end_time: '11:00',
    therapy_modality: 'somatic_expression',
    appointment_type: 'consultation',
    attendance_status: null,
    location: 'Private practice — Chroma studio',
    notes: '',
    created_at: '2026-06-22',
    updated_at: '2026-06-22',
  },
  {
    id: 'appt-4',
    client_id: 'client-1',
    client_name: 'Alex Johnson',
    episode_id: 'ep-1',
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-07-02',
    start_time: '11:00',
    end_time: '12:00',
    therapy_modality: 'clay_work',
    appointment_type: 'group',
    attendance_status: null,
    location: 'Oak Academy — group room',
    notes: '',
    created_at: '2026-06-23',
    updated_at: '2026-06-23',
  },
  {
    id: 'appt-5',
    client_id: 'client-1',
    client_name: 'Alex Johnson',
    episode_id: 'ep-1',
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-18',
    start_time: '14:00',
    end_time: '14:45',
    therapy_modality: 'music_therapy',
    appointment_type: 'one_to_one',
    attendance_status: 'did_not_attend',
    location: 'Oak Academy — music room',
    notes: '<p>Client absent — school reported illness.</p>',
    created_at: '2026-06-15',
    updated_at: '2026-06-18',
  },
  {
    id: 'appt-6',
    client_id: 'client-2',
    client_name: 'Sarah Smith',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-26',
    start_time: '09:30',
    end_time: '10:30',
    therapy_modality: 'clay_work',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Riverside Primary — art room',
    notes: '',
    created_at: '2026-06-20',
    updated_at: '2026-06-20',
  },
  {
    id: 'appt-7',
    client_id: 'client-2',
    client_name: 'Sarah Smith',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-23',
    start_time: '13:00',
    end_time: '14:00',
    therapy_modality: 'clay_work',
    appointment_type: 'one_to_one',
    attendance_status: 'attended',
    location: 'Riverside Primary — art room',
    notes: '',
    created_at: '2026-06-19',
    updated_at: '2026-06-23',
  },
  {
    id: 'appt-8',
    client_id: 'client-6',
    client_name: 'Taylor Brooks',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-25',
    start_time: '11:00',
    end_time: '12:00',
    therapy_modality: 'somatic_expression',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Eastside College — studio B',
    notes: '',
    created_at: '2026-06-18',
    updated_at: '2026-06-18',
  },
  {
    id: 'appt-9',
    client_id: 'client-5',
    client_name: 'Morgan Reed',
    episode_id: null,
    clinician_id: 'user-ben',
    assigned_therapist: 'Ben',
    session_date: '2026-06-26',
    start_time: '16:00',
    end_time: '17:00',
    therapy_modality: 'music_therapy',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Eastside College — music suite',
    notes: '',
    created_at: '2026-06-21',
    updated_at: '2026-06-21',
  },
  {
    id: 'appt-10',
    client_id: 'client-1',
    client_name: 'Alex Johnson',
    episode_id: 'ep-1',
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-26',
    start_time: '10:00',
    end_time: '11:00',
    therapy_modality: 'clay_work',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Oak Academy — art room',
    notes: '',
    created_at: '2026-06-22',
    updated_at: '2026-06-22',
  },
  {
    id: 'appt-11',
    client_id: 'client-2',
    client_name: 'Sarah Smith',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-26',
    start_time: '11:30',
    end_time: '12:30',
    therapy_modality: 'clay_work',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Riverside Primary — art room',
    notes: '',
    created_at: '2026-06-21',
    updated_at: '2026-06-21',
  },
  {
    id: 'appt-12',
    client_id: 'client-6',
    client_name: 'Taylor Brooks',
    episode_id: null,
    clinician_id: 'user-sarah',
    assigned_therapist: 'Sarah',
    session_date: '2026-06-27',
    start_time: '14:00',
    end_time: '15:00',
    therapy_modality: 'music_therapy',
    appointment_type: 'one_to_one',
    attendance_status: null,
    location: 'Eastside College — studio B',
    notes: '',
    created_at: '2026-06-22',
    updated_at: '2026-06-22',
  },
]

/** Clinician reflective journal — flat local mock entries (YYYY-MM-DD dates, HH:MM times). */
export const CLINICIAN_JOURNAL_ENTRIES = [
  {
    id: 'journal-1',
    author_id: 'user-sarah',
    date: '2026-06-24',
    time: '17:45',
    somatic_state: 'Grounded',
    body_text: '<p>After a full day of sessions I noticed my shoulders releasing during the closing listening exercise. Carrying less urgency into supervision tomorrow.</p>',
  },
  {
    id: 'journal-2',
    author_id: 'user-sarah',
    date: '2026-06-22',
    time: '08:20',
    somatic_state: 'Activated',
    body_text: '<p>Complex family dynamics in the morning block left me buzzing. Ten minutes of paced breathing before lunch helped reset.</p>',
  },
  {
    id: 'journal-3',
    author_id: 'user-sarah',
    date: '2026-06-20',
    time: '13:05',
    somatic_state: 'Open',
    body_text: '<p>Group improvisation felt spacious today. I stayed present with silence rather than filling it — a small but meaningful shift.</p>',
  },
  {
    id: 'journal-4',
    author_id: 'user-daniel',
    date: '2026-06-23',
    time: '16:30',
    somatic_state: 'Settled',
    body_text: '<p>Team debrief was productive. I am noticing how administrative load shows up as jaw tension by Thursday.</p>',
  },
]
