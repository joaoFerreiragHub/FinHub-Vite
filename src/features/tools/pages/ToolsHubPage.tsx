import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export default function ToolsHubPage() {
  return (
    <PlaceholderPage
      section="Ferramentas"
      title="Ferramentas para analise, comparacao e simulacao"
      description="Nesta area vais encontrar calculadoras, comparadores e paineis para apoiar decisoes com mais clareza."
      primaryAction={{ label: 'Abrir FIRE simulator', to: '/ferramentas/fire' }}
      secondaryAction={{ label: 'Ver mercados', to: '/mercados' }}
      quickLinks={[
        { label: 'FIRE overview', to: '/ferramentas/fire' },
        { label: 'FIRE portfolio', to: '/ferramentas/fire/portfolio' },
        { label: 'FIRE simulador', to: '/ferramentas/fire/simulador' },
        { label: 'Mercados', to: '/mercados' },
      ]}
    />
  )
}
