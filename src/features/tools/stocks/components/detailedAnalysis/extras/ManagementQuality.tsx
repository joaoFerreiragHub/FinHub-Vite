import { Card, CardContent } from '@/components/ui'

interface ManagementQualityProps {
  data?: {
    ceoTenure?: number // em anos
    ceoExperience?: string
    executionScore?: number // 0-100
  }
}

export function ManagementQuality({ data }: ManagementQualityProps) {
  const ceoTenure = data?.ceoTenure ?? 5
  const ceoExperience = data?.ceoExperience ?? '25 anos na indústria'
  const executionScore = data?.executionScore ?? 82

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <h4 className="text-base font-semibold">Qualidade da Gestão</h4>
        <ul className="text-sm space-y-1">
          <li>
            Tempo médio no cargo (CEO): <strong>{ceoTenure} anos</strong>
          </li>
          <li>
            Experiência do CEO: <strong>{ceoExperience}</strong>
          </li>
          <li>
            Histórico de execução: <strong>{executionScore}/100</strong>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
