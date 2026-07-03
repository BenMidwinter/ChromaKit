/** Persisted calendar view preferences (localStorage). */

export const DEFAULT_CALENDAR_START_HOUR = 9
export const DEFAULT_CALENDAR_END_HOUR = 17
export const DEFAULT_CALENDAR_INTERVAL = 30

export const MIN_CALENDAR_INTERVAL = 5
export const MAX_CALENDAR_INTERVAL = 120

export const CALENDAR_START_HOUR_OPTIONS = [
  { value: 6, label: '6:00 am' },
  { value: 7, label: '7:00 am' },
  { value: 8, label: '8:00 am' },
  { value: 9, label: '9:00 am' },
  { value: 10, label: '10:00 am' },
  { value: 11, label: '11:00 am' },
]

export const CALENDAR_END_HOUR_OPTIONS = [
  { value: 15, label: '3:00 pm' },
  { value: 16, label: '4:00 pm' },
  { value: 17, label: '5:00 pm' },
  { value: 18, label: '6:00 pm' },
  { value: 19, label: '7:00 pm' },
  { value: 20, label: '8:00 pm' },
]

const START_KEY = 'chromatik-calendar-start-hour'
const END_KEY = 'chromatik-calendar-end-hour'
const INTERVAL_KEY = 'chromatik-calendar-interval'

function toNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clampInterval(value) {
  const n = toNumber(value, DEFAULT_CALENDAR_INTERVAL)
  return Math.min(MAX_CALENDAR_INTERVAL, Math.max(MIN_CALENDAR_INTERVAL, Math.round(n)))
}

function normalize({ startHour, endHour, intervalMinutes }) {
  const start = toNumber(startHour, DEFAULT_CALENDAR_START_HOUR)
  const end = toNumber(endHour, DEFAULT_CALENDAR_END_HOUR)
  return {
    startHour: Math.min(start, end - 1),
    endHour: Math.max(end, start + 1),
    intervalMinutes: clampInterval(intervalMinutes),
  }
}

export function getCalendarViewPreferences() {
  try {
    return normalize({
      startHour: toNumber(localStorage.getItem(START_KEY), DEFAULT_CALENDAR_START_HOUR),
      endHour: toNumber(localStorage.getItem(END_KEY), DEFAULT_CALENDAR_END_HOUR),
      intervalMinutes: toNumber(localStorage.getItem(INTERVAL_KEY), DEFAULT_CALENDAR_INTERVAL),
    })
  } catch {
    return {
      startHour: DEFAULT_CALENDAR_START_HOUR,
      endHour: DEFAULT_CALENDAR_END_HOUR,
      intervalMinutes: DEFAULT_CALENDAR_INTERVAL,
    }
  }
}

export function saveCalendarViewPreferences(next) {
  const normalized = normalize(next)
  try {
    localStorage.setItem(START_KEY, String(normalized.startHour))
    localStorage.setItem(END_KEY, String(normalized.endHour))
    localStorage.setItem(INTERVAL_KEY, String(normalized.intervalMinutes))
  } catch {
    /* ignore */
  }
  return normalized
}
