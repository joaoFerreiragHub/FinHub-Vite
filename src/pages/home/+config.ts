// src/pages/home/+config.ts
export default {
  passToClient: ['routeParams', 'pageProps', 'user'],
  // Isto indica que a página deve ser gerada estaticamente na build
  prerender: true,
}
