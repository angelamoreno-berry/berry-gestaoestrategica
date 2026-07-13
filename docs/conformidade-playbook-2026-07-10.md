# Conformidade — Playbook Gestão Estratégica v1.0 vs. Plataforma vs. Arquitetura Canônica

> Data: 10/07/2026 · Insumo para revisão do playbook (Angela + Felipe) e backlog da plataforma.

## Conformes

| Item do playbook | Estado |
|---|---|
| Acesso individual por consultor, restrito aos próprios projetos | ✅ Implementado: RLS `proj_select` (membro ou admin) + vínculo automático do criador como editor |
| Sugestões de IA para lacunas (missão, visão, valores) | ✅ `useAISuggestions` nos blocos da plataforma |
| Lógica comercial fora do documento (CS atua no processo) | ✅ Consagrado na arquitetura canônica (reunião de entrega) |
| Registro único na ferramenta alimentando o relatório | ✅ Modelo de dados centralizado |

## Desacordos (por gravidade)

| # | Playbook diz | Realidade | Encaminhamento sugerido |
|---|---|---|---|
| 1 | Entregável: **Checklist executivo de implementação** (seções 2 e 4.2) | Removido do relatório em 10/07 (decisão D7); substituto canônico (P9 "primeiros 30 dias" com critério de pronto) só chega na etapa 5 | **Promessa descoberta até a etapa 5.** Decidir: restaurar temporariamente, acelerar P9, ou revisar o texto do playbook |
| 2 | **Roadmap 3, 6 e 12 meses** (3 menções) | Relatório: 8 iniciativas em 5 horizontes (30d/3/6/9/12) | Revisar playbook quando etapa 5 consolidar; um dos documentos precisa ceder |
| 3 | Maturidade em ~12 áreas típicas, **conjunto adaptável ao perfil** | Ferramenta pontua 4 dimensões fixas (Pessoas, Processos, Finanças, Mercado) | Backlog da plataforma ou reescrita da seção 2.1 do playbook |
| 4 | **Registrar cenário financeiro (1–4) e nível de confiabilidade na ferramenta**; relatório nasce com a ressalva | Campo inexistente; relatório sem ressalva de estimativa; variante Contingência ainda não existe no gerador | Backlog prioritário da plataforma — é o dado que bifurca Mestre/Contingência |
| 5 | Pelo menos **uma evidência concreta por avaliação** de maturidade | Campo `notes` existe mas não é obrigatório nem rotulado como evidência | UX: rotular como "Evidência" + validação leve no bloco |
| 6 | Entrega focada nos **primeiros 90 dias** | Arquitetura canônica: "primeiros 30 dias" + "primeira semana" | Alinhar terminologia na revisão do playbook |

## Leitura geral

O playbook descreve a geração anterior do produto (roadmap 3/6/12, checklist executivo) — o mesmo descompasso que a auditoria encontrou no código. Tratar como artefato a convergir junto com a etapa 5, não como veto à arquitetura canônica.
