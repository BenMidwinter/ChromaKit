import { useMemo, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getAllAppointments, saveAppointment, getClientsForUser } from '../lib/store'
import {
  DEMO_TODAY,
  addDaysYmd,
  formatDisplayDate,
  formatLongDate,
  formatWeekdayShort,
  monthGridDays,
  startOfMonthYmd,
  weekDatesYmd,
  workingWeekDatesYmd,
} from '../lib/dateArchitecture'
import {
  filterAppointmentsForPersona,
  appointmentsForDate,
} from '../lib/calendarAccess'
import {
  getCalendarViewPreferences,
  saveCalendarViewPreferences,
  CALENDAR_START_HOUR_OPTIONS,
  CALENDAR_END_HOUR_OPTIONS,
  MIN_CALENDAR_INTERVAL,
  MAX_CALENDAR_INTERVAL,
} from '../lib/calendarPreferences'
import {
  canPickCalendarOwner,
  filterAppointmentsByCalendarOwner,
  getCalendarOwnerOptions,
  getDefaultCalendarOwner,
} from '../lib/calendarOwners'
import { modalityLabel } from '../lib/calendarConstants'
import {
  calendarEventStyle,
  calendarDotStyle,
  calendarLegendStyle,
} from '../lib/calendarServiceStyles'
import { getAppointmentOrgServices } from '../lib/store'
import { shouldBlurClientIdentity } from '../lib/demoPersonas'
import BlurredName from './BlurredName'
import { CalendarWorkspaceFrame, CalendarTimeSlot, EventDrawer, ScheduleSessionPanel, RecurringSchedulePanel } from './LayoutComponents'

const VIEW_MODES = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'working-week', label: 'Working week' },
  { id: 'day', label: 'Day' },
]

function pad2(n) {
  return String(n).padStart(2, '0')
}

function hhmm(hour, minute) {
  return `${pad2(hour)}:${pad2(minute)}`
}

function parseMinutes(time) {
  if (!time) return 0
  const [h, m] = String(time).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function eventEndMinutes(appt) {
  const start = parseMinutes(appt.start_time)
  if (appt.end_time) {
    const end = parseMinutes(appt.end_time)
    return end > start ? end : start + 30
  }
  return start + 60
}

function isCancelled(appt) {
  return appt.attendance_status === 'cancelled'
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Position overlapping events: events keep their true start/duration (top/height)
 * and overlapping clusters are split into side-by-side lanes.
 */
function layoutDayEvents(appts, dayStartMin, dayEndMin) {
  const total = Math.max(1, dayEndMin - dayStartMin)
  const items = appts
    .map(appt => ({
      appt,
      start: clamp(parseMinutes(appt.start_time), dayStartMin, dayEndMin),
      end: clamp(eventEndMinutes(appt), dayStartMin, dayEndMin),
    }))
    .filter(it => it.end > dayStartMin && it.start < dayEndMin && it.end > it.start)
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const result = []
  let cluster = []
  let clusterEnd = -1

  const flush = () => {
    const laneEnds = []
    cluster.forEach(it => {
      let lane = laneEnds.findIndex(end => end <= it.start)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(it.end)
      } else {
        laneEnds[lane] = it.end
      }
      it.lane = lane
    })
    const laneCount = laneEnds.length || 1
    cluster.forEach(it => {
      const width = 100 / laneCount
      result.push({
        appt: it.appt,
        top: ((it.start - dayStartMin) / total) * 100,
        height: ((it.end - it.start) / total) * 100,
        left: it.lane * width,
        width,
      })
    })
    cluster = []
    clusterEnd = -1
  }

  items.forEach(it => {
    if (cluster.length && it.start >= clusterEnd) flush()
    cluster.push(it)
    clusterEnd = Math.max(clusterEnd, it.end)
  })
  flush()

  return result
}

function EventChip({ appointment, compact = false, blurNames = false, onSelect, selected = false, style }) {
  const cancelled = isCancelled(appointment)
  const timeRange = appointment.end_time
    ? `${appointment.start_time}–${appointment.end_time}`
    : appointment.start_time

  const className = [
    'calendar-event',
    'calendar-event--interactive',
    'calendar-event--block',
    'calendar-event--service',
    compact && 'calendar-event--compact',
    selected && 'calendar-event--selected',
    cancelled && 'calendar-event--cancelled',
  ].filter(Boolean).join(' ')

  const title = blurNames
    ? `${modalityLabel(appointment.therapy_modality)} · ${timeRange}${cancelled ? ' · cancelled' : ''}`
    : `${appointment.client_name} · ${modalityLabel(appointment.therapy_modality)} · ${timeRange}${cancelled ? ' · cancelled' : ''}`

  return (
    <button
      type="button"
      className={className}
      style={{ ...calendarEventStyle(appointment.therapy_modality), ...style }}
      title={title}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(appointment)
      }}
    >
      <span className="calendar-event__time">{timeRange}</span>
      <BlurredName as="span" name={appointment.client_name} blur={blurNames} className="calendar-event__client" />
      {!compact && (
        <span className="calendar-event__meta">{modalityLabel(appointment.therapy_modality)}</span>
      )}
      {!compact && (
        <BlurredName as="span" name={appointment.assigned_therapist} blur={blurNames} className="calendar-event__therapist" />
      )}
    </button>
  )
}

