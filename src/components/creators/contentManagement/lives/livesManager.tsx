// LivesManager.tsx
import { useState } from "react"
import { LiveEvent } from "../../../../types/liveEvent"

import LiveEventModal from "./LiveEventModal"
import LiveCalendar from "./LiveCalendar"
import { Button } from "../../../ui/button"
import { mockLiveEvents } from "../../../../mock/mockLiveEvents"

export default function LivesManager() {
  // const [events, setEvents] = useState<LiveEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null)
  const [events, setEvents] = useState<LiveEvent[]>(mockLiveEvents)


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Planeador de Lives</h1>
      <Button onClick={() => {
        setSelectedDate(new Date().toISOString().split("T")[0]) // data de hoje por default
        setEditingEvent(null)
        setShowModal(true)
      }}>
        Novo Evento
      </Button>
      <LiveCalendar
        events={events}
        onDateClick={(arg) => {
          setSelectedDate(arg.dateStr)
          setShowModal(true)
        }}
        onEventClick={(event) => {
          setEditingEvent(event)
          setSelectedDate(event.date)
          setShowModal(true)
        }}
      />
          <LiveEventModal
            open={showModal}
            initialDate={selectedDate}
            initialData={editingEvent ?? undefined}
            onClose={() => {
              setShowModal(false)
              setSelectedDate(null)
              setEditingEvent(null)
            }}
            onSave={(event) => {
              setEvents((prev) => {
                const exists = prev.find((e) => e.id === event.id)
                return exists
                  ? prev.map((e) => (e.id === event.id ? event : e))
                  : [...prev, event]
              })
            }}
            onDelete={(id) => {
              setEvents((prev) => prev.filter((e) => e.id !== id))
            }}
          />


    </div>
  )
}
