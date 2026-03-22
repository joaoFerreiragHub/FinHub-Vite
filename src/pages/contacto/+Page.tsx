import { Helmet } from '@/lib/helmet'
import ContactPage from '@/pages/ContactPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Contacto | FinHub</title>
        <meta
          name="description"
          content="Fala com a equipa FinHub para suporte, reportes e esclarecimentos."
        />
      </Helmet>
      <ContactPage />
    </>
  )
}
