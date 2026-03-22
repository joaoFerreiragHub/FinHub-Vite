import { Helmet } from '@/lib/helmet'
import PrivacyPage from '@/pages/PrivacyPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Politica de Privacidade | FinHub</title>
        <meta
          name="description"
          content="Consulta a Politica de Privacidade da FinHub e como tratamos os teus dados pessoais."
        />
      </Helmet>
      <PrivacyPage />
    </>
  )
}
