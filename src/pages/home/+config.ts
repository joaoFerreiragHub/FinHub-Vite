// src/pages/home/+config.ts
export const passToClient = ['routeParams', 'pageProps', 'user']
export default {
  // Isto indica que a página deve ser gerada estaticamente na build
  prerender: true,
}
