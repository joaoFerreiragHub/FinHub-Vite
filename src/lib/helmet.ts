// CJS/ESM dual interop para react-helmet-async:
//
// - Vite SSR (server): bundla o CJS como default export → precisa de .default
// - Vite client (dep optimizer): cria named exports SEM default export
//
// import * as _mod captura AMBOS os casos. Depois resolvemos com fallback.
import * as _mod from 'react-helmet-async'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _any = _mod as any
const HelmetProvider = _any.HelmetProvider ?? _any.default?.HelmetProvider
const Helmet = _any.Helmet ?? _any.default?.Helmet

export { HelmetProvider, Helmet }
