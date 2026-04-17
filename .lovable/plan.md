

## Plano: Cópia 100% isolada em `/versaorecomendacao`

### Garantia de não-alteração do original
Compromisso explícito: **nenhum arquivo dentro de `src/components/`, `src/contexts/`, `src/hooks/`, `src/types/`, `src/utils/`, `src/pages/HomePage.tsx`, `src/pages/Index.tsx` será tocado**. A única modificação fora da v2 será adicionar 3 linhas de `<Route>` em `src/App.tsx` (rotas novas, nenhuma existente alterada).

### O que será criado (tudo novo, zero edição)

**1. Migration — tabela isolada**
```sql
CREATE TABLE public.consulting_projects_v2 (...mesma estrutura...);
-- RLS policies públicas idênticas + trigger updated_at
```

**2. Estrutura paralela de arquivos (~40 novos)**
```text
src/
├── components-v2/         (cópia de todos os componentes)
│   ├── blocks/            (14 blocos)
│   └── financial-blocks/  (10 blocos + ValueSlider)
├── contexts-v2/ConsultingContextV2.tsx   (usa consulting_projects_v2)
├── hooks-v2/useAISuggestions.ts
├── types-v2/              (consulting.ts + financialSimulation.ts)
├── utils-v2/              (5 geradores)
└── pages/
    ├── HomePageV2.tsx     (botões → /versaorecomendacao/*)
    └── IndexV2.tsx
```

Todos os imports internos da v2 apontam **somente** para arquivos `-v2`. Nenhum import cruzado com o original.

**3. Única alteração externa: `src/App.tsx`** — adicionar 3 rotas, sem remover nada:
```tsx
<Route path="/versaorecomendacao" element={
  <ConsultingProviderV2><HomePageV2 /></ConsultingProviderV2>
} />
<Route path="/versaorecomendacao/projetos" element={
  <ConsultingProviderV2><IndexV2 projectType="real" /></ConsultingProviderV2>
} />
<Route path="/versaorecomendacao/simulacao" element={
  <ConsultingProviderV2><IndexV2 projectType="simulation" /></ConsultingProviderV2>
} />
```

### Isolamento garantido
| Camada | Original | Cópia v2 |
|---|---|---|
| Tabela DB | `consulting_projects` | `consulting_projects_v2` |
| Contexto React | `ConsultingProvider` | `ConsultingProviderV2` |
| Componentes | `src/components/` | `src/components-v2/` |
| Rotas | `/`, `/projetos`, `/simulacao` | `/versaorecomendacao/*` |

Editar qualquer arquivo da v2 no futuro **não afeta** o original. Editar o original **não afeta** a v2. Projetos criados em uma versão são invisíveis para a outra.

### Observação técnica
O arquivo `src/integrations/supabase/types.ts` é regenerado automaticamente pela migration (inclui a nova tabela) — isso é gerenciado pelo Supabase, não é edição manual.

