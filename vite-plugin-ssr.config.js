// vite-plugin-ssr.config.js
export default {
  prerender: {
    noExtraDir: true,
  },
  passToClient: ['routeParams', 'pageProps', 'user'],
}
