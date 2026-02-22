import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'

interface ScoreCardProps {
  label: string
  displayValue: string
  pct: number
  color: 'green' | 'yellow' | 'red'
  sublabel?: string
  tooltip?: string
}

function ScoreCard({ label, displayValue, pct, color, sublabel, tooltip }: ScoreCardProps) {
  const textColor = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  }[color]

  const barColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }[color]

  const borderColor = {
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    red: 'border-l-red-500',
  }[color]

  const card = (
    <div
      className={cn(
        'rounded-xl border border-border border-l-4 bg-card px-4 py-3 shadow-sm space-y-2 cursor-default transition hover:shadow-md select-none',
        borderColor,
      )}
    >
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className={cn('text-2xl font-bold tabular-nums leading-none', textColor)}>
        {displayValue}
      </div>
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        {sublabel && <p className="text-[11px] text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  )

  if (!tooltip) return card

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-sm whitespace-pre-line">
          {tooltip}
        </TooltipContent>
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

const VALUATION_PCT: Record<string, number> = { A: 90, B: 75, C: 55, D: 35, F: 20 }
const VALUATION_LABEL: Record<string, string> = {
  A: 'Muito atrativo',
  B: 'Atrativo',
  C: 'Razoável',
  D: 'Caro',
  F: 'Muito caro',
}

export function ScoresSummary({ data }: ScoresSummaryProps) {
  const { qualidadeScore = 0, crescimentoScore = 0, valuationGrade = 'C', riscoScore = 0 } = data

  const riscoLabel =
    riscoScore >= 3 ? 'Risco Baixo' : riscoScore >= 1.8 ? 'Risco Médio' : 'Risco Elevado'
  const riscoColor: 'green' | 'yellow' | 'red' =
    riscoScore >= 3 ? 'green' : riscoScore >= 1.8 ? 'yellow' : 'red'

  const qualColor: 'green' | 'yellow' | 'red' =
    qualidadeScore >= 7 ? 'green' : qualidadeScore >= 4 ? 'yellow' : 'red'
  const qualLabel = qualidadeScore >= 7 ? 'Forte' : qualidadeScore >= 4 ? 'Moderado' : 'Fraco'

  const growColor: 'green' | 'yellow' | 'red' =
    crescimentoScore >= 7 ? 'green' : crescimentoScore >= 4 ? 'yellow' : 'red'
  const growLabel =
    crescimentoScore >= 7 ? 'Acelerado' : crescimentoScore >= 4 ? 'Moderado' : 'Lento'

  const valColor: 'green' | 'yellow' | 'red' =
    valuationGrade === 'A' || valuationGrade === 'B'
      ? 'green'
      : valuationGrade === 'C'
        ? 'yellow'
        : 'red'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <ScoreCard
        label="Qualidade"
        displayValue={`${qualidadeScore}/10`}
        pct={qualidadeScore * 10}
        color={qualColor}
        sublabel={`Piotroski F-Score · ${qualLabel}`}
        tooltip={`Piotroski F-Score: ${qualidadeScore}/9\n≥7 → Forte  |  4-6 → Moderado  |  <4 → Fraco`}
      />
      <ScoreCard
        label="Crescimento"
        displayValue={`${crescimentoScore}/10`}
        pct={crescimentoScore * 10}
        color={growColor}
        sublabel={`CAGR + EPS · ${growLabel}`}
        tooltip="Pontuação baseada na evolução de receitas, lucros e ativos."
      />
      <ScoreCard
        label="Valuation"
        displayValue={valuationGrade}
        pct={VALUATION_PCT[valuationGrade] ?? 55}
        color={valColor}
        sublabel={VALUATION_LABEL[valuationGrade] ?? '—'}
        tooltip={`Nota baseada em múltiplos e DCF (FMP).\nA/B → Atrativo  |  C → Razoável  |  D/F → Caro`}
      />
      <ScoreCard
        label="Risco"
        displayValue={`${riscoScore.toFixed(1)}/10`}
        pct={(riscoScore / 10) * 100}
        color={riscoColor}
        sublabel={`Altman Z-Score · ${riscoLabel}`}
        tooltip={`Altman Z-Score (normalizado): ${riscoScore.toFixed(1)}/10\n>3 → Risco Baixo  |  1.8–3 → Risco Médio  |  <1.8 → Risco Elevado`}
      />
    </div>
  )
}
