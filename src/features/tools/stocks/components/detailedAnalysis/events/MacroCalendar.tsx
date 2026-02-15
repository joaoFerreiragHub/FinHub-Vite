// src/features/tools/stocks/components/detailedAnalysis/events/MacroCalendar.tsx

import { Card, CardContent } from '@/components/ui'

const mockEvents = [
  { date: '2025-06-11', event: 'FOMC Meeting' },
  { date: '2025-06-13', event: 'US Inflation Rate (YoY)' },
  { date: '2025-06-16', event: 'Eurozone GDP Q1' },
]

export function MacroCalendar() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <ul className="text-sm space-y-1">
          {mockEvents.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.date}</span>
              <span>{item.event}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
