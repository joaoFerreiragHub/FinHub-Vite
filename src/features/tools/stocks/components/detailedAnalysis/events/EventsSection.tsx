// src/features/tools/stocks/components/detailedAnalysis/events/EventsSection.tsx

import { EarningsCalendar } from '../events/EarningsCalendar'
import { MacroCalendar } from '../events/MacroCalendar'

export function EventsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-base font-semibold mb-2">📆 Calendário de Resultados</h3>
        <EarningsCalendar />
      </div>
      <div>
        <h3 className="text-base font-semibold mb-2">🌍 Calendário Macroeconómico</h3>
        <MacroCalendar />
      </div>
    </div>
  )
}
