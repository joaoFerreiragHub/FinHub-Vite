// src/features/tools/stocks/components/detailedAnalysis/extras/ExtrasSection.tsx

import { Card, CardContent } from '@/components/ui'
import { CustomAlertsForm } from '../extras/CustomAlertsForm'
import { EarningsSurpriseHistory } from '../extras/EarningsSurpriseHistory'
import { ExportButtons } from '../extras/ExportButtons'
import { ManagementQuality } from '../extras/ManagementQuality'

export function ExtrasSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <CustomAlertsForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ExportButtons />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <EarningsSurpriseHistory />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ManagementQuality />
        </CardContent>
      </Card>
    </div>
  )
}
