# Auditoria de Qualidade — Relatório Principal vs. Arquitetura Canônica

> Data: 10/07/2026 · Referência: `docs/arquitetura-relatorio-canonica.md` (aprovada) · Objeto: relatório gerado por `reportGenerator.ts` (pós-refactor etapas 1–3, conteúdo comprovadamente idêntico ao original) · Método: inspeção do código seção a seção + HTML gerado com dados fixos.

## Conclusão executiva

O relatório atual implementa bem a **primeira geração** da arquitetura (Resumo Executivo, Roadmap em 5 horizontes, urgências, redução educativa parcial) mas **não implementa a arquitetura canônica vigente**: o arco narrativo tensão→compromisso, os Achados rastreáveis, o custo de esperar, os cenários, os banners de capítulo e "Sua primeira semana" estão ausentes. A convergência é um trabalho de reestruturação (etapa 5 já planejada), não de retoques.

---

## 1. Itens corretos (conformes à arquitetura)

| Item | Evidência |
|---|---|
| Capa mínima com transferência de propriedade | secCoverPage: empresa em destaque, título, data |
| Resumo Executivo completo | Nota 0-100, maturidade média, 3 riscos (fraqueza×ameaça), 3 oportunidades (força×oportunidade), prioridade estratégica derivada do maior gap de maturidade, objetivo 12 meses |
| Indicador de progresso Diagnóstico/Implementação | Presente, implementação em 0% na entrega |
| Roadmap consolidado sem repetição de ações | Dedup por título normalizado; cada ação aparece 1x com origem |
| Classificação de urgência com 5 cores/prazos | 🔴30d 🟠3m 🟡6m 🟢9m 🔵12m conforme especificado |
| Roadmap calculado dos dados (não do texto) | Pós-refactor: coletor `renderActionPlan` + `buildRoadmap` — decisão reafirmada na arquitetura agora cumprida |
| Prioridade estratégica dinâmica no Resumo | Deriva da dimensão de menor maturidade (ex.: "Mercado, nível 2/5") |

## 2. Itens divergentes

| # | Arquitetura | Estado atual | Gravidade |
|---|---|---|---|
| D1 | Roadmap = máx. **8 iniciativas estratégicas** amplas | ✅ Resolvido em 10/07: 8 iniciativas fixas em `buildStrategicInitiatives`, horizonte por maturidade | Resolvida |
| D2 | Capítulos abrem com banner "Contribui para / Horizonte / Objetivo" | ✅ Resolvido em 10/07: banner dinâmico em 14 capítulos; SWOT e Diagnóstico apontam para a iniciativa da dimensão de menor maturidade | Resolvida |
| D3 | Achados numerados (Achado 1..N) referenciados ao longo do documento | ✅ Resolvido em 10/07: seção "Onde sua empresa está" com 3–5 achados em três tempos (o que vimos/significa/gravidade), derivados de maturidade, finanças e SWOT | Resolvida |
| D4 | Classificação de urgência por **severidade do diagnóstico** | ✅ Resolvido em 10/07: horizonte de cada iniciativa deriva do nível de maturidade da dimensão | Resolvida |
| D5 | Riscos/oportunidades do Resumo por severidade relativa | ✅ Resolvido em 10/07 por convenção: ordem de cadastro = prioridade do consultor, com orientação explícita no bloco SWOT da plataforma | Resolvida (convenção) |
| D6 | TOC removido (decisão reafirmada) | ✅ Removido em 10/07 | Resolvida |
| D7 | Master Checklist removido (decisão reafirmada) | ✅ Removido em 10/07 | Resolvida |
| D8 | Conteúdo educativo −50%, foco "o que fazer" | Parcial: restam menções a Sinek/Harvard e blocos conceituais | Baixa |
| D9 | Berry Score como âncora comparativa na P2 | Usa `executiveMetrics.berryScore` como "Nota Geral" com ressalva em comentário de que não é o score oficial | Média — depende da decisão pendente da tabela de faixas |

## 3. Informação repetida

- Planos de ação: itens aparecem no capítulo (detalhado) **e** no Roadmap (1 linha + origem) — conforme arquitetura, **não é violação**.
- Master Checklist (D7) repete integralmente as ações já consolidadas no Roadmap — redundância que a decisão de remoção já endereçava.
- Explicações de metodologia aparecem tanto no capítulo Golden Circle quanto em Identidade (contexto Sinek) — candidatas ao corte educativo (D8).

## 4. Seções faltantes (vs. canônica)

| Página canônica | Status |
|---|---|
| P3–4 Achados em três tempos + prosa executiva 200–350 palavras | **Ausente** (o Diagnóstico de Maturidade atual é tabela de níveis, não narrativa de achados) |
| P5 O custo de esperar (faixas + premissas visíveis) | **Ausente** |
| P6 Os caminhos possíveis (cenários com trade-offs) | **Ausente** |
| P8 Quem faz o quê (matriz por fase) | Parcial: existe seção "Responsabilidades" por cargo, sem amarração a fases do plano |
| P9 Os primeiros 30 dias (5–10 ações, critério de "pronto") | **Ausente** (a faixa 🔴30d do roadmap não tem responsável por cargo nem critério de pronto) |
| P10 Sua primeira semana | **Ausente** (encerramento atual: "Próximos Passos" genérico) |
| Sinais de progresso de meio de execução | **Ausente** (decisão pendente na canônica) |
| **Variante Contingência inteira** | **Inexistente neste gerador** — não há bifurcação de rota |

## 5. Problemas de usabilidade

- U1. TOC com âncoras que não funcionam em HTML estático (motivo original da remoção) — links mortos para o leitor.
- U2. Documento longo (21 seções) sem o arco que a canônica usa justamente para sustentar leitura; leitor apressado não tem o "pare aqui satisfeito" da P2 canônica porque o Resumo não formula risco/recomendação em frases únicas.
- U3. Roadmap com 40 itens transfere ao empresário o trabalho de priorização que o relatório deveria ter feito (viola "o valor está no que fica de fora").

## 6. Inconsistências narrativas

- N1. O documento se apresenta como síntese→detalhe, mas os capítulos não citam o Resumo nem os riscos nomeados — as promessas da abertura não são cumpridas nominalmente (ausência dos Achados/banners).
- N2. Tom oscila entre executivo (Resumo/Roadmap) e educativo-genérico (capítulos metodológicos) — efeito da migração incompleta da geração 1.
- N3. Urgência "Crítica/30 dias" atribuída por keyword pode contradizer o próprio diagnóstico (ação de área madura marcada crítica por conter "processo" no título).

## 7. Recomendações (ordem de execução sugerida)

1. **Imediato, sem redesign**: remover `secTableOfContents()` e `secMasterChecklist()` do array de seções (D6/D7) — duas linhas, decisões já tomadas.
2. **Modelo**: implementar as 8 iniciativas estratégicas derivadas da maturidade no `reportModel` (D1) e reclassificar urgência por severidade do diagnóstico (D4); corrigir seleção por severidade no SWOT (D5).
3. **Estrutura**: banners de capítulo dinâmicos (D2) — dependem de (2) para saber a qual iniciativa cada capítulo contribui.
4. **Redesign (etapa 5)**: construir P3–6 e P9–10 canônicas e a variante Contingência; nesse momento resolver as pendências de decisão (Berry Score, sinais de progresso, bloco Contingência).

---
*Auditoria produzida sobre commit `ceccd81`. Reexecutar a verificação de HTML idêntico (harness de dados fixos) após cada correção que não deva alterar conteúdo.*
