# MUST READ - Migracao Vike V1 (Agentes)

## Objetivo
- Eliminar o aviso `You are using Vike's deprecated design` migrando da arquitetura V0.4 para V1.

## Regra 0 (obrigatoria)
- Trabalhar **apenas** no branch `chore/vike-v1-migration-plan`.
- Nao fazer migracao diretamente em `master`.

## Regra 1 (critica do Vike)
- Nao misturar V0.4 e V1 no mesmo estado de codigo.
- Se existirem ficheiros de ambos os designs ao mesmo tempo, o Vike bloqueia.

## Estrategia definida
1. Preparacao e inventario (sem introduzir ficheiros V1 ainda).
2. Commit de migracao estrutural em bloco (switch completo para V1).
3. Ajustes de runtime/SSR, testes e docs.
4. Merge para `master` so quando o warning desaparecer e os checks estiverem verdes.

## Checkpoint obrigatorio por sessao
- Atualizar `dcos/ESTADO_IMPLEMENTADO.md` com:
  - data,
  - branch ativo,
  - fase atual,
  - comando de validacao executado,
  - proximo passo objetivo.

## Validacao minima antes de subir
- `yarn lint`
- `yarn test`
- `yarn build`
- `yarn ssr:dev` (confirmar arranque sem warning de design deprecado)

## Nota sobre erro de commit no ambiente
- Erro observado: `env.exe ... couldn't create signal pipe (Win32 error 5)` durante hooks Husky.
- Isto e erro de ambiente/permissoes no Windows, nao erro de codigo.
- Quando ocorrer, validar checks manualmente e usar `git commit --no-verify` apenas com registo no checkpoint.
