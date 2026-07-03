import { describe, expect, it } from 'vitest'
import { db } from './data/collections'
import {
  appointmentAssignedToClinician,
  getPersonalUpcomingAppointments,
  getPersonalActiveCases,
  getWorkplaceUpcomingAppointments,
  getWorkplaceActiveCases,
} from './homeBlocks'

describe('homeBlocks assignment filters', () => {
  it('matches appointments by clinician_id or assigned_therapist name', () => {
    expect(appointmentAssignedToClinician(
      { clinician_id: 'user-sarah', assigned_therapist: 'Sarah' },
      'user-sarah',
      'Sarah',
    )).toBe(true)
    expect(appointmentAssignedToClinician(
      { clinician_id: 'user-sarah', assigned_therapist: 'Sarah' },
      'user-daniel',
      'Daniel',
    )).toBe(false)
    expect(appointmentAssignedToClinician(
      { assigned_therapist: 'Daniel' },
      'user-daniel',
      'Daniel',
    )).toBe(true)
  })

  it('returns only Sarah personal upcoming at Chroma', () => {
    const upcoming = getPersonalUpcomingAppointments('user-sarah', 'Sarah', 'wp-chroma')
    expect(upcoming.length).toBeGreaterThan(0)
    expect(upcoming.every(a => a.assigned_therapist === 'Sarah')).toBe(true)
  })

  it('returns only Daniel personal active cases', () => {
    const cases = getPersonalActiveCases('user-daniel', 'wp-chroma')
    expect(cases.every(c => c.user_id === 'user-daniel')).toBe(true)
  })

  it('returns workplace-wide upcoming and cases for Chroma', () => {
    const upcoming = getWorkplaceUpcomingAppointments('wp-chroma')
    const cases = getWorkplaceActiveCases('wp-chroma')

    expect(upcoming.length).toBeGreaterThan(0)
    expect(cases.length).toBeGreaterThan(0)

    expect(upcoming.every((appt) => {
      const client = db.clients.find(c => c.id === appt.client_id)
      return client?.workplace_id === 'wp-chroma'
    })).toBe(true)

    expect(cases.every(c => c.workplace_id === 'wp-chroma' && c.is_active)).toBe(true)

    const danielCases = getPersonalActiveCases('user-daniel', 'wp-chroma')
    const sarahCases = getPersonalActiveCases('user-sarah', 'wp-chroma')
    expect(danielCases.length + sarahCases.length).toBeGreaterThanOrEqual(cases.length)
  })
})
