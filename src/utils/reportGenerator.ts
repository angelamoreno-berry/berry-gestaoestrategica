import { ConsultingData, BlockStatus, Project } from '@/types/consulting';

// Helper functions for generating insights
const generateMaturityInsights = (level: number, area: string): string => {
  const insights: Record<number, Record<string, string>> = {
    1: {
      pessoas: "A área de pessoas está em estágio inicial. É fundamental estruturar processos básicos de RH, definir funções claras e criar uma cultura organizacional sólida.",
      processos: "Os processos estão desorganizados ou inexistentes. Priorize mapear os processos críticos e documentá-los para garantir consistência operacional.",
      financas: "O controle financeiro é precário. Implemente controles básicos de fluxo de caixa, DRE e balanço patrimonial imediatamente.",
      mercado: "O conhecimento de mercado é superficial. Invista em pesquisa de mercado e análise competitiva para entender melhor o ambiente."
    },
    2: {
      pessoas: "Existem estruturas básicas, mas falta profissionalização. Considere implementar avaliações de desempenho e planos de carreira.",
      processos: "Alguns processos existem, mas não são padronizados. Documente procedimentos e crie indicadores de acompanhamento.",
      financas: "Há controles básicos, mas falta análise estratégica. Implemente indicadores financeiros (ROI, margem, ponto de equilíbrio).",
      mercado: "O posicionamento existe, mas não é diferenciado. Desenvolva uma proposta de valor única e comunique-a claramente."
    },
    3: {
      pessoas: "A gestão de pessoas está em nível intermediário. Foque em desenvolvimento de lideranças e programas de engajamento.",
      processos: "Os processos são razoavelmente estruturados. É hora de otimizar e automatizar onde possível.",
      financas: "O controle financeiro é bom. Avance para planejamento financeiro de médio/longo prazo e gestão de investimentos.",
      mercado: "O mercado é bem compreendido. Busque nichos específicos para dominar e criar barreiras competitivas."
    },
    4: {
      pessoas: "A gestão de pessoas é madura. Implemente programas de inovação e intraempreendedorismo para manter o engajamento.",
      processos: "Os processos são eficientes. Considere certificações (ISO) e melhoria contínua (Kaizen/Lean).",
      financas: "A gestão financeira é profissional. Explore novos modelos de receita e estratégias de crescimento acelerado.",
      mercado: "O posicionamento é forte. Explore expansão para novos mercados ou segmentos adjacentes."
    },
    5: {
      pessoas: "Excelência em gestão de pessoas. Mantenha o padrão e torne-se referência do setor em employer branding.",
      processos: "Excelência operacional. Considere escalar o modelo para outras unidades ou franquias.",
      financas: "Excelência financeira. Explore M&A, venture capital ou IPO se for estratégico.",
      mercado: "Liderança de mercado. Defina a agenda do setor e antecipe tendências."
    }
  };
  return insights[level]?.[area] || "Avalie as necessidades específicas desta área para desenvolvimento.";
};

const generateActionPlan = (area: string, level: number): string[] => {
  const plans: Record<string, Record<number, string[]>> = {
    pessoas: {
      1: ["Definir organograma básico e descrição de cargos", "Implementar processo de contratação estruturado", "Criar manual do colaborador"],
      2: ["Implementar avaliação de desempenho trimestral", "Criar plano de cargos e salários", "Desenvolver programa de integração (onboarding)"],
      3: ["Criar programa de desenvolvimento de lideranças", "Implementar pesquisa de clima organizacional", "Desenvolver plano de carreira para posições-chave"],
      4: ["Criar programa de inovação interno", "Implementar gestão por OKRs", "Desenvolver programa de mentoria"],
      5: ["Tornar-se referência em employer branding", "Criar academia corporativa", "Implementar programa de equity para colaboradores"]
    },
    processos: {
      1: ["Mapear os 5 processos mais críticos", "Documentar procedimentos operacionais padrão (POPs)", "Criar checklist para atividades recorrentes"],
      2: ["Implementar ferramentas de gestão de projetos", "Criar indicadores (KPIs) para cada processo", "Estabelecer reuniões de acompanhamento"],
      3: ["Automatizar processos repetitivos", "Implementar sistema de gestão integrado (ERP)", "Criar comitê de melhoria contínua"],
      4: ["Buscar certificação ISO 9001", "Implementar metodologia Lean/Six Sigma", "Criar centro de excelência operacional"],
      5: ["Explorar RPA (automação robótica)", "Implementar IA nos processos-chave", "Desenvolver modelo escalável/franqueável"]
    },
    financas: {
      1: ["Separar finanças pessoais das empresariais", "Implementar controle de fluxo de caixa semanal", "Criar DRE mensal simplificada"],
      2: ["Implementar centro de custos", "Criar orçamento anual", "Calcular ponto de equilíbrio e margem de contribuição"],
      3: ["Implementar análise de indicadores financeiros (ROI, ROE, EBITDA)", "Criar planejamento financeiro de 3 anos", "Desenvolver política de precificação baseada em valor"],
      4: ["Implementar tesouraria profissional", "Criar comitê financeiro", "Explorar linhas de crédito e financiamento para crescimento"],
      5: ["Avaliar captação de investimento externo", "Considerar fusões e aquisições", "Preparar estrutura para eventual IPO ou venda"]
    },
    mercado: {
      1: ["Realizar pesquisa básica de concorrentes", "Definir persona do cliente ideal", "Criar proposta de valor inicial"],
      2: ["Mapear jornada do cliente", "Implementar pesquisa de satisfação (NPS)", "Desenvolver estratégia de diferenciação"],
      3: ["Criar programa de fidelização", "Desenvolver parcerias estratégicas", "Implementar inteligência de mercado"],
      4: ["Expandir para novos segmentos ou regiões", "Desenvolver produtos/serviços complementares", "Criar barreiras de entrada para concorrentes"],
      5: ["Liderar associações do setor", "Definir tendências e padrões do mercado", "Explorar internacionalização"]
    }
  };
  return plans[area]?.[level] || ["Avaliar necessidades específicas", "Desenvolver plano customizado", "Implementar melhorias incrementais"];
};

