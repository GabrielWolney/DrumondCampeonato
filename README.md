# 🎱 Primeiro Nacional de Sinuca – Drumond Sports

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

Landing page oficial do **Primeiro Campeonato Nacional de Sinuca**, organizado pela Drumond Sports.  
O site apresenta:

- **Contagem regressiva** para a data do evento.
- **Carrossel interativo** com fotos da estrutura.
- **Lotes de ingressos** com preços dinâmicos, datas de liberação e links de compra.
- **Página para patrocinadores** com diferenciais e contato direto via WhatsApp.
- **Painel administrativo** protegido por login para gerenciar fotos, patrocinadores, lotes de ingresso, programação e configurações gerais do site — tudo em tempo real, sem deploy.

O projeto é real, dimensionado para um público de mais de 4 mil pessoas, e prioriza segurança, performance e conversão.

---

## 🚀 Stack principal

| Camada         | Tecnologia                            |
| -------------- | ------------------------------------- |
| Framework      | Next.js 15 (App Router)               |
| Banco de dados | Supabase (PostgreSQL)                 |
| Autenticação   | Supabase Auth (e-mail/senha)          |
| Estilização    | Tailwind CSS 4                        |
| Animações      | Framer Motion                         |
| Upload         | Supabase Storage (WebP comprimido)    |
| Tracking       | Google Analytics / Meta Pixel (opcional) |

---

## 📁 Estrutura de pastas
├── public/ # Ícones, manifest, imagem de compartilhamento
├── src/
│ ├── app/
│ │ ├── admin/ # Painel administrativo
│ │ ├── ingressos/ # Página de ingressos
│ │ ├── patrocinador/ # Página para patrocinadores
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── page.tsx # Home
│ │ ├── sitemap.ts # Sitemap automático
│ │ └── robots.ts # Robots.txt automático
│ ├── components/
│ │ ├── admin/ # Componentes do painel
│ │ ├── ui/ # Skeleton, Toast
│ │ ├── Countdown.tsx
│ │ ├── Navbar.tsx
│ │ ├── PhotoCarousel.tsx
│ │ └── WhatsAppFloat.tsx
│ ├── context/ # LightboxContext
│ ├── hooks/ # useAuth, useConfig, useFotos, useSchedule, useSponsors, useTicketTiers
│ └── lib/ # Supabase client, imageUploader, utils
├── AGENTS.md
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json

---

## ⚙️ Funcionalidades principais

- **Home com contagem regressiva**, seções Sobre, Programação, Local (com mapa), Patrocinadores e CTAs (inscrição, ingressos, parceiro).
- **Página de Ingressos** exibe lotes ativos e futuros, com destaque visual (🔥 Mais vendido, barra de progresso, dias restantes).
- **Página de Patrocinador** lista diferenciais do evento e links diretos para WhatsApp.
- **Painel Admin**:
  - Login seguro com Supabase Auth.
  - Permissão diferenciada (apenas usuários com metadata `is_admin = true` acessam as abas).
  - Abas: Galeria (upload múltiplo + drag-and-drop para ordenar), Patrocinadores (logo + link), Configurações (todas as chaves do site), Lotes de ingresso (CRUD + ordenação), Programação.
- **Botão flutuante do WhatsApp** com mensagem configurável.
- **Carregamento com cache** nos hooks principais — dados de config, patrocinadores, fotos e lotes são cacheados em memória durante a sessão para evitar requisições repetidas.
- **Tracking de eventos**:
  - `click_buy_ticket` (compra ingresso)
  - `click_register` (inscrição jogador)
  - `click_partner` (ser parceiro)
  - `click_whatsapp` (abrir WhatsApp float)

---

## 🔒 Segurança

- **Row Level Security (RLS)** ativa em todas as tabelas do Supabase.
- Políticas específicas:
  - Leitura pública para todas as tabelas.
  - Escrita (INSERT, UPDATE, DELETE) apenas para usuários autenticados.
  - (Avançado) Restrição de escrita apenas para admins via `auth.jwt() -> user_metadata -> is_admin`.
- O componente `AdminGuard` bloqueia acesso ao painel se o usuário não for admin, mesmo que logado.

---

🗃️ Banco de dados (Supabase)
Tabelas
Tabela	Descrição
site_config	Configurações gerais do site (chave/valor)
sponsors	Patrocinadores (nome, logo, link)
ticket_tiers	Lotes de ingresso
event_schedule	Programação do evento
galeria	Fotos do carrossel
Storage
Bucket: drumond-imagens

Pastas: config, sponsors, galeria, uploads

🎯 Próximos passos (sugestões)
Conectar o lote “Mais vendido” a uma flag real no banco.

Adicionar página de confirmação pós‑compra com pixel de conversão.

Criar um sistema de check‑in para o evento.

