# O3-08 - Auditoria Final Frontend

Data: 2026-03-08

## Objetivo

Fechar auditoria final de:

1. tipos;
2. lint;
3. gates E2E de release;
4. baseline de acessibilidade.

## Comandos oficiais

```bash
npm run audit:o3
```

Composicao:

1. `npm run typecheck:p1`
2. `npm run lint`
3. `npm run test:e2e:release -- --list`
4. `npm run test:e2e:a11y -- --list`

## Suites relevantes

1. `e2e/release.flows.o3.spec.ts` - fluxos release (registo, login, publish, consumo)
2. `e2e/a11y.smoke.o3.spec.ts` - smoke de acessibilidade (landmarks e teclado)
3. `e2e/admin.p2.6.spec.ts` - moderacao/admin guardrails
4. `e2e/smoke.spec.ts` - smoke SSR/navegacao publica
