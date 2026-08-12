/** Shared mock finance data for home admin block and Finance page (pre-Xero). */

export function formatGbp(amount) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
}

export function financeStatusLabel(status) {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    ready: 'Ready for Xero',
    sent: 'Sent',
    paid: 'Paid',
  }
  return labels[status] || status
}

const FINANCE_BY_WORKPLACE = {
  'wp-chroma': {
    weekLabel: '22–26 Jun 2026',
    timesheets: [
      {
        id: 'ts-chroma-ben',
        clinician: 'Ben',
        weekLabel: '22–26 Jun 2026',
        sessions: 7,
        hours: 10.5,
        travelHours: 2,
        adminHours: 1.5,
        status: 'submitted',
        lines: [
          { date: '2026-06-22', client: 'Alex Johnson', service: '1:1 music therapy', hours: 1.5, location: 'Oak Academy' },
          { date: '2026-06-23', client: 'Sam Rivera', service: '1:1 art therapy', hours: 1.5, location: 'Clinic' },
          { date: '2026-06-24', client: 'Group — Year 8', service: 'Group music', hours: 2, location: 'Oak Academy' },
          { date: '2026-06-25', client: 'Alex Johnson', service: '1:1 music therapy', hours: 1.5, location: 'Oak Academy' },
          { date: '2026-06-26', client: 'Clinical supervision', service: 'Supervision', hours: 1.5, location: 'HQ' },
        ],
      },
      {
        id: 'ts-chroma-sarah',
        clinician: 'Sarah',
        weekLabel: '22–26 Jun 2026',
        sessions: 6,
        hours: 9,
        travelHours: 1.5,
        adminHours: 1,
        status: 'draft',
        lines: [
          { date: '2026-06-22', client: 'Jordan Lee', service: '1:1 music therapy', hours: 1.5, location: 'School' },
          { date: '2026-06-23', client: 'Sarah Smith', service: 'Assessment', hours: 2, location: 'Clinic' },
          { date: '2026-06-24', client: 'Jordan Lee', service: '1:1 music therapy', hours: 1.5, location: 'School' },
          { date: '2026-06-25', client: 'Team meeting', service: 'MDT', hours: 1, location: 'HQ' },
        ],
      },
      {
        id: 'ts-chroma-maya',
        clinician: 'Maya Patel',
        weekLabel: '22–26 Jun 2026',
        sessions: 5,
        hours: 7.5,
        travelHours: 1,
        adminHours: 0.5,
        status: 'approved',
        lines: [
          { date: '2026-06-23', client: 'Private caseload', service: '1:1 art therapy', hours: 3, location: 'Clinic' },
          { date: '2026-06-25', client: 'Private caseload', service: '1:1 art therapy', hours: 3, location: 'Clinic' },
          { date: '2026-06-26', client: 'Notes & admin', service: 'Admin', hours: 1.5, location: 'Remote' },
        ],
      },
    ],
    expenses: [
      {
        id: 'exp-chroma-1',
        claimant: 'Ben',
        description: 'Travel — Oak Academy (return, 3 days)',
        category: 'Travel',
        amount: 54.6,
        date: '2026-06-24',
        status: 'pending',
        receipt: true,
      },
      {
        id: 'exp-chroma-2',
        claimant: 'Sarah',
        description: 'Art materials — session kit top-up',
        category: 'Clinical supplies',
        amount: 24.99,
        date: '2026-06-23',
        status: 'pending',
        receipt: true,
      },
      {
        id: 'exp-chroma-3',
        claimant: 'Ben',
        description: 'Parking — clinic day',
        category: 'Travel',
        amount: 6.5,
        date: '2026-06-22',
        status: 'approved',
        receipt: true,
      },
      {
        id: 'exp-chroma-4',
        claimant: 'Maya Patel',
        description: 'Instrument hire — assessment week',
        category: 'Equipment',
        amount: 35,
        date: '2026-06-20',
        status: 'approved',
        receipt: false,
      },
      {
        id: 'exp-chroma-5',
        claimant: 'Sarah',
        description: 'Train — East Hub case conference',
        category: 'Travel',
        amount: 18.4,
        date: '2026-06-18',
        status: 'rejected',
        receipt: true,
      },
    ],
    invoices: [
      {
        id: 'inv-chroma-1',
        clientName: 'Alex Johnson',
        reference: 'INV-2026-0142',
        amount: 320,
        period: 'Jun 2026',
        status: 'draft',
        funder: 'Private — parent',
        sessions: 4,
        dueDate: '2026-07-15',
      },
      {
        id: 'inv-chroma-2',
        clientName: 'Jordan Lee',
        reference: 'INV-2026-0138',
        amount: 480,
        period: 'Jun 2026',
        status: 'ready',
        funder: 'LA — EHCP band',
        sessions: 6,
        dueDate: '2026-07-10',
      },
      {
        id: 'inv-chroma-3',
        clientName: 'Sam Rivera',
        reference: 'INV-2026-0129',
        amount: 240,
        period: 'May 2026',
        status: 'sent',
        funder: 'School commissioned',
        sessions: 3,
        dueDate: '2026-06-20',
      },
      {
        id: 'inv-chroma-4',
        clientName: 'Oak Academy (group)',
        reference: 'INV-2026-0120',
        amount: 960,
        period: 'May 2026',
        status: 'paid',
        funder: 'School commissioned',
        sessions: 8,
        dueDate: '2026-06-01',
      },
      {
        id: 'inv-chroma-5',
        clientName: 'Sarah Smith',
        reference: 'INV-2026-0145',
        amount: 160,
        period: 'Jun 2026',
        status: 'draft',
        funder: 'Private — parent',
        sessions: 2,
        dueDate: '2026-07-20',
      },
    ],
  },
  'wp-east': {
    weekLabel: '22–26 Jun 2026',
    timesheets: [
      {
        id: 'ts-east-ben',
        clinician: 'Ben',
        weekLabel: '22–26 Jun 2026',
        sessions: 3,
        hours: 4.5,
        travelHours: 1.5,
        adminHours: 0.5,
        status: 'submitted',
        lines: [
          { date: '2026-06-24', client: 'East Hub caseload', service: '1:1 music therapy', hours: 3, location: 'East Hub' },
          { date: '2026-06-25', client: 'Site MDT', service: 'MDT', hours: 1.5, location: 'East Hub' },
        ],
      },
      {
        id: 'ts-east-sarah',
        clinician: 'Sarah',
        weekLabel: '22–26 Jun 2026',
        sessions: 4,
        hours: 6,
        travelHours: 1,
        adminHours: 0.5,
        status: 'draft',
        lines: [
          { date: '2026-06-23', client: 'East Hub caseload', service: '1:1 music therapy', hours: 3, location: 'East Hub' },
          { date: '2026-06-26', client: 'East Hub caseload', service: '1:1 music therapy', hours: 3, location: 'East Hub' },
        ],
      },
    ],
    expenses: [
      {
        id: 'exp-east-1',
        claimant: 'Ben',
        description: 'Travel — Chroma Main to East Hub',
        category: 'Travel',
        amount: 22.8,
        date: '2026-06-24',
        status: 'pending',
        receipt: true,
      },
      {
        id: 'exp-east-2',
        claimant: 'Sarah',
        description: 'Percussion consumables',
        category: 'Clinical supplies',
        amount: 14.5,
        date: '2026-06-21',
        status: 'approved',
        receipt: true,
      },
    ],
    invoices: [
      {
        id: 'inv-east-1',
        clientName: 'East primary school block',
        reference: 'INV-2026-E041',
        amount: 720,
        period: 'Jun 2026',
        status: 'ready',
        funder: 'School commissioned',
        sessions: 6,
        dueDate: '2026-07-12',
      },
      {
        id: 'inv-east-2',
        clientName: 'LA package — East',
        reference: 'INV-2026-E038',
        amount: 1100,
        period: 'May 2026',
        status: 'sent',
        funder: 'LA — EHCP band',
        sessions: 10,
        dueDate: '2026-06-15',
      },
    ],
  },
}

