import { Helmet } from '@/lib/helmet'
import FinancialDisclaimerPage from '@/pages/FinancialDisclaimerPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Aviso Legal Financeiro | FinHub</title>
        <meta
          name="description"
          content="Consulta o aviso legal financeiro da FinHub e os limites de responsabilidade do conteudo."
        />
      </Helmet>
      <FinancialDisclaimerPage />
    </>
  )
}