function ModalityLegend() {
  const services = useMemo(() => getAppointmentOrgServices(), [])

  return (
    <div className="calendar-legend">
      {services.map(svc => (
        <span
          key={svc.id}
          className="calendar-legend__item"
          style={calendarLegendStyle(svc.slug)}
        >
          <span className="calendar-legend__dot" style={calendarDotStyle(svc.slug)} />
          {svc.name}
        </span>
      ))}
    </div>
  )
}

function CalendarViewOptions({ prefs, open, onToggle, onChange }) {
  const [intervalDraft, setIntervalDraft] = useState(String(prefs.intervalMinutes))
  const [prevInterval, setPrevInterval] = useState(prefs.intervalMinutes)

  if (prefs.intervalMinutes !== prevInterval) {
    setPrevInterval(prefs.intervalMinutes)
    setIntervalDraft(String(prefs.intervalMinutes))
  }

  const commitInterval = () => {
    if (intervalDraft.trim() === '') {
      setIntervalDraft(String(prefs.intervalMinutes))
      return
    }
    onChange({ intervalMinutes: intervalDraft })
  }

  return (
    <div className="calendar-view-options">
      <button
        type="button"
        className={`calendar-toolbar__btn calendar-view-options__trigger${open ? ' calendar-view-options__trigger--open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        View options
      </button>
      {open && (
        <div className="calendar-view-options__panel">
          <div className="calendar-view-options__field">
            <label htmlFor="calendar-start-hour">Day starts</label>
            <select
              id="calendar-start-hour"
              className="paper-input"
              value={prefs.startHour}
              onChange={e => onChange({ startHour: Number(e.target.value) })}
            >
              {CALENDAR_START_HOUR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="calendar-view-options__field">
            <label htmlFor="calendar-end-hour">Day ends</label>
            <select
              id="calendar-end-hour"
              className="paper-input"
              value={prefs.endHour}
              onChange={e => onChange({ endHour: Number(e.target.value) })}
            >
              {CALENDAR_END_HOUR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="calendar-view-options__field">
            <label htmlFor="calendar-interval">Slot interval (minutes)</label>
            <input
              id="calendar-interval"
              type="number"
              inputMode="numeric"
              min={MIN_CALENDAR_INTERVAL}
              max={MAX_CALENDAR_INTERVAL}
              step={5}
              className="paper-input"
              value={intervalDraft}
              onChange={e => setIntervalDraft(e.target.value)}
              onBlur={commitInterval}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitInterval() } }}
            />
          </div>
          <p className="calendar-view-options__hint text-small text-muted">
            Grid lines mark each interval; events still span their true length.
          </p>
        </div>
      )}
    </div>
  )
}

function MonthView({ activeDate, appointments, onSelectDate, blurNames = false, onSelectAppointment }) {
  const cells = monthGridDays(activeDate)
  const monthStart = startOfMonthYmd(activeDate)
  const monthLabel = formatLongDate(monthStart).split(',')[1]?.trim() || formatDisplayDate(monthStart)

  const byDate = useMemo(() => {
    const map = {}
    for (const appt of appointments) {
      if (!map[appt.session_date]) map[appt.session_date] = []
      map[appt.session_date].push(appt)
    }
    return map
  }, [appointments])

  return (
    <div className="calendar-month">
      <div className="calendar-month__head">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-month__weekday">{d}</div>
        ))}
      </div>
      <div className="calendar-month__grid">
        {cells.map((cell, idx) => {
          const dayAppts = cell.ymd ? (byDate[cell.ymd] || []) : []
          const isToday = cell.ymd === DEMO_TODAY
          const isActive = cell.ymd === activeDate
          return (
            <button
              key={idx}
              type="button"
              disabled={!cell.ymd}
              onClick={() => cell.ymd && onSelectDate(cell.ymd)}
              className={`calendar-month__cell${!cell.inMonth ? ' calendar-month__cell--muted' : ''}${isActive ? ' calendar-month__cell--active' : ''}`}
            >
              {cell.ymd && (
                <>
                  <span className={`calendar-month__day${isToday ? ' calendar-month__day--today' : ''}`}>
                    {Number(cell.ymd.slice(-2))}
                  </span>
                  <div className="calendar-month__events">
                    {dayAppts.slice(0, 3).map(appt => (
                      <button
                        key={appt.id}
                        type="button"
                        className={`calendar-month__event calendar-event--interactive${isCancelled(appt) ? ' calendar-month__event--cancelled' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectAppointment?.(appt)
                        }}
                      >
                        <span className="calendar-month__dot" style={calendarDotStyle(appt.therapy_modality)} />
                        <span className="calendar-month__event-text">
                          {appt.start_time}{' '}
                          <BlurredName name={appt.client_name.split(' ')[0]} blur={blurNames} className="inline" />
                        </span>
                      </button>
                    ))}
                    {dayAppts.length > 3 && (
                      <span className="calendar-month__more">+{dayAppts.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>
      <p className="calendar-month__footer">{monthLabel}</p>
    </div>
  )
}

function DayColumn({
  ymd,
  appts,
  hours,
  subSlotMinutes,
  dayStartMin,
  dayEndMin,
  blurNames,
  compact,
  onSelectAppointment,
  selectedAppointmentId,
  onEmptySlotClick,
}) {
  const laidOut = useMemo(
    () => layoutDayEvents(appts, dayStartMin, dayEndMin),
    [appts, dayStartMin, dayEndMin],
  )

  return (
    <div className="calendar-col">
      {hours.map(hour => (
        <div key={hour} className="calendar-col__hour">
          {subSlotMinutes.map((minute, i) => {
            const slot = hhmm(hour, minute)
            return (
              <CalendarTimeSlot
                key={slot}
                className={`calendar-col__slot${i > 0 ? ' calendar-col__slot--sub' : ''}`}
                onClick={() => onEmptySlotClick?.(ymd, slot)}
                title={`Book ${ymd} at ${slot}`}
              />
            )
          })}
        </div>
      ))}
      <div className="calendar-col__events">
        {laidOut.map(item => (
          <EventChip
            key={item.appt.id}
            appointment={item.appt}
            compact={compact}
            blurNames={blurNames}
            onSelect={onSelectAppointment}
            selected={selectedAppointmentId === item.appt.id}
            style={{
              top: `${item.top}%`,
              height: `${item.height}%`,
              left: `calc(${item.left}% + 2px)`,
              width: `calc(${item.width}% - 4px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function TimeGridView({
  dates,
  appointments,
  activeDate,
  onSelectDate,
  blurNames = false,
  onSelectAppointment,
  selectedAppointmentId,
  hours,
  subSlotMinutes,
  dayStartMin,
  dayEndMin,
  onEmptySlotClick,
}) {
  const byDate = useMemo(() => {
    const map = {}
    for (const appt of appointments) {
      if (!map[appt.session_date]) map[appt.session_date] = []
      map[appt.session_date].push(appt)
    }
    return map
  }, [appointments])

  const colCount = dates.length

  return (
    <div className="calendar-time-grid-wrap">
      <div className="calendar-time-grid" style={{ '--calendar-cols': colCount }}>
        <div className="calendar-time-grid__corner" />
        {dates.map(ymd => {
          const isToday = ymd === DEMO_TODAY
          const isActive = ymd === activeDate
          return (
            <button
              key={ymd}
              type="button"
              onClick={() => onSelectDate(ymd)}
              className={`calendar-time-grid__day-head${isActive ? ' calendar-time-grid__day-head--active' : ''}`}
            >
              <span className="calendar-time-grid__weekday">{formatWeekdayShort(ymd)}</span>
              <span className={`calendar-time-grid__date${isToday ? ' calendar-time-grid__date--today' : ''}`}>
                {Number(ymd.slice(-2))}
              </span>
            </button>
          )
        })}

        <div className="calendar-time-grid__gutter">
          {hours.map(hour => (
            <div key={hour} className="calendar-time-grid__hour-label">{hhmm(hour, 0)}</div>
          ))}
        </div>

        {dates.map(ymd => (
          <DayColumn
            key={ymd}
            ymd={ymd}
            appts={byDate[ymd] || []}
            hours={hours}
            subSlotMinutes={subSlotMinutes}
            dayStartMin={dayStartMin}
            dayEndMin={dayEndMin}
            blurNames={blurNames}
            compact={colCount > 1}
            onSelectAppointment={onSelectAppointment}
            selectedAppointmentId={selectedAppointmentId}
            onEmptySlotClick={onEmptySlotClick}
          />
        ))}
      </div>
    </div>
  )
}

function DayView({
  activeDate,
  appointments,
  blurNames = false,
  onSelectAppointment,
  selectedAppointmentId,
  hours,
  subSlotMinutes,
  dayStartMin,
  dayEndMin,
  onEmptySlotClick,
}) {
  const dayAppts = useMemo(
    () => appointmentsForDate(appointments, activeDate),
    [appointments, activeDate],
  )

  return (
    <div className="calendar-day">
      <div className="calendar-day__header">
        <h3 className="calendar-day__title">{formatLongDate(activeDate)}</h3>
        <p className="calendar-day__count">{dayAppts.length} session{dayAppts.length === 1 ? '' : 's'}</p>
      </div>
      <div className="calendar-day__timeline">
        <div className="calendar-day__gutter">
          {hours.map(hour => (
            <div key={hour} className="calendar-day__hour">{hhmm(hour, 0)}</div>
          ))}
        </div>
        <DayColumn
          ymd={activeDate}
          appts={dayAppts}
          hours={hours}
          subSlotMinutes={subSlotMinutes}
          dayStartMin={dayStartMin}
          dayEndMin={dayEndMin}
          blurNames={blurNames}
          compact={false}
          onSelectAppointment={onSelectAppointment}
          selectedAppointmentId={selectedAppointmentId}
          onEmptySlotClick={onEmptySlotClick}
        />
      </div>
    </div>
  )
}

export default function CalendarModule({ persona }) {
  const { myWorkplace, session } = useOutletContext()
  const [viewMode, setViewMode] = useState('week')
  const [activeDate, setActiveDate] = useState(DEMO_TODAY)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [scheduleDraft, setScheduleDraft] = useState(null)
  const [scheduleSaving, setScheduleSaving] = useState(false)
  const [appointments, setAppointments] = useState(() => getAllAppointments())
  const [viewPrefs, setViewPrefs] = useState(() => getCalendarViewPreferences())
  const [viewOptionsOpen, setViewOptionsOpen] = useState(false)

  const reloadAppointments = useCallback(() => {
    setAppointments(getAllAppointments())
  }, [])

  const ownerOptions = useMemo(
    () => getCalendarOwnerOptions(persona, myWorkplace),
    [persona, myWorkplace],
  )
  const [calendarOwner, setCalendarOwner] = useState(() => getDefaultCalendarOwner(persona))
  const [prevPersona, setPrevPersona] = useState(persona)
  const showOwnerPicker = canPickCalendarOwner(persona)

  if (persona !== prevPersona) {
    setPrevPersona(persona)
    setCalendarOwner(getDefaultCalendarOwner(persona))
  }

  const hours = useMemo(() => {
    const out = []
    for (let h = viewPrefs.startHour; h < viewPrefs.endHour; h += 1) out.push(h)
    return out.length ? out : [9]
  }, [viewPrefs.startHour, viewPrefs.endHour])

  const subSlotMinutes = useMemo(() => {
    const out = []
    for (let m = 0; m < 60; m += viewPrefs.intervalMinutes) out.push(m)
    return out.length ? out : [0]
  }, [viewPrefs.intervalMinutes])

  const dayStartMin = viewPrefs.startHour * 60
  const dayEndMin = viewPrefs.endHour * 60

  const assignedClients = useMemo(
    () => getClientsForUser(session.user.id, myWorkplace).filter(c => c.is_active !== false),
    [session.user.id, myWorkplace],
  )

  const roleFiltered = useMemo(
    () => filterAppointmentsForPersona(appointments, persona),
    [appointments, persona],
  )
  const filtered = useMemo(
    () => filterAppointmentsByCalendarOwner(appointments, calendarOwner, persona),
    [appointments, calendarOwner, persona],
  )

  const blurNames = shouldBlurClientIdentity(persona)

  const weekDates = weekDatesYmd(activeDate)
  const workingDates = workingWeekDatesYmd(activeDate)

  const navigateDate = (deltaDays) => {
    setActiveDate(prev => addDaysYmd(prev, deltaDays))
  }

  const jumpToday = () => setActiveDate(DEMO_TODAY)

  const periodLabel = useMemo(() => {
    switch (viewMode) {
      case 'month':
        return formatLongDate(startOfMonthYmd(activeDate)).split(',')[1]?.trim() || formatDisplayDate(startOfMonthYmd(activeDate))
      case 'week':
        return `${formatDisplayDate(weekDates[0])} – ${formatDisplayDate(weekDates[6])}`
      case 'working-week':
        return `${formatDisplayDate(workingDates[0])} – ${formatDisplayDate(workingDates[4])}`
      default:
        return formatLongDate(activeDate)
    }
  }, [viewMode, activeDate, weekDates, workingDates])

  const selectAppointment = (appt) => {
    setScheduleDraft(null)
    setSelectedAppointment(prev => (prev?.id === appt.id ? null : appt))
  }

  const openScheduleSlot = (sessionDate, startTime, manual = false) => {
    setSelectedAppointment(null)
    setScheduleDraft({ session_date: sessionDate, start_time: startTime, manual })
  }

  const openAddAppointment = () => {
    openScheduleSlot(activeDate, hhmm(viewPrefs.startHour, 0), true)
  }

  const closeSidePane = () => {
    setSelectedAppointment(null)
    setScheduleDraft(null)
  }

  const handleViewPrefsChange = (patch) => {
    setViewPrefs(prev => saveCalendarViewPreferences({ ...prev, ...patch }))
  }

  const handleAttendanceChange = (status) => {
    if (!selectedAppointment) return
    const saved = saveAppointment({
      id: selectedAppointment.id,
      client_id: selectedAppointment.client_id,
      session_date: selectedAppointment.session_date,
      start_time: selectedAppointment.start_time,
      end_time: selectedAppointment.end_time,
      appointment_type: selectedAppointment.appointment_type,
      therapy_modality: selectedAppointment.therapy_modality,
      location: selectedAppointment.location,
      attendance_status: status,
    }, session.user.id)
    setSelectedAppointment(saved)
    reloadAppointments()
  }

  const handleScheduleSave = async (payload) => {
    setScheduleSaving(true)
    try {
      const dates = payload.dates?.length ? payload.dates : [payload.session_date]
      let last = null
      for (const date of dates) {
        last = saveAppointment({
          ...payload,
          session_date: date,
          dates: undefined,
          clinician_id: session.user.id,
        }, session.user.id)
      }
      setScheduleDraft(null)
      reloadAppointments()
      if (last) {
        setActiveDate(last.session_date)
        if (viewMode === 'month') setViewMode('day')
        setSelectedAppointment(last)
      }
    } finally {
      setScheduleSaving(false)
    }
  }

  const handleRecurringSave = async (payload) => {
    setScheduleSaving(true)
    try {
      let last = null
      for (const date of payload.dates) {
        last = saveAppointment({
          client_id: payload.client_id,
          session_date: date,
          start_time: payload.start_time,
          end_time: payload.end_time,
          duration_minutes: payload.duration_minutes,
          therapy_modality: payload.therapy_modality,
          location: payload.location,
          appointment_type: payload.appointment_type,
          clinician_id: session.user.id,
        }, session.user.id)
      }
      setScheduleDraft(null)
      reloadAppointments()
      if (last) {
        setActiveDate(last.session_date)
        if (viewMode === 'month') setViewMode('day')
        setSelectedAppointment(last)
      }
    } finally {
      setScheduleSaving(false)
    }
  }

  const handleEditAppointment = (appt) => {
    setSelectedAppointment(null)
    setScheduleDraft({
      mode: 'edit',
      appointment: appt,
      session_date: appt.session_date,
      start_time: appt.start_time,
    })
  }

  const handleBookAnother = (appt) => {
    setSelectedAppointment(null)
    setScheduleDraft({
      mode: 'book_another',
      prefill: appt,
      session_date: addDaysYmd(appt.session_date, 7),
      start_time: appt.start_time,
      manual: true,
    })
  }

  const handleRecurring = (appt) => {
    setSelectedAppointment(null)
    setScheduleDraft({ mode: 'recurring', source: appt })
  }

  const gridHandlers = {
    blurNames,
    onSelectAppointment: selectAppointment,
    selectedAppointmentId: selectedAppointment?.id,
    hours,
    subSlotMinutes,
    dayStartMin,
    dayEndMin,
    onEmptySlotClick: openScheduleSlot,
  }

  const calendarGrid = (
    <>
      {viewMode === 'month' && (
        <MonthView
          activeDate={activeDate}
          appointments={filtered}
          onSelectDate={(d) => { setActiveDate(d); setViewMode('day') }}
          blurNames={blurNames}
          onSelectAppointment={selectAppointment}
        />
      )}
      {viewMode === 'week' && (
        <TimeGridView
          dates={weekDates}
          appointments={filtered}
          activeDate={activeDate}
          onSelectDate={setActiveDate}
          {...gridHandlers}
        />
      )}
      {viewMode === 'working-week' && (
        <TimeGridView
          dates={workingDates}
          appointments={filtered}
          activeDate={activeDate}
          onSelectDate={setActiveDate}
          {...gridHandlers}
        />
      )}
      {viewMode === 'day' && (
        <DayView
          activeDate={activeDate}
          appointments={filtered}
          {...gridHandlers}
        />
      )}
    </>
  )

  const paneOpen = Boolean(selectedAppointment || scheduleDraft)

  return (
    <div className="calendar-module">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar__row">
          <div className="calendar-toolbar__nav">
            <button type="button" className="calendar-toolbar__btn" onClick={() => navigateDate(viewMode === 'month' ? -30 : viewMode === 'day' ? -1 : -7)} aria-label="Previous period">←</button>
            <button type="button" className="calendar-toolbar__btn" onClick={() => navigateDate(viewMode === 'month' ? 30 : viewMode === 'day' ? 1 : 7)} aria-label="Next period">→</button>
            <button type="button" className="calendar-toolbar__btn calendar-toolbar__btn--today" onClick={jumpToday}>Today</button>
            <button type="button" className="calendar-toolbar__btn calendar-toolbar__btn--add" onClick={openAddAppointment}>
              + Add appointment
            </button>
          </div>

          <h2 className="calendar-toolbar__period">{periodLabel}</h2>

          <div className="calendar-toolbar__views">
            {VIEW_MODES.map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`calendar-toolbar__view${viewMode === mode.id ? ' calendar-toolbar__view--active' : ''}`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calendar-toolbar__row calendar-toolbar__row--secondary">
          <div className="calendar-toolbar__left">
            <div className="calendar-toolbar__owner">
              <label htmlFor="calendar-owner-select" className="calendar-toolbar__owner-label">
                {showOwnerPicker ? 'View calendar for' : 'Your calendar'}
              </label>
              <select
                id="calendar-owner-select"
                className="calendar-toolbar__owner-select role-select__control"
                value={calendarOwner}
                onChange={e => setCalendarOwner(e.target.value)}
                disabled={!showOwnerPicker}
              >
                {ownerOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <CalendarViewOptions
              prefs={viewPrefs}
              open={viewOptionsOpen}
              onToggle={() => setViewOptionsOpen(o => !o)}
              onChange={handleViewPrefsChange}
            />
          </div>
          <ModalityLegend />
        </div>
      </div>

      <CalendarWorkspaceFrame
        paneOpen={paneOpen}
        grid={<div className="calendar-module__body">{calendarGrid}</div>}
        accessory={scheduleDraft?.mode === 'recurring' ? (
          <RecurringSchedulePanel
            key={scheduleDraft.source.id}
            source={scheduleDraft.source}
            onSave={handleRecurringSave}
            onCancel={closeSidePane}
            saving={scheduleSaving}
          />
        ) : scheduleDraft ? (
          <ScheduleSessionPanel
            key={scheduleDraft.appointment?.id || scheduleDraft.prefill?.id || `${scheduleDraft.mode}-${scheduleDraft.session_date}-${scheduleDraft.start_time}`}
            sessionDate={scheduleDraft.session_date}
            startTime={scheduleDraft.start_time}
            appointment={scheduleDraft.mode === 'edit' ? scheduleDraft.appointment : null}
            prefill={scheduleDraft.mode === 'book_another' ? scheduleDraft.prefill : null}
            clients={assignedClients}
            allAppointments={filtered}
            clinicianId={session.user.id}
            showDateField={Boolean(scheduleDraft.manual) || scheduleDraft.mode === 'book_another'}
            onSave={handleScheduleSave}
            onCancel={closeSidePane}
            saving={scheduleSaving}
          />
        ) : selectedAppointment ? (
          <EventDrawer
            appointment={selectedAppointment}
            allAppointments={filtered}
            onClose={closeSidePane}
            onAttendanceChange={handleAttendanceChange}
            onEdit={handleEditAppointment}
            onBookAnother={handleBookAnother}
            onRecurring={handleRecurring}
          />
        ) : null}
      />
    </div>
  )
}
