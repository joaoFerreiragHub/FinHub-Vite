import { Helmet } from '@/lib/helmet'
import CookiesPage from '@/pages/CookiesPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Politica de Cookies | FinHub</title>
        <meta
          name="description"
          content="Consulta a Politica de Cookies da FinHub e as opcoes de consentimento disponiveis."
        />
      </Helmet>
      <CookiesPage />
    </>
  )
}
