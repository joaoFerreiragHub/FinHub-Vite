import { Helmet } from '@/lib/helmet'
import FAQPage from '@/pages/FAQPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>FAQ | FinHub</title>
        <meta
          name="description"
          content="Perguntas frequentes sobre conta, conteudo, seguranca e funcionamento da FinHub."
        />
      </Helmet>
      <FAQPage />
    </>
  )
}
