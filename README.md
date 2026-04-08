# Brasseiro

Checklist passo a passo para brassagem BIAB. Feito pra quem tá começando a fazer cerveja e não quer ficar com o vídeo aberto no celular o tempo todo.

## O que é?

Brasseiro é um app que te guia por todo o processo de brassagem pelo método BIAB (Brew In A Bag), do preparo dos ingredientes até o envase. Cada etapa tem instruções claras, timers com alertas e dicas de "por que estou fazendo isso".

A ideia surgiu porque todo cervejeiro iniciante passa pelo mesmo perrengue: fica pulando entre vídeo, receita e panela, tentando não esquecer nenhum passo. O Brasseiro resolve isso — você configura sua receita uma vez e ele te conduz pelo processo inteiro.

## Funcionalidades

**Fluxo guiado por fases**

- **Preparação** — checklist de tudo que precisa estar pronto antes de ligar o fogo
- **Mostura** — timer com alertas pra mexer a cada 15 min, controle de temperatura
- **Fervura** — timer com alertas automáticos pra cada adição de lúpulo
- **Resfriamento** — passo a passo do whirlpool e resfriamento
- **Envase** — cálculo de priming, instruções de sanitização

**Timers inteligentes**

- Alertas sonoros para adições de lúpulo no tempo certo
- Lembretes para mexer o mosto durante a mostura
- Notificação quando o timer finaliza

**Acompanhamento de fermentação**

- Registro diário de temperatura (manhã/noite)
- Controle de troca de gelo (pra quem usa cooler)
- Leitura de densidade (OG/FG) e cálculo automático de ABV

**Glossário cervejeiro**

- Termos técnicos explicados de forma simples
- Links contextuais durante o processo — clicou em "mostura", vê a explicação

**Histórico**

- Registro de todas as brassagens anteriores
- ABV calculado automaticamente a partir das leituras de densidade

## Rodando local

```bash
pnpm install
pnpm dev
```

Abre em [http://localhost:5173](http://localhost:5173).

## Deploy

Configurado pra Vercel. Só fazer deploy e funciona — já tem `vercel.json` com rewrite pra SPA.

```bash
vercel
```

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 + shadcn/ui
- Zustand (persistência em localStorage)
- React Router

Não tem backend. Tudo roda no browser e os dados ficam salvos no localStorage.

## Créditos

Inspirado nos ensinamentos do [Leandro — cervejafacil.com](https://www.cervejafacil.com). Se você tá começando, assiste os vídeos dele — é o melhor ponto de partida.
