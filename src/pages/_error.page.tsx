export default function ErrorPage({ is404 }: { is404: boolean }) {
  return (
    <main>
      <h1>{is404 ? 'Página não encontrada' : 'Erro inesperado'}</h1>
    </main>
  )
}
