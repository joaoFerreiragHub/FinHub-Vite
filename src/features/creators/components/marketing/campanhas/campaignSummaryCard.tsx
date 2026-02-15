import React from 'react'
import { Badge } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Eye, MousePointerClick, Timer, CheckCircle, XCircle } from 'lucide-react'

export type CampaignStatus = 'active' | 'paused' | 'pending' | 'rejected'

export interface Campaign {
  id: string
  title: string
  impressions: number
  clicks: number
  ctr: number
  status: CampaignStatus
  startDate: string
  endDate?: string
}

interface CampaignSummaryCardProps {
  campaign: Campaign
}

const statusMap: Record<
  CampaignStatus,
  { label: string; icon: () => React.ReactElement; color: string }
> = {
  active: {
    label: 'Ativa',
    icon: () => <CheckCircle className="w-4 h-4" />,
    color: 'green',
  },
  paused: {
    label: 'Pausada',
    icon: () => <Timer className="w-4 h-4" />,
    color: 'yellow',
  },
  pending: {
    label: 'Em análise',
    icon: () => <Timer className="w-4 h-4" />,
    color: 'blue',
  },
  rejected: {
    label: 'Rejeitada',
    icon: () => <XCircle className="w-4 h-4" />,
    color: 'red',
  },
}

export default function CampaignSummaryCard({ campaign }: CampaignSummaryCardProps) {
  const { label, icon, color } = statusMap[campaign.status]

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-base font-semibold">{campaign.title}</CardTitle>
        <Badge variant="outline" className={`text-${color}-600 border-${color}-200`}>
          <span className="flex items-center gap-1">
            {icon()} {label}
          </span>
        </Badge>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {campaign.impressions} impressões
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-4 h-4" /> {campaign.clicks} cliques
          </span>
        </div>
        <div className="flex justify-between">
          <span>CTR: {campaign.ctr.toFixed(1)}%</span>
          <span>Início: {campaign.startDate}</span>
        </div>
        {campaign.endDate && <div className="text-xs">Fim previsto: {campaign.endDate}</div>}
      </CardContent>
    </Card>
  )
}
