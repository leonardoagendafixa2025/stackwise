# STACKWISE — GUIA OPERACIONAL DO PROPRIETÁRIO (SUPERVISÃO CLT)

> **Perfil do Proprietário:** Trabalho em regime CLT, com dedicação restrita de **1 a 3 horas semanais**.
> **Filosofia de Operação:** A plataforma opera com autonomia supervisionada. Você não precisa acessar o painel todos os dias. O sistema monitora, pesquisa, audita e redige; o proprietário atua exclusivamente como **editor-chefe, estrategista e aprovador final**.

---

## 1. CRONOGRAMA DE SUPERVISÃO SEMANAL (1 A 3 HORAS)

### 🗓️ SEGUNDA-FEIRA (15 minutos) — Diagnóstico Rápido
1. Acesse `https://stackwise.io/admin` (ou `/admin` no seu ambiente local/Vercel).
2. Olhe diretamente para o quadro **"VOCÊ PRECISA DA SUA ATENÇÃO"**:
   - Se houver alertas críticos (ex: link de afiliado indisponível detectado pelo Agente 4 ou erro persistente), clique no link da ação para resolver ou pausar o link com 1 clique.
   - Se o quadro estiver verde ("Tudo operando normalmente"), feche o painel.
3. Observe os medidores de **Orçamento (R$ 0,00)** e **Cliques Registrados** na semana.

### 🗓️ QUINTA-FEIRA (30 a 45 minutos) — Revisão Editorial e Comercial
1. **Revisão Editorial (`/admin/editorial`):**
   - Verifique os novos rascunhos produzidos pelo **Agente 3 (Editorial)**.
   - Faça leitura crítica: ajuste o tom, confirme as tabelas de preços nos sites oficiais e clique em **"Publicar"**.
   - *Regra inegociável:* Nunca publique rascunhos sem ler e verificar as fontes.
2. **Programas de Afiliados (`/admin/affiliates`):**
   - Avalie novos programas descobertos pelo **Agente 1 (Pesquisador)**.
   - Se aprovado, submeta a inscrição na rede parceira (PartnerStack, Impact, CJ, ShareASale) e insira o link gerado no sistema.
3. **Leads de Sistemas Personalizados (`/admin/leads`):**
   - Caso um visitante tenha solicitado um briefing de software sob medida, leia a especificação técnica gerada pelo **Agente 7 (Comercial)**.
   - Decida se aceita o projeto para agendar reunião ou declina com mensagem automática.

### 🗓️ ÚLTIMO SÁBADO DO MÊS (30 a 45 minutos) — Conciliação Financeira
1. Acesse as redes de afiliados parceiras e exporte o relatório mensal de conversões em CSV.
2. Acesse `/admin/financial`.
3. Cole o conteúdo CSV na caixa de importação e clique em **"Processar e Reconciliar com Agente 6"**.
4. O sistema atualizará atomicamente as comissões pagas, aprovadas e pendentes, calculando o lucro líquido real e a régua de progresso da meta de R$ 1.000.000 até Dezembro/2027.

---

## 2. REGRAS INEGOCIÁVEIS DO NEGÓCIO

1. **Trava de Custo Zero (R$ 0,00):** Não assine planos pagos de banco de dados, hospedagem ou IA enquanto a receita acumulada comprovada não justificar o investimento.
2. **Separação Contábil Estrita:**
   - Clique **não** é venda.
   - Comissão pendente **não** é dinheiro em caixa.
   - Apenas comissões pagas pela rede constituem receita realizada.
3. **Neutralidade e Transparência:**
   - Toda página com links de afiliados deve conter o banner de divulgação transparente (`AffiliateDisclosureBanner`).
   - Nunca invente avaliações ou dados fictícios de softwares que não foram verificados.

---

## 3. CHECKLIST DE CONTINGÊNCIA E RECUPERAÇÃO

- **Se um link de afiliado cair:** O Agente 4 (Auditor) detectará automaticamente na rotina das 00:00 ou 12:00 UTC. Um alerta será criado em `notifications` e o status do link será apontado como anômalo.
- **Se a cota gratuita do Gemini AI atingir limite temporário:** O motor de IA utiliza contingência determinística (`getHeuristicFallbackResponse`), mantendo o portal no ar e gerando rascunhos factuais sem erro 500.
- **Se uma tarefa de IA falhar:** O motor de **Self-Healing** tentará até 3 vezes com backoff exponencial. Se persistir, escalonará para o quadro de atenção do proprietário.
