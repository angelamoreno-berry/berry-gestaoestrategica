# Inventário — `src/utils/reportGenerator.ts`

> Referência canônica para auditoria de qualidade e para o refactor em camadas (modelo JSON → renderizadores).
> Levantado em 10/07/2026 sobre o commit vigente na main. Linhas aproximadas; regenerar mapa após qualquer edição.

## Visão geral

| Camada | Linhas | Tamanho | Situação |
|---|---|---|---|
| Funções de conteúdo | 6–432 | ~430 | Lógica pura, extraível sem risco |
| `generateReport` — CSS embutido | ~500–2.196 | ~1.700 | Um terço do arquivo; candidato à extração imediata |
| `generateReport` — corpo HTML | 2.197–5.017 | ~2.800 | 21 seções em template literal único |
| Pós-processamento do Roadmap | 5.018–5.108 | ~90 | **Regex sobre o próprio HTML gerado** (ver riscos) |
| `openReportInNewTab` | 5.109+ | ~6 | Abertura em nova aba via Blob |

## 1. Funções de conteúdo (modelo embrionário)

| Função | Linha | Produz |
|---|---|---|
| `generateCargoChecklist(cargo)` | 6 | Checklist de responsabilidades por cargo |
| `generateMaturityInsights(level, area)` | 90 | Texto de insight por nível/área de maturidade |
| `generateActionPlan(area, level)` | 126 | Lista de ações por área e nível |
| `generateMotorStrategies(motor)` | 161 | Estratégias, implementação, métricas e ferramentas por motor de crescimento |

Essas quatro funções são o embrião do `buildReportModel`: já separam conteúdo de apresentação.

## 2. Blocos CSS (linhas)

COVER PAGE 552 · TABLE OF CONTENTS 686 · CONTENT PAGES 804 · SECTION STYLING 809 · INFO BOXES 857 · INSIGHT BOX 896 · VISUAL EXAMPLE BOX 921 · ACTION PLAN 967 · SUGGESTION BOX 1068 · IMPLEMENTATION GUIDE 1107 · CARDS 1181 · DATA GRID 1220 · TAGS 1249 · LISTS 1276 · SWOT GRID 1302 · MATURITY LEVELS 1376 · TABLES 1436 · PRIORITY BADGES 1470 · GOLDEN CIRCLE 1495 · PACKAGES 1553 · ORGANOGRAM 1588 · PROCESS CARD 1695 · PRICING SUGGESTIONS 1742 · METRIC VISUALIZATION 1783 · FOOTER 1824 · PAGE BREAK 1855 · PRINT STYLES 1860 · COMPETITOR ANALYSIS 1868 · TIMELINE 1898 · MASTER CHECKLIST 1945 · EDITABLE TOOLBAR 2071 · Resumo Executivo & Roadmap 2153 · Impressão/PDF 2182

Observação: paleta clara nativa com 167 hex fixos fora de tokens (contagem em 10/07). O tema escuro dos demais geradores ainda não foi aplicado aqui, por decisão de sequenciamento (auditoria antes de redesign).

## 3. Seções do documento gerado (ordem real de renderização)

| # | Seção | Linha |
|---|---|---|
| — | Edit Toolbar | 2197 |
| 1 | Cover Page | 2233 |
| 2 | Table of Contents | 2273 |
| 3 | Resumo Executivo | 2302 |
| 4 | Roadmap (placeholder p/ pós-processamento) | 2364 |
| 5 | Informações da Empresa | 2367 |
| 6 | Golden Circle | 2459 |
| 7 | Identidade Organizacional | 2609 |
| 8 | Matriz SWOT | 2738 |
| 9 | Diagnóstico de Maturidade | 2905 |
| 10 | ICP | 3061 |
| 11 | Análise Competitiva | 3205 |
| 12 | Precificação | 3361 |
| 13 | Estratégias de Valor | 3502 |
| 14 | Motores de Crescimento | 3620 |
| 15 | Organograma | 3790 |
| 16 | Processos | 3882 |
| 17 | Análise Financeira | 3950 |
| 18 | SWOT Pessoal | 4319 |
| 19 | Agenda CEO | 4437 |
| 20 | Próximos Passos | 4598 |
| 21 | Master Checklist (Plano de Ação Consolidado) | 4655 |
| — | Footer | 5006 |

## 4. Pós-processamento do Roadmap (5.018–5.108)

O roadmap consolidado **não é calculado a partir dos dados do projeto**. O fluxo real:
1. O HTML completo é gerado com um placeholder de roadmap;
2. Um regex varre o próprio HTML (`action-plan-title` / `action-plan-list`) extraindo as ações dos capítulos;
3. Deduplicação por título normalizado;
4. Classificação de urgência por palavras-chave (crítica/alta/média/evolução/estratégica → prazos de 30 dias a 12 meses);
5. O placeholder é substituído pelo HTML do roadmap.

### Riscos estruturais decorrentes
- Qualquer mudança no markup dos planos de ação quebra o roadmap **silenciosamente** (regex deixa de casar, roadmap sai vazio ou parcial).
- Classificação por keyword é sensível a redação; não considera a severidade real do diagnóstico.
- Impossível testar o roadmap isoladamente — depende do HTML inteiro.

**Decisão de arquitetura**: no refactor, o roadmap passa a ser calculado no `buildReportModel` diretamente dos dados (padrão já usado no Playbook V2 em `reportRoadmap.ts`), eliminando o regex.

## 5. Divergências com decisões registradas (insumo direto da auditoria)

| Decisão registrada | Estado real no código |
|---|---|
| Sumário (TOC) removido — âncoras não funcionam em HTML estático | **Presente e ativo** (linha 2273) |
| Master Checklist removido — redundante com o roadmap | **Presente e ativo** (linha 4655) |
| Roadmap calculado dos scores de maturidade antes do template | **Não**: extraído por regex do HTML após o template (seção 4 acima) |
| Banner do cap. Diagnóstico de Maturidade dinâmico pela menor dimensão | Hardcoded para a iniciativa financeira (bug conhecido, confirmar linha na auditoria) |
| Narrativas devem refletir severidade relativa do SWOT | Usa sempre posição 0 dos arrays (bug conhecido, confirmar linha na auditoria) |

## 6. Sequência de refactor aprovada

1. ✅ **Extrair CSS** → `reportStyles.ts` (verificado byte a byte);
2. ✅ **Funções de conteúdo + roadmap sem regex** → `reportModel.ts` + coletor `renderActionPlan` (output validado idêntico com dados fixos);
3. ✅ **Seções extraídas** em 25 renderizadores locais `secXxx()` dentro do generateReport (byte a byte idêntico);
4. **Auditoria** do modelo contra a arquitetura canônica; correção dos bugs de conteúdo;
5. **Redesign visual** alinhado ao modelo executivo (Playbook), incluindo capa, rodapé e tema claro/escuro.

Regra de ouro em todas as etapas: cada commit deve produzir HTML byte a byte idêntico ao anterior (exceto quando a etapa é explicitamente de mudança de conteúdo/visual).
