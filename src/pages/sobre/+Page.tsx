import { Helmet } from '@/lib/helmet'
import AboutPage from '@/pages/AboutPage'

export function Page() {
  return (
    <>
      <Helmet>
        <title>Sobre a FinHub | FinHub</title>
        <meta
          name="description"
          content="Conhece a missao, visao e principios da FinHub para literacia financeira em Portugal."
        />
      </Helmet>
      <AboutPage />
    </>
  )
}
