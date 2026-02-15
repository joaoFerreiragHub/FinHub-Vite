// src/features/creators/components/contentManagement/lives/LiveCalendar.tsx
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { LiveEvent } from '~/features/hub/types/liveEvent'

interface LiveCalendarProps {
  events: LiveEvent[]
  onDateClick: (arg: DateClickArg) => void
  onEventClick: (event: LiveEvent) => void
}

export default function LiveCalendar({ events, onDateClick, onEventClick }: LiveCalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={onDateClick}
      eventClick={(arg) => {
        const event = events.find(
          (e) => e.title === arg.event.title && e.date === arg.event.startStr,
        )
        if (event) onEventClick(event)
      }}
      events={events.map((e) => ({ title: e.title, date: e.date }))}
      height="auto"
    />
  )
}
