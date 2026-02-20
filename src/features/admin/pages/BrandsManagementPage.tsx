import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

interface BrandsManagementPageProps {
  embedded?: boolean
}

export default function BrandsManagementPage({ embedded = false }: BrandsManagementPageProps) {
  return (
    <PlaceholderPage
      section="Administracao"
      title={embedded ? 'Recursos (em evolucao)' : 'Gestao de Recursos'}
      description="Estamos a finalizar a experiencia desta pagina com o mesmo padrao de navegacao e responsividade da Home."
    />
  )
}
