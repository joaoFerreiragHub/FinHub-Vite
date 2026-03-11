# Plano de Execucao - Migracao Vike V1

Data: 2026-03-11  
Branch: `chore/vike-v1-migration-plan`  
Estado inicial: Fase 0 (inventario) concluida

## 0) Estado de execucao (checkpoint 2026-03-11)
- CP1: concluido (mapping e inventario fechados em docs).
- CP2: concluido (entrypoints globais migrados para `+onRenderClient` e `+onRenderHtml`).
- CP3: concluido (ondas public/core convertidas para `+Page`).
- CP4: concluido (ondas `hub` e `creators` convertidas para `+Page`).
- CP5: concluido (ondas `admin` convertidas para `+Page`).
- CP6: concluido (remocao de legado `*.page.*` + validacao sem warning de design deprecated).
- CP7: em fecho documental/final de branch para merge.

### Evidencias desta ronda (2026-03-11)
- `yarn lint` -> PASS.
- `yarn test` -> PASS (35 suites / 189 testes).
- `yarn build` -> PASS.
- `yarn ssr:dev` -> arranque limpo; warning `You are using Vike's deprecated design` nao observado.
- `yarn test:e2e:release -- --list` -> PASS (listagem de 12 testes); observacao: reporter HTML com EPERM no ambiente local, sem bloquear comando.
- `yarn test:e2e:a11y -- --list` -> PASS (listagem de 2 testes).

## 1) Objetivo e definicao de concluido
- Objetivo: migrar de Vike V0.4 para V1 sem regressao funcional e sem perda de produtividade.
- Definicao de concluido:
  - warning `You are using Vike's deprecated design` eliminado;
  - 0 ficheiros legados de routing/render V0.4 ativos;
  - `yarn lint`, `yarn test`, `yarn build` e `yarn ssr:dev` verdes;
  - smoke E2E essencial verde para rotas criticas.

## 2) Princípios de execucao
- Nao misturar V0.4 e V1 no estado final de cada checkpoint.
- Migracao em ondas com gates de qualidade por checkpoint.
- Cada checkpoint fecha com commit dedicado, push e registo em `ESTADO_IMPLEMENTADO.md`.
- Se houver bloqueio de hook Husky por erro Win32 5, validar checks manualmente e usar `--no-verify` com registo no checkpoint.

## 3) Estrutura de checkpoints

## CP1 - Mapping tecnico V0.4 -> V1
- Entregaveis:
  - matriz de mapeamento por tipo de pagina (index, dinamica, error/default);
  - mapa de hooks atuais (`render`, `passToClient`, `onBeforeRender`) para hooks/config V1;
  - lista de risco por dominio (`admin`, `creators`, `hub`, `mercados`, `recursos`).
- Gate de qualidade:
  - validacao documental (sem alteracao funcional).
- Commit:
  - `docs(vike): define v0.4->v1 route and hook mapping`

## CP2 - Bootstrap V1 global (runtime SSR/client)
- Entregaveis:
  - configuracao global V1 funcional (`+config`/hooks globais equivalentes);
  - migracao de `_default.page.client.tsx` e `_default.page.server.tsx` para entrypoints V1;
  - `passToClient` preservado no novo modelo.
- Gate de qualidade:
  - `yarn lint`
  - `yarn test`
  - `yarn build`
  - `yarn ssr:dev` sem crash.
- Commit:
  - `refactor(vike): migrate global render pipeline to v1 hooks`

## CP3 - Onda A de paginas (public/core)
- Escopo:
  - homepage, rotas publicas base, recursos e mercados principais.
- Entregaveis:
  - conversao do grupo para estrutura V1;
  - rotas diretas e refresh browser funcionais.
- Gate de qualidade:
  - `yarn lint`
  - `yarn test`
  - `yarn test:e2e -- e2e/smoke.spec.ts e2e/recursos.index.smoke.spec.ts e2e/markets-stocks.route.smoke.spec.ts`
- Commit:
  - `refactor(vike): migrate public/core pages to v1 design`

## CP4 - Onda B de paginas (hub + creators)
- Escopo:
  - `src/pages/hub/**`
  - `src/pages/creators/**`
  - rotas dinamicas de detalhe/edicao.
- Entregaveis:
  - paginas V1 equivalentes para listagem/detalhe/edicao;
  - rota dinamica preservada sem quebra de params.
- Gate de qualidade:
  - `yarn lint`
  - `yarn test`
  - `yarn test:e2e -- e2e/content-details.smoke.spec.ts e2e/comments.smoke.spec.ts`
- Commit:
  - `refactor(vike): migrate hub and creators routes to v1`

## CP5 - Onda C de paginas (admin)
- Escopo:
  - `src/pages/admin/**` e wrappers administrativos.
- Entregaveis:
  - superficies admin em V1;
  - links profundos de operacao preservados.
- Gate de qualidade:
  - `yarn lint`
  - `yarn test`
  - `yarn test:e2e -- e2e/admin.p2.6.spec.ts e2e/admin.editorial.p4.spec.ts e2e/admin.creator-risk.p4.spec.ts`
- Commit:
  - `refactor(vike): migrate admin routes to v1`

## CP6 - Limpeza estrutural e remocao de legado
- Entregaveis:
  - remover ficheiros V0.4 remanescentes (`*.page.*` legados, `_default.page.*` antigos);
  - ajustar tipos e utilitarios de `pageContext`;
  - eliminar avisos de design deprecado.
- Gate de qualidade:
  - `yarn lint`
  - `yarn test`
  - `yarn build`
  - `yarn ssr:dev` sem warning de deprecated design.
- Commit:
  - `chore(vike): remove old design files and finalize v1 switch`

## CP7 - Release candidate da migracao
- Entregaveis:
  - validacao final consolidada;
  - atualizacao de runbook/checkpoints/documentacao de retomada.
- Gate final:
  - `yarn lint`
  - `yarn test`
  - `yarn build`
  - `yarn test:e2e:release -- --list`
  - `yarn test:e2e:a11y -- --list`
  - `yarn ssr:dev` com arranque limpo.
- Commit:
  - `docs(vike): finalize migration runbook and quality evidence`

## 4) Qualidade, evidencias e regressao
- Evidencias obrigatorias por checkpoint:
  - comandos executados;
  - resultado resumido (`PASS/FAIL`);
  - ficheiros alterados por area.
- Regra de regressao:
  - falha em gate bloqueia merge para `master`;
  - rollback local para checkpoint anterior e nova tentativa.

## 5) Estrategia de commits e push
- Um commit por checkpoint tecnico (evitar commits gigantes sem fronteira clara).
- Mensagem padrao:
  - `tipo(vike): descricao curta`
- Fluxo:
  - `git add -A`
  - `git commit` (ou `--no-verify` quando houver bloqueio Win32 5 documentado)
  - `git push origin chore/vike-v1-migration-plan`
- Nao fazer merge para `master` antes do CP7.

## 6) Checklist de arranque da proxima sessao
1. Confirmar branch: `chore/vike-v1-migration-plan`.
2. Ler `dcos/MUST_READ_VIKE_V1_AGENTE.md`.
3. Ler ultimo checkpoint em `dcos/ESTADO_IMPLEMENTADO.md`.
4. Executar CP seguinte sem saltar fases.
