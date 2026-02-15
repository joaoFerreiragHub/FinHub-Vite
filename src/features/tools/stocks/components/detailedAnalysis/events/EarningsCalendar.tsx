// src/features/tools/stocks/components/detailedAnalysis/events/EarningsCalendar.tsx

import { Card, CardContent } from '@/components/ui'

const mockEarnings = [
  { date: '2025-06-10', company: 'Apple Inc.', time: 'After Market Close' },
  { date: '2025-06-12', company: 'Microsoft Corp.', time: 'Before Market Open' },
  { date: '2025-06-15', company: 'Tesla Inc.', time: 'After Market Close' },
]

export function EarningsCalendar() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <ul className="text-sm space-y-1">
          {mockEarnings.map((event, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{event.date}</span>
              <span>{event.company}</span>
              <span className="text-muted-foreground text-xs">{event.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
