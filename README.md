# STACKWISE — Autonomous SaaS Affiliate & Recommendation Platform

> **Stackwise** é uma plataforma empresarial autônoma de descoberta, comparação e recomendação de softwares e ferramentas digitais (SaaS), desenvolvida para operar nos mercados brasileiro, norte-americano e europeu em arquitetura bilíngue (`pt-br` e `en`).

---

## 🚀 VISÃO GERAL & ARQUITETURA

A plataforma opera sob o modelo de **autonomia supervisionada**, desenhada para que o proprietário (em regime CLT) necessite de apenas **1 a 3 horas semanais** para governança, aprovação editorial e conciliação financeira.

### Stack Tecnológica & Custo Zero (R$ 0,00 / mês)

| Componente | Provedor | Plano | Custo | Papel na Arquitetura |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend & SSR** | Vercel | Hobby (Free) | R$ 0,00 | Next.js 14 App Router, TypeScript, Tailwind CSS |
| **Banco de Dados** | Supabase | Free Tier | R$ 0,00 | PostgreSQL 15, 26 tabelas com RLS, Auth e Storage |
| **Inteligência Artificial**| Google Gemini | Free Tier (15 RPM) | R$ 0,00 | Orquestração dos 7 Agentes Autônomos de IA |
| **Agendamentos (Cron)** | GitHub Actions | Free Tier (2.000 min)| R$ 0,00 | Auditoria de links e rotinas de estabilidade a cada 12h |
| **Segurança & DNS** | Cloudflare | Free Plan | R$ 0,00 | Proteção DDoS, CDN Global e terminação SSL |

---

## 🤖 A CENTRAL DOS 7 AGENTES DE IA

Cada agente opera com permissões estritas, controle de taxa e travas éticas inegociáveis:

1. **Agente 1 — Pesquisador (`AGENT_1_RESEARCHER`):** Descobre softwares SaaS consolidados e programas de parceiros com potencial de comissão recorrente.
2. **Agente 2 — SEO & Oportunidades (`AGENT_2_SEO`):** Mapeia termos de intenção de compra comercial (*comparativos X vs Y*, *alternativas* e decisões).
3. **Agente 3 — Editorial & Comparações (`AGENT_3_EDITORIAL`):** Redige rascunhos aprofundados e imparciais. Trava obrigatória: *requires_human_approval: true*.
4. **Agente 4 — Auditor Técnico & Links (`AGENT_4_AUDITOR`):** Varre continuamente a integridade dos links de afiliados (`/go/[slug]`), garantindo status HTTP 200/301/302.
5. **Agente 5 — Growth & Conversão (`AGENT_5_GROWTH`):** Analisa histórico de cliques, identifica lacunas de catálogo e recomenda melhorias de CTR.
6. **Agente 6 — Financeiro & Conciliação (`AGENT_6_FINANCIAL`):** Processa relatórios CSV de redes de afiliados com integridade referencial e proteção contra duplicidades.
7. **Agente 7 — Consultor Comercial (`AGENT_7_COMMERCIAL`):** Analisa demandas de clientes para criação de sistemas sob medida, dimensionando escopo, stack e estimativa de horas.

---

## 🗄️ MODELO RELACIONAL DO BANCO DE DADOS (26 TABELAS)

O banco de dados PostgreSQL no Supabase conta com Row-Level Security (RLS) e integridade referencial:

1. `profiles` — Perfis de usuários com RBAC (`owner`, `admin`, `editor`, `agent`).
2. `categories` — Categorias de ferramentas digitais bilíngues.
3. `products` — Softwares SaaS com especificações técnicas e verificação factual.
4. `product_features` — Recursos e funcionalidades auditadas por ferramenta.
5. `pricing_plans` — Planos, preços, períodos de teste e moedas verificadas.
6. `product_limitations` — Limitações documentadas oficialmente (neutralidade).
7. `product_recommended_audiences` — Segmentação de público recomendado.
8. `product_integrations` — Integrações nativas suportadas.
9. `product_supported_languages` — Idiomas oficiais do software.
10. `product_sources` — Fontes oficiais e registros de data de verificação.
11. `affiliate_networks` — Redes parceiras (PartnerStack, Impact, CJ, ShareASale).
12. `affiliate_programs` — Programas de afiliados e comissões (recorrentes/fixas).
13. `affiliate_links` — Links internos com rastreamento (`/go/[slug]`).
14. `affiliate_clicks` — Cliques registrados atomicamente com dados analíticos.
15. `affiliate_conversions` — Vendas e comissões conciliadas.
16. `affiliate_commissions` — Extrato de pagamentos e liquidações.
17. `content` — Entidades de conteúdo editorial (artigos, comparativos, guias).
18. `content_translations` — Versões localizadas (`pt-br` e `en`) com Markdown.
19. `keywords` — Planejamento de palavras-chave e intenção de busca.
20. `seo_audits` — Relatórios técnicos de auditoria SEO e pontuação.
21. `agent_definitions` — Registro dos 7 agentes, limites de taxa e cotas de tokens.
22. `agent_tasks` — Fila de execução de tarefas dos agentes com estados.
23. `agent_logs` — Auditoria cronológica e telemetria de execução da IA.
24. `scheduled_jobs` — Registro de rotinas programadas (cron).
25. `notifications` — Notificações críticas para o quadro *"VOCÊ PRECISA DA SUA ATENÇÃO"*.
26. `operational_costs` & `system_settings` — Trava de orçamento (R$ 0,00) e parâmetros de negócio.

---

## 🛠️ INICIALIZAÇÃO LOCAL

### 1. Clonar o Repositório
```bash
git clone https://github.com/leonardoagendafixa2025/stackwise.git
cd stackwise
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://dvjvhufcjfhxbvmogazz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
GEMINI_API_KEY=sua-chave-gemini-gratuita
```

### 4. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse:
- Portal Público em Português: `http://localhost:3000/pt-br`
- Portal Público em Inglês: `http://localhost:3000/en`
- Painel Administrativo: `http://localhost:3000/admin`
- Sonda de Saúde: `http://localhost:3000/api/health`

---

## ☁️ GUIA DE DEPLOY EM PRODUÇÃO (VERCEL + CLOUDFLARE)

### 1. Deploy na Vercel (Hobby / Gratuito)
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **Add New Project** e selecione o repositório `leonardoagendafixa2025/stackwise`.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SITE_URL`: `https://seu-dominio.com`
   - `NEXT_PUBLIC_SUPABASE_URL`: sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sua chave anônima/publicável
   - `SUPABASE_SERVICE_ROLE_KEY`: sua chave de serviço (estritamente privada)
   - `GEMINI_API_KEY`: sua chave do Google Gemini Free Tier
4. Clique em **Deploy**.

### 2. Configurar Cloudflare (DNS & SSL)
1. Crie uma zona gratuita no [cloudflare.com](https://cloudflare.com) para o seu domínio.
2. Aponte um registro **CNAME** para `cname.vercel-dns.com` com o Proxy ativado (nuvem laranja).
3. Habilite o modo SSL/TLS como **Full (strict)**.

### 3. Configurar Secrets do GitHub Actions
Para que as rotinas de auditoria agendada das 00:00 e 12:00 UTC funcionem:
1. No repositório do GitHub, vá em **Settings > Secrets and variables > Actions**.
2. Adicione as secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 📖 OPERAÇÃO E GOVERNANÇA

Consulte o arquivo [`OPERATIONS.md`](./OPERATIONS.md) para o manual semanal de supervisão em regime CLT (1 a 3 horas semanais).
