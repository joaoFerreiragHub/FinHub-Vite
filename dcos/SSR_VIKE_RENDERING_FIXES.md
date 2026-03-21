# SSR + Vike — Problemas de Renderização Resolvidos

> Data: 2026-03-21
> Commits: `02aa430`, `c9d6019`, `3e9f88b`
> Documentação completa: `Front/docs/finhub/SSR_VIKE_FIXES.md`

---

## Contexto

Migração de `vite-plugin-ssr` → **Vike 0.4.255** com React 19 + React Router v6 + Zustand.
A migração partiu vários mecanismos de renderização que resultavam em:
- Páginas sem estilos (CSS não injetado)
- Páginas não interativas após hydration
- Crashes no server render
- Navegação duplicada ou em loop

---

## Problemas Resolvidos

### 1 — CSS não injetado em SSR
**Causa:** `index.css` não estava importado em `+onRenderHtml.tsx` / `+onRenderClient.tsx`. O Vike só injeta CSS na `<head>` se o detetar nos ficheiros de render.
**Fix:** Adicionar `import '../index.css'` em ambos os ficheiros de render.
**Ficheiros:** `src/pages/+onRenderHtml.tsx`, `src/pages/+onRenderClient.tsx`, `src/index.css`, `src/styles/globals.css`

### 2 — Hydration mismatch por Zustand (páginas mortas)
**Causa:** Zustand lê `localStorage` antes do React arrancar no cliente. O servidor renderiza `PublicLayout` (user=null), o cliente renderiza `UserLayout` imediatamente — mismatch de estrutura HTML → hydration falha silenciosamente → sem interatividade.
**Fix:** Em `PageShell.tsx`, deferir a decisão de layout com `useState(false)` + `useEffect`. O primeiro render no cliente é sempre `PublicLayout` (igual ao servidor).
**Ficheiro:** `src/renderer/PageShell.tsx`

### 3 — Shape do export `Page` ambíguo
**Causa:** Os `+Page.tsx` podem exportar o componente de formas distintas (`export default`, `export function Page`, nested default). Não havia normalização.
**Fix:** Criar `resolvePageComponent.ts` que resolve todos os shapes possíveis.
**Ficheiro:** `src/renderer/resolvePageComponent.ts`

### 4 — Root React recriado em cada navegação
**Causa:** `createRoot()` / `hydrateRoot()` era chamado em cada invocação do `onRenderClient`. O React não permite múltiplas roots no mesmo elemento.
**Fix:** Root guardada como singleton a nível de módulo. Navegações seguintes chamam `root.render(app)` em vez de criar nova root.
**Ficheiro:** `src/pages/+onRenderClient.tsx`

### 5 — Dupla navegação React Router + Vike
**Causa:** Vike intercetava clicks em `<a>` e React Router também. `BrowserRouter` lia `window.location` (não disponível no servidor).
**Fix:** `VikeRouter` em `PageShell.tsx` — custom `<Router>` que delega push/replace ao `vikeNavigate()`. Interceção automática do Vike desativada via `window._disableAutomaticLinkInterception = true`.
**Ficheiro:** `src/renderer/PageShell.tsx`, `src/pages/+onRenderClient.tsx`

### 6 — `react-helmet-async` CJS/ESM interop crash em SSR
**Causa:** Em SSR o Vite usa `require()` do Node para módulos externos → `HelmetProvider` resolvia para `undefined`.
**Fix:** `vite.config.ts` → `ssr.noExternal: ['react-helmet-async']`. Wrapper `src/lib/helmet.ts` que resolve os named exports em ambos os contextos.
**Ficheiros:** `vite.config.ts`, `src/lib/helmet.ts`

### 7 — Ordem dos `@import` no CSS
**Causa:** `@import './styles/design-tokens.css'` estava depois de `@tailwind base` → tokens não disponíveis durante processamento do Tailwind.
**Fix:** Mover `@import` dos tokens para **antes** de qualquer diretiva `@tailwind`.
**Ficheiros:** `src/index.css`, `src/styles/globals.css`

---

## Ficheiros Chave

| Ficheiro | Responsabilidade |
|----------|-----------------|
| `src/pages/+onRenderHtml.tsx` | Render server-side, CSS inject |
| `src/pages/+onRenderClient.tsx` | Hydration + root singleton + navegação |
| `src/renderer/PageShell.tsx` | Providers + VikeRouter + layout defer |
| `src/renderer/resolvePageComponent.ts` | Normaliza shape dos exports de página |
| `src/lib/helmet.ts` | Wrapper CJS/ESM para react-helmet-async |
| `vite.config.ts` | `ssr.noExternal` para bundling correto |
| `src/index.css` / `src/styles/globals.css` | Ordem correta dos @imports |

---

## Regras Futuras

1. **Nunca ler `localStorage` / Zustand persist no render path.** Deferir com `useEffect`.
2. **Nunca chamar `createRoot`/`hydrateRoot` mais de uma vez** no mesmo elemento.
3. **Novos pacotes CJS com problemas em SSR** → `ssr.noExternal` + wrapper em `src/lib/`.
4. **Não usar `BrowserRouter` ou `MemoryRouter`** — usar o `VikeRouter` existente.
5. **CSS custom properties antes do `@tailwind base`** sempre.
6. **Importar o CSS de entrada em ambos** os ficheiros de render do Vike.
