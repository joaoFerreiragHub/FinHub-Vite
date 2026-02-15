import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'

interface ScoreBlockProps {
  label: string
  value: string
  color: 'green' | 'yellow' | 'red'
  tooltip?: string
  icon?: string
}

function ScoreBlock({ label, value, color, tooltip, icon }: ScoreBlockProps) {
  const bg = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }[color]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'rounded-lg px-4 py-2 shadow-sm flex items-center gap-2 cursor-default transition',
              bg,
            )}
          >
            <span className="text-xl">{icon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-lg font-semibold">{value}</span>
            </div>
          </div>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

interface ScoresSummaryProps {
  data: {
    qualidadeScore?: number
    crescimentoScore?: number
    valuationGrade?: 'A' | 'B' | 'C' | 'D' | 'F'
    riscoScore?: number
  }
}

export function ScoresSummary({ data }: ScoresSummaryProps) {
  const { qualidadeScore = 7, crescimentoScore = 6, valuationGrade = 'B', riscoScore = 2 } = data

  const riscoLabel = riscoScore >= 3 ? 'Baixo' : riscoScore >= 1.8 ? 'Médio' : 'Alto'

  const riscoColor = riscoScore >= 3 ? 'green' : riscoScore >= 1.8 ? 'yellow' : 'red'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <ScoreBlock
        label="Qualidade"
        value={`${qualidadeScore}/10`}
        color={qualidadeScore >= 7 ? 'green' : qualidadeScore >= 4 ? 'yellow' : 'red'}
        tooltip="Avaliação geral da qualidade financeira da empresa."
        icon="🧠"
      />
      <ScoreBlock
        label="Crescimento"
        value={`${crescimentoScore}/10`}
        color={crescimentoScore >= 7 ? 'green' : crescimentoScore >= 4 ? 'yellow' : 'red'}
        tooltip="Pontuação baseada na evolução de receitas, lucros e ativos."
        icon="📈"
      />
      <ScoreBlock
        label="Valuation"
        value={valuationGrade}
        color={
          valuationGrade === 'A' || valuationGrade === 'B'
            ? 'green'
            : valuationGrade === 'C'
              ? 'yellow'
              : 'red'
        }
        tooltip={`Nota atribuída pela FMP com base em múltiplos e DCF. Ex: ${valuationGrade}`}
        icon="💰"
      />
      <ScoreBlock
        label="Risco"
        value={riscoLabel}
        color={riscoColor}
        tooltip={`Altman Z-Score: ${riscoScore.toFixed(1)}\n• >3: Risco Baixo\n• 1.8–3: Risco Médio\n• <1.8: Risco Elevado`}
        icon="⚠️"
      />
    </div>
  )
}
