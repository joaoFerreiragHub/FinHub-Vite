import { Helmet } from '@/lib/helmet'
import TermsPage from '@/pages/TermsPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Termos de Servico | FinHub</title>
        <meta
          name="description"
          content="Consulta os Termos de Servico da FinHub e as condicoes de utilizacao da plataforma."
        />
      </Helmet>
      <TermsPage />
    </>
  )
}
