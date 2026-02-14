# 🔧 Dev Tools

Ferramentas de desenvolvimento para facilitar o processo de desenvolvimento e testes.

## DevUserSwitcher

Menu flutuante que permite alternar entre diferentes tipos de usuário (roles) instantaneamente durante o desenvolvimento.

### ✨ Features

- ✅ **Só aparece em DEV mode** (import.meta.env.DEV)
- ✅ **Menu flutuante** no canto inferior direito
- ✅ **Troca instantânea** entre roles sem logout/login
- ✅ **Visual claro** com cores por role
- ✅ **Indicador visual** do role atual
- ✅ **5 roles disponíveis**:
  - 👤 Visitor (sem conta)
  - 🆓 Free User (conta gratuita)
  - ⭐ Premium (assinatura)
  - ✍️ Creator (criador de conteúdo)
  - 👑 Admin (administrador)

### 🎯 Como Usar

1. **Inicie o projeto em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

2. **Procure o botão amarelo** no canto inferior direito da tela com o texto "🔧 Dev Tools"

3. **Clique no botão** para abrir o menu de roles

4. **Selecione o role** que deseja testar

5. **Navegue pela aplicação** com o novo role - todas as permissões e acessos serão atualizados automaticamente!

### 💡 Casos de Uso

#### Testar Permissões
```
1. Mude para "Visitor" → Veja o paywall em ação
2. Mude para "Premium" → Acesse conteúdo premium
3. Mude para "Creator" → Acesse o dashboard de criador
4. Mude para "Admin" → Acesse painel admin
```

#### Testar Navegação Condicional
```
Diferentes roles veem diferentes itens na sidebar:
- Visitor: Apenas conteúdo público
- Free: + Calculadoras básicas
- Premium: + Portfolio, Chat
- Creator: + Dashboard de Conteúdo
- Admin: + Painel de Administração
```

#### Testar Features com Paywall
```
1. Mude para "Free"
2. Tente acessar conteúdo premium
3. Veja o componente Paywall aparecer
4. Mude para "Premium"
5. Veja o mesmo conteúdo desbloqueado!
```

### 🔒 Segurança

- ⚠️ **Apenas em DEV**: Automaticamente desabilitado em produção
- ⚠️ **Não afeta o backend**: Mudanças apenas no frontend
- ⚠️ **Não persiste**: Ao recarregar, volta ao mock user padrão

### 🎨 Personalização

O componente está em: `src/shared/dev/DevUserSwitcher.tsx`

Você pode:
- Mudar a posição (bottom-4 right-4)
- Customizar cores
- Adicionar mais informações
- Adicionar atalhos de teclado

### 📝 Exemplo de Workflow

```
1. Desenvolvendo feature de artigos premium
   ↓
2. Abro DevUserSwitcher
   ↓
3. Testo como Visitor → Vejo paywall
   ↓
4. Mudo para Premium → Vejo conteúdo completo
   ↓
5. Mudo para Creator → Vejo botão "Criar Artigo"
   ↓
6. Mudo para Admin → Vejo opções de moderação
   ↓
7. Tudo testado em 30 segundos! 🚀
```

### 🐛 Troubleshooting

**Não vejo o botão:**
- Verifique se está em modo desenvolvimento (`npm run dev`)
- Verifique o console por erros
- Limpe o localStorage e recarregue

**Não muda de role:**
- Abra o console do navegador
- Verifique se há mensagem: `🔄 [DEV] Role alterado para: XXX`
- Se não houver, verifique se o store está hidratado

**Layout quebrado:**
- O componente usa z-index 9999
- Se houver conflito, ajuste no CSS do componente