function summarise(timesheets, expenses, invoices) {
  return {
    hoursSubmitted: timesheets
      .filter(t => t.status === 'submitted' || t.status === 'approved')
      .reduce((sum, t) => sum + t.hours, 0),
    hoursDraft: timesheets.filter(t => t.status === 'draft').reduce((sum, t) => sum + t.hours, 0),
    expensesPending: expenses.filter(e => e.status === 'pending').length,
    invoicesDraft: invoices.filter(i => i.status === 'draft' || i.status === 'ready').length,
    invoiceValueOpen: invoices
      .filter(i => i.status === 'draft' || i.status === 'ready' || i.status === 'sent')
      .reduce((sum, i) => sum + i.amount, 0),
  }
}

/** Full mock pack for Finance page / home block. */
export function getFinanceMockForWorkplace(workplace) {
  if (!workplace?.id) {
    return {
      weekLabel: '',
      workplaceName: '',
      timesheets: [],
      expenses: [],
      invoices: [],
      summary: { hoursSubmitted: 0, hoursDraft: 0, expensesPending: 0, invoicesDraft: 0, invoiceValueOpen: 0 },
    }
  }

  const pack = FINANCE_BY_WORKPLACE[workplace.id] || FINANCE_BY_WORKPLACE['wp-chroma']
  return {
    weekLabel: pack.weekLabel,
    workplaceName: workplace.name || '',
    timesheets: pack.timesheets,
    expenses: pack.expenses,
    invoices: pack.invoices,
    summary: summarise(pack.timesheets, pack.expenses, pack.invoices),
  }
}
