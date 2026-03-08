# O3-07 - Release E2E Frontend

Data: 2026-03-08

## Objetivo

Ter uma suite Playwright dedicada aos gates de release no frontend, cobrindo:

1. registo;
2. login;
3. fluxo de creator para publish;
4. consumo de conteudo publicado.

## Comando oficial

```bash
npm run test:e2e:release
```

Inclui:

1. `e2e/smoke.spec.ts`
2. `e2e/admin.p2.6.spec.ts`
3. `e2e/release.flows.o3.spec.ts`

## Nota operacional

1. A suite usa mocks controlados no browser para garantir estabilidade e baixa flakiness.
2. O smoke real de API para o gate de release esta no backend em `npm run test:release:e2e`.
