# Vike V1 - Fase 0 (Inventario)

Data: 2026-03-11  
Branch: `chore/vike-v1-migration-plan`

## Estado atual (V0.4)
- `*.page.tsx`: 97
- `*.page.config.ts`: 1
- ficheiros `*.page.*` (total, incluindo client/server/d.ts): 100
- rotas dinamicas (`@param`): 13
- `index.page.tsx`: 63

## Ficheiros de entrada centrais (SSR)
- `src/pages/_default.page.client.tsx`
- `src/pages/_default.page.server.tsx`
- `src/pages/_error.page.tsx`
- `src/lib/types/pageContext.ts`
- `src/renderer/PageShell.tsx`

## Rotas dinamicas identificadas
- `src/pages/artigos/@slug.page.tsx`
- `src/pages/creators/@username.page.tsx`
- `src/pages/cursos/@slug.page.tsx`
- `src/pages/hub/articles/@slug.page.tsx`
- `src/pages/hub/books/@slug.page.tsx`
- `src/pages/hub/courses/@slug.page.tsx`
- `src/pages/hub/lives/@slug.page.tsx`
- `src/pages/hub/podcasts/@slug.page.tsx`
- `src/pages/hub/videos/@slug.page.tsx`
- `src/pages/mercados/recursos/@vertical.page.tsx`
- `src/pages/perfil/@username.page.tsx`
- `src/pages/recursos/@slug.page.tsx`
- `src/pages/videos/@slug.page.tsx`

## Risco principal
- O Vike nao permite mistura de design V0.4 com V1 no mesmo estado de codigo.
- A migracao deve entrar como switch estrutural completo dentro deste branch.

## Proximo passo (Fase 1)
1. Definir mapping V0.4 -> V1 por tipo de pagina (index, dinamica, default/error).
2. Preparar checklist de rename/move para executar migracao em bloco.
3. Executar migracao estrutural e validar:
   - `yarn lint`
   - `yarn test`
   - `yarn build`
   - `yarn ssr:dev` (sem warning de deprecated design)
