## Limpeza da versão v2 (frontend)

A migração de autenticação já foi aplicada e a tabela `consulting_projects_v2` foi removida. Agora o build quebra porque `src/contexts-v2/ConsultingContextV2.tsx` ainda referencia essa tabela. Vou remover tudo que pertence à v2 — era exatamente a limpeza que já havia sido planejada após o Remix.

### Arquivos e pastas a excluir
- `src/components-v2/` (pasta inteira, incluindo `blocks/` e `financial-blocks/`)
- `src/contexts-v2/`
- `src/hooks-v2/`
- `src/types-v2/`
- `src/utils-v2/`
- `src/pages/HomePageV2.tsx`
- `src/pages/IndexV2.tsx`

### Ajustes em `src/App.tsx`
- Remover imports de `HomePageV2` e `IndexV2`.
- Remover as rotas `/versaorecomendacao` e `/versaorecomendacao/projeto/:id` (ou equivalentes).

### Verificação
- Rodar checagem de tipos para confirmar que nenhum outro arquivo importa de `-v2/`.
- Não altero nenhum outro código de frontend (nada em `src/components/`, `src/contexts/`, páginas originais, etc.).

### Fora do escopo
- Não recriar a tabela v2.
- Não mexer no projeto remixado (aquela limpeza acontece no chat do outro projeto).
