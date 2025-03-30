// src/pages/index.page.tsx
export function Page() {
  return (
    <main>
      <h1>Bem-vindo à tua app com SSR!</h1>
    </main>
  )
}

// O vite-plugin-ssr espera um objeto como exportação padrão
export default {
  Page, // Componente React que será renderizado
  // Você pode adicionar outras propriedades aqui conforme necessário:
  // documentProps: {
  //   title: 'Título da Página',
  //   description: 'Descrição da página'
  // },
  // onBeforeRender: async () => {
  //   // Fetch data, etc.
  //   return { pageProps: { /* ... */ } }
  // }
}