export function generateReport(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const overallProgress = Math.round(blocks.reduce((acc, b) => acc + b.progress, 0) / blocks.length);
  
  const avgMaturity = Math.round(
    (data.diagnostico.pessoas.level + data.diagnostico.processos.level + 
     data.diagnostico.financas.level + data.diagnostico.mercado.level) / 4 * 10
  ) / 10;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano de Estruturação em Gestão - ${project.nomeEmpresa}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0066FF;
      --primary-light: #E8F0FF;
      --accent: #00B377;
      --accent-light: #E6F7F1;
      --background: #FAFAFA;
      --card: #FFFFFF;
      --foreground: #1A1F36;
      --muted: #64748B;
      --border: #E2E8F0;
      --destructive: #EF4444;
      --warning: #F59E0B;
      --success: #10B981;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      line-height: 1.7; 
      color: var(--foreground); 
      background: var(--background);
      font-size: 14px;
    }
    
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
      background: var(--card);
    }
    
    /* Cover Page */
    .cover-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 60px 40px;
      background: linear-gradient(135deg, var(--primary) 0%, #0044AA 100%);
      color: white;
      page-break-after: always;
    }
    
    .cover-logo {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      margin-bottom: 40px;
    }
    
    .cover-title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    
    .cover-subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 60px;
      font-weight: 300;
    }
    
    .cover-company {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .cover-segment {
      font-size: 16px;
      opacity: 0.8;
      margin-bottom: 40px;
    }
    
    .cover-meta {
      font-size: 14px;
      opacity: 0.7;
    }
    
    .cover-progress {
      margin-top: 60px;
      background: rgba(255,255,255,0.2);
      padding: 20px 40px;
      border-radius: 12px;
    }
    
    .cover-progress-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .cover-progress-value {
      font-size: 36px;
      font-weight: 700;
    }
    
    /* Content Pages */
    .content {
      padding: 50px 60px;
    }
    
    /* Table of Contents */
    .toc {
      page-break-after: always;
      padding: 60px;
    }
    
    .toc-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 40px;
      padding-bottom: 16px;
      border-bottom: 3px solid var(--primary);
    }
    
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px dotted var(--border);
    }
    
    .toc-item-name {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .toc-item-icon {
      width: 28px;
      height: 28px;
      background: var(--primary-light);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .toc-item-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--muted);
    }
    
    .toc-item-progress {
      width: 60px;
      height: 6px;
      background: var(--border);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .toc-item-progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 3px;
    }
    
    /* Section Styling */
    .section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }
    
    .section-header {
      margin-bottom: 30px;
    }
    
    .section-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary) 0%, #0044AA 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: var(--foreground);
      margin-bottom: 8px;
    }
    
    .section-description {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
      max-width: 700px;
    }
    
    /* Info Box - Explanation */
    .info-box {
      background: var(--primary-light);
      border-left: 4px solid var(--primary);
      padding: 20px 24px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 30px;
    }
    
    .info-box-title {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 8px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-box-text {
      color: var(--foreground);
      font-size: 13px;
      line-height: 1.7;
    }
    
    /* Insight Box */
    .insight-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid #F59E0B;
      padding: 20px 24px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }
    
    .insight-box-title {
      font-weight: 600;
      color: #92400E;
      margin-bottom: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .insight-box-text {
      color: #78350F;
      font-size: 13px;
      line-height: 1.7;
    }
    
    /* Action Plan Box */
    .action-plan {
      background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 2px solid #10B981;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .action-plan-title {
      font-weight: 700;
      color: #065F46;
      margin-bottom: 16px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .action-plan-list {
      list-style: none;
    }
    
    .action-plan-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px dashed #A7F3D0;
    }
    
    .action-plan-item:last-child {
      border-bottom: none;
    }
    
    .action-plan-number {
      width: 28px;
      height: 28px;
      background: #10B981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }
    
    .action-plan-text {
      color: #065F46;
      font-size: 14px;
      line-height: 1.5;
    }
    
    /* Suggestion Box */
    .suggestion-box {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border: 1px solid #93C5FD;
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
    }
    
    .suggestion-title {
      font-weight: 600;
      color: #1E40AF;
      margin-bottom: 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .suggestion-text {
      color: #1E3A8A;
      font-size: 13px;
      line-height: 1.7;
    }
    
    /* Cards */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }
    
    .card-title {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 12px;
      color: var(--foreground);
    }
    
    .card-content {
      color: var(--foreground);
      line-height: 1.7;
    }
    
    /* Data Grid */
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .data-item {
      background: var(--background);
      padding: 16px 20px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    
    .data-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    
    .data-value {
      font-weight: 600;
      font-size: 16px;
      color: var(--foreground);
    }
    
    /* Tags */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .tag {
      background: var(--primary-light);
      color: var(--primary);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .tag-accent {
      background: var(--accent-light);
      color: var(--accent);
    }
    
    /* Lists */
    .list {
      list-style: none;
    }
    
    .list-item {
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .list-item:last-child {
      border-bottom: none;
    }
    
    .list-bullet {
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }
    
    /* SWOT Grid */
    .swot-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .swot-box {
      padding: 24px;
      border-radius: 12px;
    }
    
    .swot-forcas { 
      background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 1px solid #A7F3D0;
    }
    
    .swot-fraquezas { 
      background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
      border: 1px solid #FCA5A5;
    }
    
    .swot-oportunidades { 
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border: 1px solid #93C5FD;
    }
    
    .swot-ameacas { 
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 1px solid #FCD34D;
    }
    
    .swot-title {
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .swot-list {
      font-size: 13px;
      line-height: 1.8;
    }
    
    /* Maturity Levels */
    .maturity-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .maturity-item {
      background: var(--background);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    
    .maturity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .maturity-area {
      font-weight: 600;
      font-size: 14px;
    }
    
    .maturity-level {
      font-weight: 700;
      font-size: 20px;
      color: var(--primary);
    }
    
    .maturity-bar {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    
    .maturity-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: 4px;
    }
    
    .maturity-notes {
      font-size: 12px;
      color: var(--muted);
      font-style: italic;
    }
    
    /* Competitor Table */
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    
    .table th {
      background: var(--primary);
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
    }
    
    .table th:first-child { border-radius: 8px 0 0 0; }
    .table th:last-child { border-radius: 0 8px 0 0; }
    
    .table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
    }
    
    .table tr:last-child td:first-child { border-radius: 0 0 0 8px; }
    .table tr:last-child td:last-child { border-radius: 0 0 8px 0; }
    
    .table tr:nth-child(even) { background: var(--background); }
    
    /* Priority Badge */
    .priority {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .priority-alta {
      background: #FEE2E2;
      color: #DC2626;
    }
    
    .priority-media {
      background: #FEF3C7;
      color: #D97706;
    }
    
    .priority-baixa {
      background: #DCFCE7;
      color: #16A34A;
    }
    
    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border);
    }
    
    .timeline-item {
      position: relative;
      padding-bottom: 24px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -26px;
      top: 4px;
      width: 12px;
      height: 12px;
      background: var(--primary);
      border-radius: 50%;
      border: 3px solid var(--card);
    }
    
    .timeline-label {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary);
      margin-bottom: 6px;
    }
    
    .timeline-content {
      font-size: 13px;
      color: var(--foreground);
    }
    
    /* Packages */
    .package-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .package-card {
      background: var(--card);
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .package-name {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 8px;
      color: var(--primary);
    }
    
    .package-price {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 12px;
      color: var(--foreground);
    }
    
    .package-description {
      font-size: 13px;
      color: var(--muted);
    }
    
    /* Golden Circle */
    .golden-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
    
    .golden-ring {
      width: 100%;
      padding: 30px 40px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: -10px;
    }
    
    .golden-why {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border: 2px solid #F59E0B;
      z-index: 3;
    }
    
    .golden-how {
      background: linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%);
      border: 2px solid #3B82F6;
      z-index: 2;
    }
    
    .golden-what {
      background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%);
      border: 2px solid #6366F1;
      z-index: 1;
    }
    
    .golden-label {
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    
    .golden-content {
      font-size: 15px;
      line-height: 1.6;
    }
    
    /* Organogram */
    .org-chart {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .org-level {
      margin-bottom: 16px;
    }
    
    .org-level-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border);
    }
    
    .org-level-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .org-level-1 .org-level-dot { background: #EAB308; }
    .org-level-2 .org-level-dot { background: #3B82F6; }
    .org-level-3 .org-level-dot { background: #22C55E; }
    
    .org-level-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--muted);
    }
    
    .org-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    
    .org-card {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      border-left: 4px solid var(--border);
    }
    
    .org-level-1 .org-card { border-left-color: #EAB308; }
    .org-level-2 .org-card { border-left-color: #3B82F6; }
    .org-level-3 .org-card { border-left-color: #22C55E; }
    
    .org-title {
      font-weight: 700;
      font-size: 16px;
      color: var(--foreground);
      margin-bottom: 4px;
    }
    
    .org-subordinate {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 12px;
    }
    
    .org-section {
      margin-bottom: 12px;
    }
    
    .org-section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    
    .org-responsibilities {
      font-size: 13px;
    }
    
    .org-kpis {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .org-kpi {
      background: var(--accent-light);
      color: var(--accent);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }
    
    /* Process Card */
    .process-card {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 12px;
    }
    
    .process-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .process-name {
      font-weight: 700;
      font-size: 15px;
      color: var(--foreground);
    }
    
    .process-frequency {
      background: var(--primary-light);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .process-description {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    
    .process-responsible {
      font-size: 12px;
      color: var(--primary);
      font-weight: 500;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 40px 60px;
      background: var(--background);
      border-top: 1px solid var(--border);
    }
    
    .footer-logo {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .footer-text {
      color: var(--muted);
      font-size: 12px;
    }
    
    /* Page Break */
    .page-break {
      page-break-before: always;
    }
    
    /* Print Styles */
    @media print {
      body { background: white; }
      .container { box-shadow: none; }
      .section { page-break-inside: avoid; }
      .cover-page { min-height: 100vh; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Cover Page -->
    <div class="cover-page">
      <div class="cover-logo">📊</div>
      <h1 class="cover-title">Plano de Estruturação<br>em Gestão</h1>
      <p class="cover-subtitle">Documento Estratégico de Consultoria</p>
      
      <div class="cover-company">${project.nomeEmpresa}</div>
      <div class="cover-segment">Segmento: ${project.segmento}</div>
      
      <div class="cover-meta">
        <p>Responsável: ${project.responsavel}</p>
        <p>Data: ${formatDate(new Date().toISOString())}</p>
      </div>
      
      <div class="cover-progress">
        <div class="cover-progress-label">Progresso Geral</div>
        <div class="cover-progress-value">${overallProgress}%</div>
      </div>
    </div>
    
    <!-- Table of Contents -->
    <div class="toc">
      <h2 class="toc-title">Sumário</h2>
      ${blocks.map(block => `
        <div class="toc-item">
          <div class="toc-item-name">
            <span class="toc-item-icon">${block.icon}</span>
            <span>${block.name}</span>
          </div>
          <div class="toc-item-status">
            <div class="toc-item-progress">
              <div class="toc-item-progress-fill" style="width: ${block.progress}%"></div>
            </div>
            <span>${block.progress}%</span>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Company Info -->
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🏢</div>
          <h2 class="section-title">Informações da Empresa</h2>
          <p class="section-description">Dados cadastrais e visão geral do negócio em análise.</p>
        </div>
        
        <div class="data-grid">
          <div class="data-item">
            <div class="data-label">Empresa</div>
            <div class="data-value">${project.nomeEmpresa}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Segmento de Atuação</div>
            <div class="data-value">${project.segmento}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Responsável Principal</div>
            <div class="data-value">${project.responsavel}</div>
          </div>
          <div class="data-item">
            <div class="data-label">E-mail de Contato</div>
            <div class="data-value">${project.emailResponsavel || 'Não informado'}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Faturamento Médio Mensal</div>
            <div class="data-value">${formatCurrency(project.faturamentoMedio)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Número de Colaboradores</div>
            <div class="data-value">${project.quantidadeColaboradores} pessoas</div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Análise do Perfil</div>
          <div class="insight-box-text">
            ${project.faturamentoMedio > 0 && project.quantidadeColaboradores > 0 ? `
              Com faturamento de ${formatCurrency(project.faturamentoMedio)} e ${project.quantidadeColaboradores} colaboradores, 
              a receita média por colaborador é de ${formatCurrency(project.faturamentoMedio / project.quantidadeColaboradores)}.
              ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 
                ? 'Este valor sugere oportunidade de aumentar produtividade ou revisar a estrutura de custos com pessoal.'
                : project.faturamentoMedio / project.quantidadeColaboradores > 30000
                  ? 'Este é um bom indicador de produtividade. Considere investir em tecnologia para manter esta eficiência.'
                  : 'Este valor está dentro da média de mercado. Busque oportunidades de otimização gradual.'}
            ` : 'Complete as informações de faturamento e colaboradores para análise de produtividade.'}
          </div>
        </div>
      </div>
      
      <!-- Diagnóstico -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🔍</div>
          <h2 class="section-title">Diagnóstico de Maturidade</h2>
          <p class="section-description">Avaliação do nível de maturidade em cada área crítica do negócio.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 O que é o Diagnóstico de Maturidade?</div>
          <div class="info-box-text">
            O diagnóstico avalia o estágio atual da empresa em 4 dimensões fundamentais: Pessoas, Processos, Finanças e Mercado. 
            Cada área recebe uma nota de 1 a 5, onde 1 representa um estágio inicial e 5 representa excelência operacional.
            <strong>Maturidade média atual: ${avgMaturity}/5</strong>
          </div>
        </div>
        
        <div class="maturity-grid">
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area">👥 Pessoas</span>
              <span class="maturity-level">${data.diagnostico.pessoas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.pessoas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.pessoas.notes || 'Sem observações'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area">⚙️ Processos</span>
              <span class="maturity-level">${data.diagnostico.processos.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.processos.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.processos.notes || 'Sem observações'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area">💰 Finanças</span>
              <span class="maturity-level">${data.diagnostico.financas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.financas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.financas.notes || 'Sem observações'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area">🎯 Mercado</span>
              <span class="maturity-level">${data.diagnostico.mercado.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.mercado.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.mercado.notes || 'Sem observações'}</div>
          </div>
        </div>
        
        <!-- Insights por área -->
        <div class="insight-box">
          <div class="insight-box-title">🎯 Insights do Diagnóstico</div>
          <div class="insight-box-text">
            <p><strong>Pessoas (${data.diagnostico.pessoas.level}/5):</strong> ${generateMaturityInsights(data.diagnostico.pessoas.level, 'pessoas')}</p>
            <p style="margin-top: 12px;"><strong>Processos (${data.diagnostico.processos.level}/5):</strong> ${generateMaturityInsights(data.diagnostico.processos.level, 'processos')}</p>
            <p style="margin-top: 12px;"><strong>Finanças (${data.diagnostico.financas.level}/5):</strong> ${generateMaturityInsights(data.diagnostico.financas.level, 'financas')}</p>
            <p style="margin-top: 12px;"><strong>Mercado (${data.diagnostico.mercado.level}/5):</strong> ${generateMaturityInsights(data.diagnostico.mercado.level, 'mercado')}</p>
          </div>
        </div>
        
        <!-- Plano de Ação do Diagnóstico -->
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Diagnóstico</div>
          
          ${['pessoas', 'processos', 'financas', 'mercado'].map(area => {
            const areaData = data.diagnostico[area as keyof typeof data.diagnostico];
            const areaName = area === 'pessoas' ? '👥 Pessoas' : 
                            area === 'processos' ? '⚙️ Processos' : 
                            area === 'financas' ? '💰 Finanças' : '🎯 Mercado';
            const actions = generateActionPlan(area, areaData.level);
            return `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #065F46; margin-bottom: 8px;">${areaName} - Nível ${areaData.level}</h4>
                <ul class="action-plan-list">
                  ${actions.map((action, i) => `
                    <li class="action-plan-item">
                      <span class="action-plan-number">${i + 1}</span>
                      <span class="action-plan-text">${action}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Identidade Organizacional -->
      ${data.identidade.visao || data.identidade.missao || data.identidade.valores.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🎯</div>
          <h2 class="section-title">Identidade Organizacional</h2>
          <p class="section-description">Os pilares que definem quem somos, aonde queremos chegar e o que nos guia.</p>
        </div>
        
        ${data.identidade.visao ? `
        <div class="card">
          <div class="card-title">🔭 Visão de Futuro</div>
          <div class="card-content">${data.identidade.visao}</div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Como usar a Visão</div>
          <div class="suggestion-text">
            Comunique a visão em todas as reuniões de equipe. Cole em locais visíveis. Use como critério para avaliar novas oportunidades: 
            "Isso nos aproxima da nossa visão?". Revise anualmente para garantir que continua relevante e inspiradora.
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.missao ? `
        <div class="card">
          <div class="card-title">🎯 Missão</div>
          <div class="card-content">${data.identidade.missao}</div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Como aplicar a Missão</div>
          <div class="suggestion-text">
            A missão deve guiar todas as decisões operacionais. Treine sua equipe para responder: "Como isso se conecta com nossa missão?".
            Use em materiais de marketing e no processo de contratação para atrair pessoas alinhadas.
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.valores.length > 0 ? `
        <div class="card">
          <div class="card-title">💎 Valores Organizacionais</div>
          <div class="tags">
            ${data.identidade.valores.map(v => `<span class="tag">${v}</span>`).join('')}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Como viver os Valores</div>
          <div class="suggestion-text">
            ${data.identidade.valores.map((v, i) => `
              <strong>${v}:</strong> Crie comportamentos observáveis para este valor. Ex: reconheça publicamente colaboradores que demonstram "${v}" em suas ações.
            `).join(' ')}
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.posicionamento ? `
        <div class="card">
          <div class="card-title">📍 Posicionamento de Mercado</div>
          <div class="card-content">${data.identidade.posicionamento}</div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Como fortalecer o Posicionamento</div>
          <div class="suggestion-text">
            Garanta que todas as comunicações (site, redes sociais, atendimento) reflitam este posicionamento. 
            Treine a equipe para comunicar consistentemente. Avalie se os preços e a experiência do cliente estão alinhados.
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Identidade</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Realizar workshop com lideranças para validar e internalizar visão, missão e valores</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Criar materiais visuais (posters, cards) com a identidade para distribuir na empresa</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Incluir avaliação de valores nas avaliações de desempenho e feedbacks</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Atualizar site e materiais de marketing com o posicionamento definido</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Criar programa de reconhecimento mensal para colaboradores que exemplificam os valores</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Golden Circle -->
      ${data.goldenCircle.why || data.goldenCircle.how || data.goldenCircle.what ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">⭕</div>
          <h2 class="section-title">Golden Circle</h2>
          <p class="section-description">O framework de Simon Sinek para comunicação inspiradora e diferenciação.</p>
        </div>
        
        <div class="golden-circle">
          ${data.goldenCircle.why ? `
          <div class="golden-ring golden-why">
            <div class="golden-label">🌟 Why - Por quê?</div>
            <div class="golden-content">${data.goldenCircle.why}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.how ? `
          <div class="golden-ring golden-how">
            <div class="golden-label">⚡ How - Como?</div>
            <div class="golden-content">${data.goldenCircle.how}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.what ? `
          <div class="golden-ring golden-what">
            <div class="golden-label">📦 What - O quê?</div>
            <div class="golden-content">${data.goldenCircle.what}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Aplicando o Golden Circle</div>
          <div class="insight-box-text">
            ${data.goldenCircle.why ? `
              <strong>Seu WHY:</strong> "${data.goldenCircle.why}" - Este é o coração da sua marca. 
              Lidere com isso em todas as apresentações de vendas. Clientes se conectam emocionalmente com o propósito, não com produtos.
            ` : ''}
            ${data.goldenCircle.how ? `
              <br><br><strong>Seu HOW:</strong> "${data.goldenCircle.how}" - Isto diferencia você dos concorrentes.
              Documente estes processos e treine a equipe para executá-los consistentemente.
            ` : ''}
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Golden Circle</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Reescrever o pitch de vendas começando pelo WHY: "Nós acreditamos que ${data.goldenCircle.why || '...'}..."</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Atualizar a página "Sobre" do site com a narrativa do Golden Circle</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Criar conteúdos de marketing que comuniquem o propósito (WHY) antes dos produtos (WHAT)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Usar o WHY como critério de contratação: "Esta pessoa compartilha nossa crença?"</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ICP -->
      ${data.icp.caracteristicasDemograficas || data.icp.dores.length > 0 || data.icp.desejos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">👤</div>
          <h2 class="section-title">Perfil do Cliente Ideal (ICP)</h2>
          <p class="section-description">Conhecimento profundo do cliente que mais se beneficia da nossa solução.</p>
        </div>
        
        ${data.icp.caracteristicasDemograficas ? `
        <div class="card">
          <div class="card-title">📊 Características Demográficas</div>
          <div class="card-content">${data.icp.caracteristicasDemograficas}</div>
        </div>
        ` : ''}
        
        <div class="data-grid">
          ${data.icp.dores.length > 0 ? `
          <div class="card">
            <div class="card-title">😣 Dores e Problemas</div>
            <ul class="list">
              ${data.icp.dores.map(d => `<li class="list-item"><span class="list-bullet"></span><span>${d}</span></li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${data.icp.desejos.length > 0 ? `
          <div class="card">
            <div class="card-title">🌟 Desejos e Aspirações</div>
            <ul class="list">
              ${data.icp.desejos.map(d => `<li class="list-item"><span class="list-bullet"></span><span>${d}</span></li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
        
        ${data.icp.comportamento ? `
        <div class="card">
          <div class="card-title">🧠 Comportamento de Compra</div>
          <div class="card-content">${data.icp.comportamento}</div>
        </div>
        ` : ''}
        
        ${data.icp.ondeEncontrar ? `
        <div class="card">
          <div class="card-title">📍 Onde Encontrar</div>
          <div class="card-content">${data.icp.ondeEncontrar}</div>
        </div>
        ` : ''}
        
        <div class="insight-box">
          <div class="insight-box-title">💡 Estratégias baseadas no ICP</div>
          <div class="insight-box-text">
            ${data.icp.dores.length > 0 ? `
              <strong>Abordagem de dores:</strong> Suas mensagens de marketing devem começar reconhecendo estas dores: 
              "${data.icp.dores[0]}". Isso gera conexão imediata com o prospect.
            ` : ''}
            ${data.icp.desejos.length > 0 ? `
              <br><br><strong>Promessa de transformação:</strong> Mostre como você leva o cliente de "${data.icp.dores[0] || 'problema atual'}" 
              para "${data.icp.desejos[0]}". Esta é sua promessa de transformação.
            ` : ''}
            ${data.icp.ondeEncontrar ? `
              <br><br><strong>Canais prioritários:</strong> Concentre 80% do esforço de marketing em: ${data.icp.ondeEncontrar}
            ` : ''}
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - ICP</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Entrevistar 10 clientes atuais para validar e aprofundar o ICP</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Criar persona visual com nome, foto e história para humanizar o ICP</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Reescrever copy do site usando exatamente as palavras que o ICP usa para descrever suas dores</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Criar conteúdo educativo que resolva as dores identificadas (blog, vídeos, ebooks)</span>
            </li>
            ${data.icp.ondeEncontrar ? `
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Estabelecer presença ativa em: ${data.icp.ondeEncontrar}</span>
            </li>
            ` : ''}
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Concorrentes -->
      ${data.concorrentes.concorrentes.length > 0 || data.concorrentes.diferenciais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🏆</div>
          <h2 class="section-title">Análise Competitiva</h2>
          <p class="section-description">Mapeamento da concorrência e identificação de vantagens competitivas.</p>
        </div>
        
        ${data.concorrentes.concorrentes.length > 0 ? `
        <table class="table">
          <thead>
            <tr>
              <th>Concorrente</th>
              <th>Ponto Forte</th>
              <th>Ponto Fraco</th>
            </tr>
          </thead>
          <tbody>
            ${data.concorrentes.concorrentes.map(c => `
              <tr>
                <td><strong>${c.nome}</strong></td>
                <td>${c.pontoForte}</td>
                <td>${c.pontoFraco}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="insight-box" style="margin-top: 20px;">
          <div class="insight-box-title">💡 Estratégias Competitivas</div>
          <div class="insight-box-text">
            ${data.concorrentes.concorrentes.map(c => `
              <strong>${c.nome}:</strong> Explorar sua fraqueza ("${c.pontoFraco}") em suas comunicações. 
              Não ataque diretamente, mas posicione-se como solução para este problema específico.
            `).join('<br><br>')}
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.diferenciais.length > 0 ? `
        <div class="card" style="margin-top: 20px;">
          <div class="card-title">⭐ Nossos Diferenciais Competitivos</div>
          <div class="tags">
            ${data.concorrentes.diferenciais.map(d => `<span class="tag tag-accent">${d}</span>`).join('')}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Como comunicar diferenciais</div>
          <div class="suggestion-text">
            ${data.concorrentes.diferenciais.map(d => `
              <strong>"${d}"</strong> - Crie provas sociais (depoimentos, casos) que demonstrem este diferencial na prática.
            `).join(' ')}
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.propostaValor ? `
        <div class="card">
          <div class="card-title">💎 Proposta de Valor Única</div>
          <div class="card-content">${data.concorrentes.propostaValor}</div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Testando a Proposta de Valor</div>
          <div class="suggestion-text">
            Teste: Se seu cliente ideal lesse "${data.concorrentes.propostaValor}", ele imediatamente entenderia por que escolher você?
            Use esta proposta como headline do seu site e em todos os materiais de vendas.
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Concorrência</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Criar rotina mensal de monitoramento de concorrentes (preços, ofertas, comunicação)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Treinar equipe comercial para responder objeções comparativas com concorrentes</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Criar material comparativo (battle card) para uso interno da equipe de vendas</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Desenvolver cases de sucesso que evidenciem cada diferencial competitivo</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Estratégias de Valor -->
      ${data.estrategiasValor.novasOfertas.length > 0 || data.estrategiasValor.pacotes.length > 0 || data.estrategiasValor.novosServicos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">💡</div>
          <h2 class="section-title">Estratégias de Valor</h2>
          <p class="section-description">Novas ofertas e formas de agregar valor aos clientes.</p>
        </div>
        
        ${data.estrategiasValor.novasOfertas.length > 0 ? `
        <div class="card">
          <div class="card-title">🚀 Novas Ofertas Planejadas</div>
          <ul class="list">
            ${data.estrategiasValor.novasOfertas.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Implementando Novas Ofertas</div>
          <div class="suggestion-text">
            ${data.estrategiasValor.novasOfertas.map((o, i) => `
              <strong>${i + 1}. ${o}:</strong> Valide com 5 clientes antes de lançar. Crie MVP mínimo. Lance para base existente primeiro.
            `).join('<br>')}
          </div>
        </div>
        ` : ''}
        
        ${data.estrategiasValor.novosServicos.length > 0 ? `
        <div class="card">
          <div class="card-title">⚡ Novos Serviços</div>
          <ul class="list">
            ${data.estrategiasValor.novosServicos.map(s => `<li class="list-item"><span class="list-bullet"></span><span>${s}</span></li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${data.estrategiasValor.pacotes.length > 0 ? `
        <div class="card">
          <div class="card-title">📦 Pacotes de Serviços</div>
          <div class="package-grid">
            ${data.estrategiasValor.pacotes.map(p => `
              <div class="package-card">
                <div class="package-name">${p.nome}</div>
                <div class="package-price">${p.preco}</div>
                <div class="package-description">${p.descricao}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Otimizando Pacotes</div>
          <div class="suggestion-text">
            Posicione o pacote intermediário como "Mais Popular". Adicione urgência: "Condição especial até [data]".
            O pacote mais caro serve como âncora para fazer o intermediário parecer acessível.
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Estratégias de Valor</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Priorizar uma nova oferta para lançamento nos próximos 30 dias</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Criar página de vendas dedicada para cada pacote/oferta</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Treinar equipe comercial no pitch de cada nova oferta</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Definir metas de vendas específicas para cada oferta</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Precificação -->
      ${(data.precificacao.produtos && data.precificacao.produtos.length > 0) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">💰</div>
          <h2 class="section-title">Estratégia de Precificação</h2>
          <p class="section-description">Produtos/serviços e estratégias para maximização de valor.</p>
        </div>
        
        <h3 style="margin: 30px 0 20px; font-size: 18px; color: var(--primary);">📦 Produtos e Serviços com Sugestões de Precificação</h3>
        ${data.precificacao.produtos.map(produto => `
          <div class="card" style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <div>
                <div class="card-title" style="font-size: 18px;">${produto.nome || 'Produto sem nome'}</div>
                ${produto.descricao ? `<p style="color: var(--muted); font-size: 13px; margin-top: 4px;">${produto.descricao}</p>` : ''}
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase;">Preço Atual</div>
                <div style="font-size: 24px; font-weight: 700; color: var(--foreground);">R$ ${produto.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
            
            ${produto.precoAtual > 0 ? `
            <div style="margin-top: 20px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--primary);">💡 Sugestões de Precificação</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Valor Agregado (+40%)</div>
                  <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">R$ ${(produto.precoAtual * 1.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 6px;">Com garantia, suporte VIP e bônus</div>
                </div>
                <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Combo/Pacote (3 itens)</div>
                  <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">R$ ${(produto.precoAtual * 2.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 6px;">Economia 15% cliente, +67% ticket</div>
                </div>
                <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Plano Premium (2x)</div>
                  <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 6px;">Atendimento prioritário e exclusivo</div>
                </div>
                <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Recorrência (mensal)</div>
                  <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">R$ ${(produto.precoAtual * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 6px;">12x retorno anual garantido</div>
                </div>
                <div style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Baseado em ROI (3x)</div>
                  <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">R$ ${(produto.precoAtual * 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 6px;">Se gera 10x retorno, 3x é barato</div>
                </div>
                <div style="background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%); color: white; padding: 16px; border-radius: 12px;">
                  <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">Ancoragem</div>
                  <div style="font-size: 14px; font-weight: 700; margin-top: 4px;"><s style="opacity: 0.7;">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</s></div>
                  <div style="font-size: 18px; font-weight: 700;">R$ ${produto.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">Âncora faz parecer oportunidade</div>
                </div>
              </div>
            </div>
            
            <div class="suggestion-box" style="margin-top: 16px;">
              <div class="suggestion-title">💡 Como implementar para "${produto.nome}"</div>
              <div class="suggestion-text">
                <strong>Passo 1:</strong> Escolha uma estratégia acima e crie uma oferta específica.<br>
                <strong>Passo 2:</strong> Teste com 10 clientes e meça a conversão.<br>
                <strong>Passo 3:</strong> Se a conversão cair menos de 20% com preço 40% maior, mantenha o novo preço.<br>
                <strong>ROI Potencial:</strong> Se vender o mesmo volume com +40% de preço, seu lucro pode dobrar.
              </div>
            </div>
            ` : ''}
          </div>
        `).join('')}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Precificação</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Calcular custo real de cada produto/serviço (inclua seu tempo)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Escolher uma estratégia de precificação por produto e testar por 30 dias</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Criar versão premium de pelo menos um produto/serviço</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Implementar ancoragem de preço na página de vendas</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Criar modelo de recorrência para pelo menos um serviço</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Motores de Crescimento -->
      ${data.motoresCrescimento.motoresPrincipais.length > 0 || data.motoresCrescimento.canais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🚀</div>
          <h2 class="section-title">Motores de Crescimento</h2>
          <p class="section-description">Os principais vetores de crescimento e canais de aquisição.</p>
        </div>
        
        ${data.motoresCrescimento.motoresPrincipais.length > 0 ? `
        <div class="card">
          <div class="card-title">⚡ Motores Principais</div>
          <div class="tags">
            ${data.motoresCrescimento.motoresPrincipais.map(m => `<span class="tag">${m}</span>`).join('')}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Ativando os Motores</div>
          <div class="suggestion-text">
            ${data.motoresCrescimento.motoresPrincipais.map(m => `
              <strong>${m}:</strong> Defina uma ação semanal específica para este motor. 
              Meça resultados e dobre o investimento no que funcionar.
            `).join('<br>')}
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.canais.length > 0 ? `
        <div class="card">
          <div class="card-title">📢 Canais de Aquisição</div>
          <div class="tags">
            ${data.motoresCrescimento.canais.map(c => `<span class="tag tag-accent">${c}</span>`).join('')}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Priorizando Canais</div>
          <div class="suggestion-text">
            Escolha MAX 3 canais para focar nos próximos 90 dias. Divida investimento: 70% no canal que já funciona, 
            20% no segundo melhor, 10% em experimentos. 
            ${data.motoresCrescimento.canais.length > 0 ? `Comece por: ${data.motoresCrescimento.canais[0]}` : ''}
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.metricas.length > 0 ? `
        <div class="card">
          <div class="card-title">📊 Métricas e Metas</div>
          <table class="table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              ${data.motoresCrescimento.metricas.map(m => `
                <tr>
                  <td><strong>${m.nome}</strong></td>
                  <td>${m.meta}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Acompanhando Métricas</div>
          <div class="suggestion-text">
            Crie dashboard com estas métricas e revise semanalmente. Defina "owners" para cada métrica.
            Se a métrica não melhorar em 4 semanas, mude a estratégia ou a métrica.
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Crescimento</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Criar dashboard de métricas (use Google Sheets ou similar)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Definir rituais semanais de acompanhamento (15 min, mesmo dia/hora)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Implementar programa de indicação estruturado com incentivos</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Testar 3 experimentos de aquisição por mês, documentar resultados</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Organograma -->
      ${data.organograma.cargos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">👥</div>
          <h2 class="section-title">Estrutura Organizacional</h2>
          <p class="section-description">Organograma, responsabilidades e indicadores de desempenho.</p>
        </div>
        
        <div class="org-chart">
          ${[1, 2, 3].map(nivel => {
            const cargosPorNivel = data.organograma.cargos.filter(c => c.nivel === nivel);
            if (cargosPorNivel.length === 0) return '';
            const nivelNome = nivel === 1 ? 'Estratégico' : nivel === 2 ? 'Tático' : 'Operacional';
            return `
              <div class="org-level org-level-${nivel}">
                <div class="org-level-header">
                  <div class="org-level-dot"></div>
                  <div class="org-level-title">Nível ${nivelNome}</div>
                </div>
                <div class="org-cards">
                  ${cargosPorNivel.map(cargo => `
                    <div class="org-card">
                      <div class="org-title">${cargo.titulo}</div>
                      ${cargo.subordinadoA ? `<div class="org-subordinate">Reporta a: ${cargo.subordinadoA}</div>` : ''}
                      ${cargo.responsabilidades.length > 0 ? `
                        <div class="org-section">
                          <div class="org-section-title">Responsabilidades</div>
                          <div class="org-responsibilities">${cargo.responsabilidades.join('; ')}</div>
                        </div>
                      ` : ''}
                      ${cargo.kpis.length > 0 ? `
                        <div class="org-section">
                          <div class="org-section-title">KPIs</div>
                          <div class="org-kpis">
                            ${cargo.kpis.map(kpi => `<span class="org-kpi">${kpi}</span>`).join('')}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Análise da Estrutura</div>
          <div class="insight-box-text">
            ${data.organograma.cargos.length < 3 
              ? 'A estrutura está enxuta. Considere se há sobrecarga em alguma função e se vale terceirizar atividades operacionais.'
              : data.organograma.cargos.length < 6
                ? 'A estrutura está em crescimento. Garanta que as linhas de reporte estejam claras e que não haja sobreposição de responsabilidades.'
                : 'A estrutura está robusta. Foque em desenvolver lideranças intermediárias e garantir comunicação fluida entre níveis.'}
            <br><br>
            ${data.organograma.cargos.filter(c => c.kpis.length === 0).length > 0 
              ? `<strong>Atenção:</strong> ${data.organograma.cargos.filter(c => c.kpis.length === 0).length} cargo(s) sem KPIs definidos. Defina métricas para todos os cargos.`
              : 'Todos os cargos possuem KPIs definidos. Excelente!'}
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Organização</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Validar descrições de cargo com cada colaborador</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Implementar 1:1s quinzenais entre líderes e liderados</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Criar matriz RACI para principais processos</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Definir metas individuais alinhadas aos KPIs de cada cargo</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Processos -->
      ${data.processos.processos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">⚙️</div>
          <h2 class="section-title">Processos Operacionais</h2>
          <p class="section-description">Principais processos mapeados e seus responsáveis.</p>
        </div>
        
        ${data.processos.processos.map(processo => `
          <div class="process-card">
            <div class="process-header">
              <div class="process-name">${processo.nome}</div>
              <div class="process-frequency">${processo.frequencia}</div>
            </div>
            ${processo.descricao ? `<div class="process-description">${processo.descricao}</div>` : ''}
            <div class="process-responsible">Responsável: ${processo.responsavel}</div>
          </div>
          <div class="suggestion-box" style="margin-bottom: 20px;">
            <div class="suggestion-title">💡 Otimização sugerida para "${processo.nome}"</div>
            <div class="suggestion-text">
              <strong>Documenta:</strong> Crie POP (Procedimento Operacional Padrão) com passo-a-passo.<br>
              <strong>Mensure:</strong> Defina métrica de sucesso (tempo, qualidade, custo).<br>
              <strong>Automatize:</strong> Identifique etapas repetitivas que podem ser automatizadas.<br>
              <strong>Treine:</strong> Garanta que pelo menos 2 pessoas saibam executar.
            </div>
          </div>
        `).join('')}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Processos</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Documentar todos os processos em POPs com fluxogramas</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Criar indicadores de desempenho para cada processo</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Identificar 3 processos prioritários para automação</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Treinar backups para todos os processos críticos</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Financeiro -->
      ${data.financeiro.faturamentoAtual > 0 || data.financeiro.metaFaturamento > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">📈</div>
          <h2 class="section-title">Análise Financeira</h2>
          <p class="section-description">Indicadores financeiros e oportunidades de otimização.</p>
        </div>
        
        <div class="data-grid">
          <div class="data-item">
            <div class="data-label">Faturamento Atual</div>
            <div class="data-value">${formatCurrency(data.financeiro.faturamentoAtual)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Meta de Faturamento</div>
            <div class="data-value" style="color: var(--accent);">${formatCurrency(data.financeiro.metaFaturamento)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Despesas Fixas</div>
            <div class="data-value">${formatCurrency(data.financeiro.despesasFixas)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Despesas Variáveis</div>
            <div class="data-value">${formatCurrency(data.financeiro.despesasVariaveis)}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Margem Atual</div>
            <div class="data-value">${data.financeiro.margemAtual}%</div>
          </div>
          <div class="data-item">
            <div class="data-label">Gap para Meta</div>
            <div class="data-value" style="color: var(--primary);">${formatCurrency(data.financeiro.metaFaturamento - data.financeiro.faturamentoAtual)}</div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Análise Financeira Detalhada</div>
          <div class="insight-box-text">
            ${data.financeiro.faturamentoAtual > 0 && data.financeiro.despesasFixas > 0 ? `
              <strong>Ponto de Equilíbrio:</strong> Com despesas fixas de ${formatCurrency(data.financeiro.despesasFixas)} e margem de ${data.financeiro.margemAtual}%, 
              seu ponto de equilíbrio é aproximadamente ${formatCurrency(data.financeiro.despesasFixas / (data.financeiro.margemAtual / 100))}.
              <br><br>
              <strong>Lucro Operacional:</strong> Com faturamento de ${formatCurrency(data.financeiro.faturamentoAtual)} e margem de ${data.financeiro.margemAtual}%,
              seu lucro bruto é aproximadamente ${formatCurrency(data.financeiro.faturamentoAtual * (data.financeiro.margemAtual / 100))}.
              <br><br>
            ` : ''}
            ${data.financeiro.metaFaturamento > data.financeiro.faturamentoAtual ? `
              <strong>Para atingir a meta:</strong> Você precisa aumentar o faturamento em ${Math.round(((data.financeiro.metaFaturamento - data.financeiro.faturamentoAtual) / data.financeiro.faturamentoAtual) * 100)}%.
              Isso pode ser feito através de: aumento de preços, mais clientes ou aumento de ticket médio.
            ` : ''}
          </div>
        </div>
        
        ${data.financeiro.oportunidades.length > 0 ? `
        <div class="card" style="margin-top: 20px;">
          <div class="card-title">🎯 Oportunidades Identificadas</div>
          <ul class="list">
            ${data.financeiro.oportunidades.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Priorizando Oportunidades</div>
          <div class="suggestion-text">
            ${data.financeiro.oportunidades.map((o, i) => `
              <strong>${i + 1}. ${o}:</strong> Estime o impacto financeiro. Priorize as de maior retorno com menor esforço.
            `).join('<br>')}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Financeiro</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Implementar DRE mensal até o dia 5 de cada mês</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Revisar todos os custos fixos e eliminar/renegociar 3 itens</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Definir estratégia para aumentar ticket médio em 15%</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Criar reserva de emergência de 3 meses de despesas fixas</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Implementar as ${data.financeiro.oportunidades.length || 'X'} oportunidades identificadas</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- SWOT Empresarial -->
      ${data.swot.forcas.length > 0 || data.swot.fraquezas.length > 0 || data.swot.oportunidades.length > 0 || data.swot.ameacas.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🧭</div>
          <h2 class="section-title">Análise SWOT Empresarial</h2>
          <p class="section-description">Forças, Fraquezas, Oportunidades e Ameaças do negócio.</p>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-title">💪 Forças</div>
            <div class="swot-list">
              ${data.swot.forcas.length > 0 ? data.swot.forcas.map(f => `<div>• ${f}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-title">⚠️ Fraquezas</div>
            <div class="swot-list">
              ${data.swot.fraquezas.length > 0 ? data.swot.fraquezas.map(f => `<div>• ${f}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-title">🌟 Oportunidades</div>
            <div class="swot-list">
              ${data.swot.oportunidades.length > 0 ? data.swot.oportunidades.map(o => `<div>• ${o}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-title">🔥 Ameaças</div>
            <div class="swot-list">
              ${data.swot.ameacas.length > 0 ? data.swot.ameacas.map(a => `<div>• ${a}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Estratégias Cruzadas da SWOT</div>
          <div class="insight-box-text">
            ${data.swot.forcas.length > 0 && data.swot.oportunidades.length > 0 ? `
              <strong>Forças + Oportunidades (Avanço):</strong> Use "${data.swot.forcas[0]}" para capturar "${data.swot.oportunidades[0]}". 
              Esta é sua maior alavanca de crescimento.
              <br><br>
            ` : ''}
            ${data.swot.fraquezas.length > 0 && data.swot.ameacas.length > 0 ? `
              <strong>Fraquezas + Ameaças (Proteção):</strong> A fraqueza "${data.swot.fraquezas[0]}" combinada com a ameaça "${data.swot.ameacas[0]}" 
              representa seu maior risco. Priorize resolver esta vulnerabilidade.
              <br><br>
            ` : ''}
            ${data.swot.forcas.length > 0 && data.swot.ameacas.length > 0 ? `
              <strong>Forças + Ameaças (Defesa):</strong> Use "${data.swot.forcas[0]}" para se proteger de "${data.swot.ameacas[0]}".
            ` : ''}
          </div>
        </div>
        
        ${data.swot.horizontes.curto || data.swot.horizontes.medio || data.swot.horizontes.longo ? `
        <div class="card" style="margin-top: 30px;">
          <div class="card-title">📅 Horizontes Estratégicos</div>
          <div class="timeline">
            ${data.swot.horizontes.curto ? `
            <div class="timeline-item">
              <div class="timeline-label">Curto Prazo (0-6 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.curto}</div>
            </div>
            ` : ''}
            
            ${data.swot.horizontes.medio ? `
            <div class="timeline-item">
              <div class="timeline-label">Médio Prazo (6-18 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.medio}</div>
            </div>
            ` : ''}
            
            ${data.swot.horizontes.longo ? `
            <div class="timeline-item">
              <div class="timeline-label">Longo Prazo (18+ meses)</div>
              <div class="timeline-content">${data.swot.horizontes.longo}</div>
            </div>
            ` : ''}
          </div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Implementando os Horizontes</div>
          <div class="suggestion-text">
            ${data.swot.horizontes.curto ? `<strong>Curto prazo:</strong> Quebre "${data.swot.horizontes.curto}" em 12 ações semanais. Execute sem perder foco.<br>` : ''}
            ${data.swot.horizontes.medio ? `<strong>Médio prazo:</strong> Crie marcos trimestrais para "${data.swot.horizontes.medio}". Revise a cada 90 dias.<br>` : ''}
            ${data.swot.horizontes.longo ? `<strong>Longo prazo:</strong> Mantenha "${data.swot.horizontes.longo}" visível, mas não se prenda. Reavalie anualmente.` : ''}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - SWOT</div>
          <ul class="action-plan-list">
            ${data.swot.forcas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Potencializar força: "${data.swot.forcas[0]}" - criar ação específica para amplificar</span>
            </li>
            ` : ''}
            ${data.swot.fraquezas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Mitigar fraqueza: "${data.swot.fraquezas[0]}" - definir plano de desenvolvimento ou terceirização</span>
            </li>
            ` : ''}
            ${data.swot.oportunidades.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Capturar oportunidade: "${data.swot.oportunidades[0]}" - criar projeto específico com prazo</span>
            </li>
            ` : ''}
            ${data.swot.ameacas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Monitorar ameaça: "${data.swot.ameacas[0]}" - criar indicadores de alerta antecipado</span>
            </li>
            ` : ''}
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Revisar SWOT trimestralmente e ajustar estratégias conforme necessário</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- SWOT Pessoal -->
      ${data.swotPessoal.forcas.length > 0 || data.swotPessoal.fraquezas.length > 0 || data.swotPessoal.oportunidades.length > 0 || data.swotPessoal.ameacas.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🧠</div>
          <h2 class="section-title">SWOT Pessoal do Líder</h2>
          <p class="section-description">Autoconhecimento como base para liderança efetiva.</p>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-title">💪 Minhas Forças</div>
            <div class="swot-list">
              ${data.swotPessoal.forcas.length > 0 ? data.swotPessoal.forcas.map(f => `<div>• ${f}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-title">⚠️ Áreas de Desenvolvimento</div>
            <div class="swot-list">
              ${data.swotPessoal.fraquezas.length > 0 ? data.swotPessoal.fraquezas.map(f => `<div>• ${f}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-title">🌟 Oportunidades de Crescimento</div>
            <div class="swot-list">
              ${data.swotPessoal.oportunidades.length > 0 ? data.swotPessoal.oportunidades.map(o => `<div>• ${o}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-title">🔥 Riscos Pessoais</div>
            <div class="swot-list">
              ${data.swotPessoal.ameacas.length > 0 ? data.swotPessoal.ameacas.map(a => `<div>• ${a}</div>`).join('') : '<em style="color: #999;">Não preenchido</em>'}
            </div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 24px;">
          <div class="insight-box-title">💡 Desenvolvendo a Liderança</div>
          <div class="insight-box-text">
            ${data.swotPessoal.forcas.length > 0 ? `
              <strong>Potencialize:</strong> Sua força "${data.swotPessoal.forcas[0]}" é um diferencial. 
              Delegue atividades que não usem esta força para focar onde você é excepcional.
              <br><br>
            ` : ''}
            ${data.swotPessoal.fraquezas.length > 0 ? `
              <strong>Desenvolva ou delegue:</strong> A área de "${data.swotPessoal.fraquezas[0]}" pode ser desenvolvida com treinamento 
              ou delegada para alguém com esta competência. Não tente fazer tudo sozinho.
              <br><br>
            ` : ''}
            ${data.swotPessoal.ameacas.length > 0 ? `
              <strong>Proteja-se:</strong> O risco "${data.swotPessoal.ameacas[0]}" pode afetar sua performance como líder.
              Crie mecanismos de proteção e autocuidado.
            ` : ''}
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Desenvolvimento Pessoal</div>
          <ul class="action-plan-list">
            ${data.swotPessoal.forcas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Usar força "${data.swotPessoal.forcas[0]}" em pelo menos 60% do tempo de trabalho</span>
            </li>
            ` : ''}
            ${data.swotPessoal.fraquezas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Buscar curso/mentoria para desenvolver: "${data.swotPessoal.fraquezas[0]}"</span>
            </li>
            ` : ''}
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Agendar check-in semanal de autocuidado (saúde física e mental)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Buscar feedback trimestral de 3 pessoas-chave (equipe, par, mentor)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Definir 1 hábito de desenvolvimento pessoal para praticar diariamente</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Agenda do CEO -->
      ${data.agendaCEO.prioridades.length > 0 || data.agendaCEO.focoTrimestre ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">📅</div>
          <h2 class="section-title">Agenda Estratégica do CEO</h2>
          <p class="section-description">Prioridades, foco e alocação de tempo do líder.</p>
        </div>
        
        ${data.agendaCEO.focoTrimestre ? `
        <div class="card" style="background: linear-gradient(135deg, var(--primary-light) 0%, #E0E7FF 100%); border: 2px solid var(--primary);">
          <div class="card-title" style="color: var(--primary);">🎯 Foco Principal do Trimestre</div>
          <div class="card-content" style="font-size: 16px; font-weight: 500;">${data.agendaCEO.focoTrimestre}</div>
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Protegendo o Foco</div>
          <div class="suggestion-text">
            <strong>"${data.agendaCEO.focoTrimestre}"</strong> deve ser o critério para todas as decisões.
            Quando surgir uma nova oportunidade, pergunte: "Isso me aproxima de ${data.agendaCEO.focoTrimestre}?".
            Se não, delegue ou decline. Foco é dizer não para o bom para dizer sim para o ótimo.
          </div>
        </div>
        ` : ''}
        
        ${data.agendaCEO.prioridades.length > 0 ? `
        <div class="card">
          <div class="card-title">📋 Prioridades Estratégicas</div>
          <table class="table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th style="width: 120px;">Importância</th>
              </tr>
            </thead>
            <tbody>
              ${data.agendaCEO.prioridades.map(p => `
                <tr>
                  <td>${p.descricao}</td>
                  <td><span class="priority priority-${p.importancia}">${p.importancia.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="insight-box">
          <div class="insight-box-title">💡 Executando Prioridades</div>
          <div class="insight-box-text">
            ${data.agendaCEO.prioridades.filter(p => p.importancia === 'alta').length > 0 ? `
              <strong>Prioridades ALTAS:</strong> ${data.agendaCEO.prioridades.filter(p => p.importancia === 'alta').map(p => `"${p.descricao}"`).join(', ')}
              - Estas devem ocupar as primeiras horas do dia, quando sua energia está máxima. Não delegue.
              <br><br>
            ` : ''}
            ${data.agendaCEO.prioridades.filter(p => p.importancia === 'media').length > 0 ? `
              <strong>Prioridades MÉDIAS:</strong> ${data.agendaCEO.prioridades.filter(p => p.importancia === 'media').map(p => `"${p.descricao}"`).join(', ')}
              - Agende horários específicos na semana. Considere delegar partes da execução.
              <br><br>
            ` : ''}
            ${data.agendaCEO.prioridades.filter(p => p.importancia === 'baixa').length > 0 ? `
              <strong>Prioridades BAIXAS:</strong> ${data.agendaCEO.prioridades.filter(p => p.importancia === 'baixa').map(p => `"${p.descricao}"`).join(', ')}
              - Questione: isso realmente precisa do seu tempo? Delegue ou elimine se possível.
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        ${data.agendaCEO.alocacaoTempo.length > 0 ? `
        <div class="card">
          <div class="card-title">⏰ Alocação de Tempo</div>
          ${data.agendaCEO.alocacaoTempo.map(a => `
            <div style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 500;">${a.atividade}</span>
                <span style="font-weight: 700; color: var(--primary);">${a.percentual}%</span>
              </div>
              <div style="height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${a.percentual}%; background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%); border-radius: 4px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="suggestion-box">
          <div class="suggestion-title">💡 Otimizando Tempo</div>
          <div class="suggestion-text">
            ${data.agendaCEO.alocacaoTempo.sort((a, b) => b.percentual - a.percentual).slice(0, 2).map(a => `
              <strong>${a.atividade} (${a.percentual}%):</strong> Esta é sua principal alocação. 
              Pergunte: "Sou a única pessoa que pode fazer isso?" Se não, delegue 20% desta atividade.
            `).join('<br><br>')}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-title">📋 Plano de Ação - Agenda do CEO</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text">Bloquear 2h/dia na agenda para o foco do trimestre (sem reuniões)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text">Criar ritual de revisão semanal (sexta-feira, 30 min)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text">Eliminar ou delegar 3 atividades que não agregam valor estratégico</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text">Criar lista de "não fazer" tão importante quanto lista de tarefas</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text">Agendar 1h/semana para pensamento estratégico (sem operacional)</span>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Resumo Executivo Final -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">📋</div>
          <h2 class="section-title">Resumo Executivo - Próximos Passos</h2>
          <p class="section-description">Síntese das principais ações a serem executadas.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">📊 Visão Geral do Diagnóstico</div>
          <div class="info-box-text">
            <strong>Maturidade média:</strong> ${avgMaturity}/5<br>
            <strong>Progresso do plano:</strong> ${overallProgress}%<br>
            <strong>Faturamento atual:</strong> ${formatCurrency(data.financeiro.faturamentoAtual)}<br>
            <strong>Meta de faturamento:</strong> ${formatCurrency(data.financeiro.metaFaturamento)}<br>
            ${data.agendaCEO.focoTrimestre ? `<strong>Foco do trimestre:</strong> ${data.agendaCEO.focoTrimestre}` : ''}
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-title">🚀 Top 10 Ações Prioritárias</div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <span class="action-plan-text"><strong>SEMANA 1:</strong> Comunicar visão, missão e valores para toda equipe</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <span class="action-plan-text"><strong>SEMANA 1:</strong> Implementar controle financeiro básico (DRE mensal)</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <span class="action-plan-text"><strong>SEMANA 2:</strong> Documentar 3 processos críticos do negócio</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <span class="action-plan-text"><strong>SEMANA 2:</strong> Validar ICP com 5 clientes atuais</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">5</span>
              <span class="action-plan-text"><strong>SEMANA 3:</strong> Testar nova precificação em 1 produto/serviço</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">6</span>
              <span class="action-plan-text"><strong>SEMANA 3:</strong> Criar dashboard de métricas principais</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">7</span>
              <span class="action-plan-text"><strong>SEMANA 4:</strong> Implementar ritual de 1:1 com liderados diretos</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">8</span>
              <span class="action-plan-text"><strong>MÊS 2:</strong> Lançar 1 nova oferta/pacote validado</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">9</span>
              <span class="action-plan-text"><strong>MÊS 2:</strong> Estabelecer presença ativa no principal canal do ICP</span>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">10</span>
              <span class="action-plan-text"><strong>MÊS 3:</strong> Revisar SWOT e ajustar estratégias baseado nos resultados</span>
            </li>
          </ul>
        </div>
        
        <div class="suggestion-box" style="margin-top: 24px;">
          <div class="suggestion-title">🎯 Recomendação Final</div>
          <div class="suggestion-text">
            O sucesso deste plano depende de execução consistente. Recomendamos:
            <br><br>
            <strong>1. Foco brutal:</strong> Não tente fazer tudo de uma vez. Execute uma ação por vez com excelência.
            <br>
            <strong>2. Rituais de acompanhamento:</strong> Revise o progresso semanalmente (15 min) e mensalmente (1h).
            <br>
            <strong>3. Responsabilização:</strong> Cada ação deve ter um dono e um prazo. Sem dono = não será feito.
            <br>
            <strong>4. Celebre vitórias:</strong> Reconheça progressos, mesmo pequenos. Isso mantém o momentum.
            <br>
            <strong>5. Ajuste o plano:</strong> Este é um documento vivo. Ajuste conforme aprende com a execução.
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">📊</div>
      <p style="font-weight: 600; margin-bottom: 4px;">Ferramenta de Estruturação em Gestão</p>
      <p class="footer-text">Documento gerado em ${formatDate(new Date().toISOString())}</p>
      <p class="footer-text" style="margin-top: 16px; font-style: italic;">Este documento é confidencial e destinado exclusivamente ao uso interno da empresa.</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

export function openReportInNewTab(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const html = generateReport(project, data, blocks);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
