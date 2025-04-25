import React from 'react'
import fallbackImage from '../../../../public/fallback.jpg'
import { Card, CardContent } from '../../ui/card'


type Event = {
  id: string
  name: string
  description?: string
  date: string
  location?: string
  bannerImage?: string
}

type Props = {
  events: Event[]
  onEventClick: (event: Event) => void
}

const EventsSection: React.FC<Props> = ({ events, onEventClick }) => {
  const stripHtml = (html?: string): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Eventos</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            onClick={() => onEventClick(event)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              src={event.bannerImage || fallbackImage}
              alt={event.name}
              className="w-full h-40 object-cover rounded-t-md"
            />
            <CardContent className="p-4 space-y-2">
              <h4 className="text-lg font-semibold text-foreground">
                {event.name}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {stripHtml(event.description)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default EventsSection
