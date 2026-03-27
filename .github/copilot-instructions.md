# FinHub — Agent & Copilot Instructions

## Papel dos agentes neste projecto

**Claude (Claude Code)** é o agente responsável por todas as decisões e implementações de UI/UX/layout.
Codex e outros agentes de código **não devem alterar componentes de UI, layout, CSS, ou design tokens** sem instrução explícita do utilizador via Claude.

Tarefas de design, layout e frontend ficam reservadas ao Claude. Codex foca-se em: lógica de negócio, APIs, testes, infraestrutura, e tasks de backend.

---

## Stack

- **React 19** + **TypeScript** + **Vite** + **Vike** (SSR)
- **Tailwind CSS 3** com design tokens em `src/styles/design-tokens.css`
- **shadcn/ui** (Radix UI primitives) — componentes em `src/components/ui/`
- **Zustand** (estado global), **TanStack Query** (server state), **React Hook Form + Zod** (forms)
- **Recharts** (gráficos), **TipTap** (rich text), **i18next** (PT/EN)
- **next-themes** (dark mode via `.dark` class)

## Convenções de código

- Imports via alias `@/` (mapeia para `src/`)
- Componentes em PascalCase, ficheiros `.tsx`
- Hooks em `use` prefix, ficheiros `use*.ts`
- Feature-first structure: `src/features/<feature>/`
- CSS: Tailwind utilities + tokens semânticos. Nunca hardcoded hex values.
- Dark mode: todos os componentes devem suportar `.dark` — usar variáveis semânticas (`bg-background`, `text-foreground`, etc.)

---

## Design Context

> Lido por Impeccable e pelo Claude para todas as decisões de UI.
> Ver ficheiro completo em `.impeccable.md` na raiz do projecto.

### Users

Audiência universal (todos os níveis), mas o funil de valor e retenção está nos investidores experientes. Entry via conteúdo educativo; poder users via ferramentas avançadas, creators e comunidade.

### Brand Personality

**Sério. Moderno. Educativo.**

Confiante sem ser arrogante. Acessível sem ser infantil. Denso onde necessário, nunca sufocante.

### Referências de design

| Área | Referência |
|------|-----------|
| Discovery de conteúdo | Netflix |
| Ferramentas & Mercados | Trading 212 |
| Comunidade & Creators | Instagram + Discord |

**Anti-referências**: Finviz, SeekingAlpha — sem tabelas densas, sem só-números, sem trading agressivo.

### Princípios de Design

1. **Clareza sobre completude** — progressive disclosure, nunca dump de dados
2. **Conteúdo em primeiro** — convidar à exploração, não sobrecarregar
3. **Confiança por contenção** — whitespace e tipografia > decoração; vermelho/verde com intenção
4. **Comunidade como produto** — social layer tem o mesmo peso que ferramentas financeiras
5. **Profundidade progressiva** — superfície limpa para iniciantes, densidade desbloqueável para power users

### Tokens críticos

- Fonte: **Inter** (`@fontsource/inter`) — sem Google Fonts adicionais
- Números financeiros: **`tabular-nums`** obrigatório (`font-variant-numeric: tabular-nums`)
- Gráficos: tokens `chart-1` a `chart-5` + `market-bull` / `market-bear` / `market-neutral`
- Dark mode: `.dark` class via next-themes — suporte obrigatório em componentes novos
