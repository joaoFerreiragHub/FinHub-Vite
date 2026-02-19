import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export default function ToolsHubPage() {
  return (
    <PlaceholderPage
      section="Ferramentas"
      title="Ferramentas para analise, comparacao e decisao"
      description="Nesta area vais encontrar calculadoras, comparadores e paineis para apoiar decisoes com mais clareza."
      primaryAction={{ label: 'Ver mercados', to: '/recursos/exchanges' }}
      secondaryAction={{ label: 'Explorar conteudos', to: '/explorar/tudo' }}
      quickLinks={[
        { label: 'Exchanges', to: '/recursos/exchanges' },
        { label: 'Corretoras', to: '/recursos/corretoras' },
        { label: 'Plataformas', to: '/recursos/plataformas' },
        { label: 'Noticias', to: '/aprender/noticias' },
      ]}
    />
  )
}
