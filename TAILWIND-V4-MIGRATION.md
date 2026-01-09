# Migração para Tailwind CSS v4 ✅

Este boilerplate foi migrado com sucesso para **Tailwind CSS v4**.

**⚠️ Este projeto usa pnpm, não npm ou yarn!**

## O Que Mudou?

### ❌ Removido

- `tailwind.config.js` - não existe mais no v4
- `postcss.config.js` - não é mais necessário
- `autoprefixer` - integrado nativamente no v4
- Dependência `postcss` - não é mais necessária

### ✅ Adicionado

- **`@tailwindcss/vite`** - Plugin essencial para Vite (v4.1.18)
- Plugin configurado em `vite.config.ts`
- Configuração CSS-first em `src/index.css`
- Uso de `@import "tailwindcss"` ao invés de `@tailwind` directives
- Bloco `@theme` para customizações de tema
- Tailwind CSS v4.1.0

## Estrutura do CSS Agora

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Configurações de tema aqui */
  --color-primary: hsl(var(--primary));
  --radius-lg: var(--radius);
}

@layer base {
  /* CSS customizado */
}
```

## Configuração do Vite (IMPORTANTE!)

```typescript
/* vite.config.ts */
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"  // ← ESSENCIAL!
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],  // ← Adicione o plugin aqui
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Por Que v4?

1. **Performance**: Muito mais rápido que v3
2. **Simplicidade**: Sem configuração complexa em JS
3. **CSS-first**: Tudo em CSS, mais natural
4. **Autoprefixer integrado**: Uma dependência a menos
5. **Plugin Vite dedicado**: Melhor integração e DX
6. **PostCSS opcional**: Funciona sem PostCSS config

## ⚠️ CRÍTICO: Dependências Necessárias

Para o Tailwind v4 funcionar com Vite, você PRECISA de **DUAS** dependências:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

**Sem `@tailwindcss/vite`, o Tailwind NÃO VAI FUNCIONAR!**

## Compatibilidade

✅ **100% compatível** com:
- shadcn/ui components
- Todos os utility classes do v3
- Responsive design
- Dark mode
- Custom colors via CSS variables

## ⚠️ IMPORTANTE

**NUNCA faça downgrade para v3!**

Se você encontrar tutoriais ou documentação que pedem:
- `tailwind.config.js`
- `postcss.config.js`
- `require('tailwindcss')`

**IGNORE** - isso é Tailwind v3. Este projeto usa v4.

## Como Adicionar Cores Customizadas

### ❌ ANTES (v3):
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#ff6b6b'
      }
    }
  }
}
```

### ✅ AGORA (v4):
```css
/* src/index.css */
@theme {
  --color-brand: #ff6b6b;
}
```

Depois use: `className="bg-brand text-brand"`

## Recursos

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)

---

**Data da migração**: 2026-01-08
**Versão Tailwind**: v4.1.0
