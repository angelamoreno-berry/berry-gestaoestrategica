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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #18181B;
      --primary-light: #3F3F46;
      --primary-lighter: #F4F4F5;
      --accent: #0D9488;
      --accent-light: #CCFBF1;
      --gold: #A16207;
      --gold-light: #FEF9C3;
      --background: #FFFFFF;
      --card: #FFFFFF;
      --foreground: #18181B;
      --muted: #71717A;
      --border: #E4E4E7;
      --destructive: #DC2626;
      --warning: #D97706;
      --success: #059669;
      --shadow-soft: 0 1px 3px rgba(0,0,0,0.04);
      --shadow-medium: 0 4px 16px rgba(0,0,0,0.06);
      --shadow-strong: 0 8px 32px rgba(0,0,0,0.08);
      /* Gradientes simplificados para compatibilidade */
      --gradient-primary: #18181B;
      --gradient-accent: #0D9488;
      --gradient-gold: #A16207;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      line-height: 1.9; 
      color: var(--foreground); 
      background: #F8F8F8;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
      letter-spacing: -0.01em;
    }
    
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
      background: var(--card);
      box-shadow: var(--shadow-strong);
    }
    
    /* ===== COVER PAGE ===== */
    .cover-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 100px 80px;
      background: linear-gradient(180deg, #18181B 0%, #27272A 100%);
      color: white;
      page-break-after: always;
      position: relative;
    }
    
    .cover-badge {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      padding: 12px 28px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 48px;
      color: rgba(255,255,255,0.9);
    }
    
    .cover-title {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 20px;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }
    
    .cover-subtitle {
      font-size: 18px;
      opacity: 0.7;
      margin-bottom: 72px;
      font-weight: 400;
      letter-spacing: 0.02em;
    }
    
    .cover-divider {
      width: 80px;
      height: 1px;
      background: rgba(255,255,255,0.3);
      margin-bottom: 72px;
    }
    
    .cover-company {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    
    .cover-segment {
      font-size: 15px;
      opacity: 0.6;
      margin-bottom: 64px;
      font-weight: 400;
    }
    
    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 64px;
      width: 100%;
      max-width: 480px;
    }
    
    .cover-meta-item {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 24px 28px;
      border-radius: 12px;
      text-align: left;
    }
    
    .cover-meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.5;
      margin-bottom: 8px;
    }
    
    .cover-meta-value {
      font-size: 16px;
      font-weight: 500;
    }
    
    .cover-progress-ring {
      text-align: center;
    }
    
    .cover-progress-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(var(--accent) ${overallProgress * 3.6}deg, rgba(255,255,255,0.1) 0deg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    
    .cover-progress-inner {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: #18181B;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .cover-progress-value {
      font-size: 32px;
      font-weight: 700;
    }
    
    .cover-progress-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.6;
    }
    
    /* ===== TABLE OF CONTENTS ===== */
    .toc {
      page-break-after: always;
      padding: 100px 80px;
      background: white;
    }
    
    .toc-header {
      margin-bottom: 64px;
    }
    
    .toc-badge {
      display: inline-block;
      background: var(--primary-lighter);
      color: var(--primary);
      padding: 10px 20px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 24px;
    }
    
    .toc-title {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: var(--foreground);
      margin-bottom: 16px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    
    .toc-description {
      color: var(--muted);
      font-size: 16px;
      max-width: 480px;
      line-height: 1.8;
    }
    
    .toc-grid {
      display: grid;
      gap: 8px;
    }
    
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    
    .toc-item:hover {
      border-color: var(--muted);
      background: var(--primary-lighter);
    }
    
    .toc-item-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .toc-item-number {
      width: 36px;
      height: 36px;
      background: var(--foreground);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 13px;
    }
    
    .toc-item-icon {
      font-size: 22px;
    }
    
    .toc-item-name {
      font-weight: 500;
      font-size: 15px;
      color: var(--foreground);
    }
    
    .toc-item-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .toc-item-progress {
      width: 80px;
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .toc-item-progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
    }
    
    .toc-item-percent {
      font-weight: 600;
      font-size: 13px;
      color: var(--muted);
      min-width: 36px;
      text-align: right;
    }
    
    /* ===== CONTENT PAGES ===== */
    .content {
      padding: 80px;
    }
    
    /* ===== SECTION STYLING ===== */
    .section {
      margin-bottom: 80px;
      page-break-inside: avoid;
    }
    
    .section-header {
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--border);
    }
    
    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--primary-lighter);
      color: var(--primary);
      padding: 10px 18px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    
    .section-icon {
      font-size: 16px;
    }
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      color: var(--foreground);
      margin-bottom: 16px;
      line-height: 1.25;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    
    .section-description {
      font-size: 16px;
      color: var(--muted);
      line-height: 1.8;
      max-width: 600px;
    }
    
    /* ===== INFO BOXES ===== */
    .info-box {
      background: var(--primary-lighter);
      border-left: 3px solid var(--foreground);
      padding: 32px 36px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 40px;
    }
    
    .info-box-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    
    .info-box-icon {
      width: 40px;
      height: 40px;
      background: var(--foreground);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    
    .info-box-title {
      font-weight: 600;
      color: var(--foreground);
      font-size: 16px;
    }
    
    .info-box-text {
      color: var(--foreground);
      font-size: 15px;
      line-height: 1.9;
    }
    
    /* ===== INSIGHT BOX ===== */
    .insight-box {
      background: #FEFCE8;
      border-left: 3px solid var(--gold);
      padding: 32px 36px;
      border-radius: 0 12px 12px 0;
      margin: 40px 0;
    }
    
    .insight-box-title {
      font-weight: 600;
      color: var(--gold);
      margin-bottom: 14px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .insight-box-text {
      color: #713F12;
      font-size: 15px;
      line-height: 1.9;
    }
    
    /* ===== VISUAL EXAMPLE BOX ===== */
    .visual-example {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 36px;
      margin: 40px 0;
    }
    
    .visual-example-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    
    .visual-example-icon {
      width: 44px;
      height: 44px;
      background: var(--foreground);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .visual-example-title {
      font-weight: 600;
      color: var(--foreground);
      font-size: 16px;
    }
    
    .visual-example-subtitle {
      font-size: 13px;
      color: var(--muted);
      font-weight: 400;
    }
    
    .visual-example-content {
      background: white;
      border-radius: 10px;
      padding: 28px;
      border: 1px solid var(--border);
    }
    
    /* ===== ACTION PLAN ===== */
    .action-plan {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 12px;
      padding: 40px;
      margin: 48px 0;
    }
    
    .action-plan-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    
    .action-plan-title {
      font-weight: 600;
      color: #166534;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .action-plan-badge {
      background: #166534;
      color: white;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .action-plan-list {
      list-style: none;
      display: grid;
      gap: 16px;
    }
    
    .action-plan-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 24px;
      background: white;
      border-radius: 10px;
      border: 1px solid #D1FAE5;
    }
    
    .action-plan-number {
      width: 32px;
      height: 32px;
      background: #166534;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      flex-shrink: 0;
    }
    
    .action-plan-content {
      flex: 1;
    }
    
    .action-plan-text {
      color: #166534;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 10px;
    }
    
    .action-plan-detail {
      color: #15803D;
      font-size: 14px;
      line-height: 1.8;
      padding-left: 16px;
      border-left: 2px solid #BBF7D0;
    }
    
    .action-plan-meta {
      display: flex;
      gap: 16px;
      margin-top: 12px;
    }
    
    .action-plan-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #15803D;
      font-weight: 500;
    }
    
    /* ===== SUGGESTION BOX ===== */
    .suggestion-box {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      margin: 32px 0;
    }
    
    .suggestion-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    
    .suggestion-icon {
      width: 40px;
      height: 40px;
      background: var(--primary-lighter);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .suggestion-title {
      font-weight: 700;
      color: var(--primary);
      font-size: 15px;
    }
    
    .suggestion-text {
      color: var(--foreground);
      font-size: 14px;
      line-height: 1.8;
    }
    
    /* ===== IMPLEMENTATION GUIDE ===== */
    .implementation-guide {
      background: #FAF5FF;
      border: 1px solid #E9D5FF;
      border-radius: 12px;
      padding: 36px;
      margin: 40px 0;
    }
    
    .implementation-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    
    .implementation-icon {
      width: 44px;
      height: 44px;
      background: #7C3AED;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .implementation-title {
      font-weight: 600;
      color: #5B21B6;
      font-size: 16px;
    }
    
    .implementation-steps {
      display: grid;
      gap: 16px;
    }
    
    .implementation-step {
      display: flex;
      gap: 20px;
      background: white;
      padding: 24px;
      border-radius: 10px;
      border: 1px solid #E9D5FF;
    }
    
    .implementation-step-number {
      width: 32px;
      height: 32px;
      background: #7C3AED;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      flex-shrink: 0;
    }
    
    .implementation-step-content h4 {
      font-weight: 600;
      color: #5B21B6;
      font-size: 15px;
      margin-bottom: 6px;
    }
    
    .implementation-step-content p {
      color: #6D28D9;
      font-size: 14px;
      line-height: 1.8;
    }
    
    /* ===== CARDS ===== */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .card-icon {
      width: 44px;
      height: 44px;
      background: var(--primary-lighter);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .card-title {
      font-weight: 600;
      font-size: 17px;
      color: var(--foreground);
    }
    
    .card-content {
      color: var(--foreground);
      line-height: 1.9;
      font-size: 15px;
    }
    
    /* ===== DATA GRID ===== */
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .data-item {
      background: #FAFAFA;
      padding: 28px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    
    .data-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    .data-value {
      font-weight: 600;
      font-size: 20px;
      color: var(--foreground);
    }
    
    /* ===== TAGS ===== */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
    }
    
    .tag {
      background: var(--primary-lighter);
      color: var(--foreground);
      padding: 10px 20px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .tag-accent {
      background: #CCFBF1;
      color: #0F766E;
    }
    
    .tag-gold {
      background: #FEF9C3;
      color: #A16207;
    }
    
    /* ===== LISTS ===== */
    .list {
      list-style: none;
    }
    
    .list-item {
      padding: 20px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    
    .list-item:last-child {
      border-bottom: none;
    }
    
    .list-bullet {
      width: 8px;
      height: 8px;
      background: var(--foreground);
      border-radius: 50%;
      margin-top: 8px;
      flex-shrink: 0;
    }
    
    /* ===== SWOT GRID ===== */
    .swot-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .swot-box {
      padding: 32px;
      border-radius: 12px;
    }
    
    .swot-forcas { 
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
    }
    
    .swot-fraquezas { 
      background: #FEF2F2;
      border: 1px solid #FECACA;
    }
    
    .swot-oportunidades { 
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
    }
    
    .swot-ameacas { 
      background: #FFFBEB;
      border: 1px solid #FDE68A;
    }
    
    .swot-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }
    
    .swot-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    
    .swot-forcas .swot-icon { background: #166534; color: white; }
    .swot-fraquezas .swot-icon { background: #DC2626; color: white; }
    .swot-oportunidades .swot-icon { background: #2563EB; color: white; }
    .swot-ameacas .swot-icon { background: #D97706; color: white; }
    
    .swot-title {
      font-weight: 600;
      font-size: 16px;
    }
    
    .swot-forcas .swot-title { color: #166534; }
    .swot-fraquezas .swot-title { color: #991B1B; }
    .swot-oportunidades .swot-title { color: #1E40AF; }
    .swot-ameacas .swot-title { color: #92400E; }
    
    .swot-list {
      font-size: 14px;
      line-height: 2.2;
    }
    
    .swot-forcas .swot-list { color: #15803D; }
    .swot-fraquezas .swot-list { color: #B91C1C; }
    .swot-oportunidades .swot-list { color: #2563EB; }
    .swot-ameacas .swot-list { color: #B45309; }
    
    /* ===== MATURITY LEVELS ===== */
    .maturity-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .maturity-item {
      background: white;
      padding: 32px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    
    .maturity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .maturity-area {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 15px;
      color: var(--foreground);
    }
    
    .maturity-area-icon {
      font-size: 24px;
    }
    
    .maturity-level {
      color: var(--foreground);
      font-weight: 700;
      font-size: 28px;
    }
    
    .maturity-bar {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    
    .maturity-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 4px;
    }
    
    .maturity-notes {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.8;
    }
    
    /* ===== TABLES ===== */
    .table-container {
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid var(--border);
      margin: 32px 0;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .table th {
      background: var(--foreground);
      color: white;
      padding: 18px 24px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .table td {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      font-size: 15px;
      color: var(--foreground);
    }
    
    .table tr:last-child td { border-bottom: none; }
    .table tr:nth-child(even) { background: #FAFAFA; }
    
    /* ===== PRIORITY BADGES ===== */
    .priority {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 100px;
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
    
    /* ===== GOLDEN CIRCLE ===== */
    .golden-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      padding: 24px 0;
    }
    
    .golden-ring {
      width: 100%;
      padding: 36px 48px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: -8px;
      position: relative;
    }
    
    .golden-why {
      background: #FEF9C3;
      border: 1px solid #FDE047;
      z-index: 3;
    }
    
    .golden-how {
      background: #DBEAFE;
      border: 1px solid #93C5FD;
      z-index: 2;
    }
    
    .golden-what {
      background: #E0E7FF;
      border: 1px solid #A5B4FC;
      z-index: 1;
    }
    
    .golden-label {
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 14px;
    }
    
    .golden-why .golden-label { color: #A16207; }
    .golden-how .golden-label { color: #1E40AF; }
    .golden-what .golden-label { color: #4338CA; }
    
    .golden-content {
      font-size: 16px;
      line-height: 1.8;
      font-weight: 500;
    }
    
    .golden-why .golden-content { color: #713F12; }
    .golden-how .golden-content { color: #1E3A8A; }
    .golden-what .golden-content { color: #3730A3; }
    
    /* ===== PACKAGES ===== */
    .package-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }
    
    .package-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 36px;
      text-align: center;
    }
    
    .package-name {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 10px;
      color: var(--foreground);
    }
    
    .package-price {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--foreground);
    }
    
    .package-description {
      font-size: 15px;
      color: var(--muted);
      line-height: 1.8;
    }
    
    /* ===== ORGANOGRAM ===== */
    .org-chart {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    
    .org-level {
      margin-bottom: 0;
    }
    
    .org-level-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    
    .org-level-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .org-level-1 .org-level-dot { background: var(--gold); }
    .org-level-2 .org-level-dot { background: var(--foreground); }
    .org-level-3 .org-level-dot { background: var(--accent); }
    
    .org-level-title {
      font-weight: 600;
      font-size: 13px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .org-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .org-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      border-left: 3px solid var(--border);
    }
    
    .org-card:hover {
      box-shadow: var(--shadow-soft);
    }
    
    .org-level-1 .org-card { border-left-color: var(--gold); }
    .org-level-2 .org-card { border-left-color: var(--foreground); }
    .org-level-3 .org-card { border-left-color: var(--accent); }
    
    .org-title {
      font-weight: 600;
      font-size: 17px;
      color: var(--foreground);
      margin-bottom: 6px;
    }
    
    .org-subordinate {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 20px;
    }
    
    .org-section {
      margin-bottom: 20px;
    }
    
    .org-section-title {
      font-size: 10px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }
    
    .org-responsibilities {
      font-size: 14px;
      line-height: 1.9;
      color: var(--foreground);
    }
    
    .org-kpis {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .org-kpi {
      background: var(--accent-light);
      color: #0F766E;
      padding: 8px 14px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
    }
    
    /* ===== PROCESS CARD ===== */
    .process-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 20px;
    }
    
    .process-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .process-name {
      font-weight: 600;
      font-size: 16px;
      color: var(--foreground);
    }
    
    .process-frequency {
      background: var(--primary-lighter);
      color: var(--foreground);
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .process-description {
      font-size: 15px;
      color: var(--muted);
      margin-bottom: 16px;
      line-height: 1.8;
    }
    
    .process-responsible {
      font-size: 13px;
      color: var(--foreground);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* ===== PRICING SUGGESTIONS ===== */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 32px;
    }
    
    .pricing-suggestion {
      padding: 24px;
      border-radius: 12px;
      color: white;
      text-align: center;
    }
    
    .pricing-suggestion-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.85;
      margin-bottom: 8px;
    }
    
    .pricing-suggestion-value {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .pricing-suggestion-hint {
      font-size: 11px;
      opacity: 0.75;
    }
    
    .pricing-1 { background: #059669; }
    .pricing-2 { background: #2563EB; }
    .pricing-3 { background: #D97706; }
    .pricing-4 { background: #7C3AED; }
    .pricing-5 { background: #DC2626; }
    .pricing-6 { background: #0891B2; }
    
    /* ===== METRIC VISUALIZATION ===== */
    .metric-visual {
      background: white;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 24px;
      margin: 12px 0;
    }
    
    .metric-visual-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .metric-visual-name {
      font-weight: 500;
      font-size: 15px;
      color: var(--foreground);
    }
    
    .metric-visual-target {
      font-weight: 600;
      font-size: 16px;
      color: var(--foreground);
    }
    
    .metric-visual-bar {
      height: 6px;
      background: var(--border);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .metric-visual-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 3px;
    }
    
    /* ===== FOOTER ===== */
    .footer {
      text-align: center;
      padding: 80px;
      background: var(--foreground);
      color: white;
    }
    
    .footer-logo {
      font-size: 40px;
      margin-bottom: 20px;
    }
    
    .footer-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .footer-text {
      opacity: 0.7;
      font-size: 15px;
      margin-bottom: 24px;
    }
    
    .footer-date {
      font-size: 13px;
      opacity: 0.5;
    }
    
    /* ===== PAGE BREAK ===== */
    .page-break {
      page-break-before: always;
    }
    
    /* ===== PRINT STYLES ===== */
    @media print {
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .container { box-shadow: none; }
      .section { page-break-inside: avoid; }
      .cover-page { min-height: 100vh; }
    }
    
    /* ===== COMPETITOR ANALYSIS VISUAL ===== */
    .competitor-visual {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 24px 0;
    }
    
    .competitor-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }
    
    .competitor-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--foreground);
      margin-bottom: 10px;
    }
    
    .competitor-type {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* ===== TIMELINE ===== */
    .timeline {
      position: relative;
      padding-left: 44px;
      margin: 32px 0;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border);
    }
    
    .timeline-item {
      position: relative;
      padding-bottom: 32px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -38px;
      top: 4px;
      width: 14px;
      height: 14px;
      background: var(--foreground);
      border-radius: 50%;
      border: 3px solid white;
    }
    
    .timeline-label {
      font-weight: 600;
      font-size: 14px;
      color: var(--foreground);
      margin-bottom: 10px;
    }
    
    .timeline-content {
      font-size: 15px;
      color: var(--muted);
      line-height: 1.8;
    }
    
    /* ===== MASTER CHECKLIST ===== */
    .master-checklist {
      margin-top: 48px;
    }
    
    .checklist-category {
      margin-bottom: 40px;
    }
    
    .checklist-category-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 24px;
      background: var(--foreground);
      color: white;
      border-radius: 10px 10px 0 0;
      font-weight: 600;
      font-size: 15px;
    }
    
    .checklist-category-icon {
      font-size: 18px;
    }
    
    .checklist-items {
      background: white;
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 10px 10px;
    }
    
    .checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }
    
    .checklist-item:last-child {
      border-bottom: none;
    }
    
    .checklist-item:hover {
      background: #FAFAFA;
    }
    
    .checklist-checkbox {
      width: 22px;
      height: 22px;
      border: 2px solid var(--border);
      border-radius: 6px;
      flex-shrink: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      margin-top: 2px;
    }
    
    .checklist-checkbox:hover {
      border-color: var(--primary);
    }
    
    .checklist-checkbox.checked {
      background: var(--accent);
      border-color: var(--accent);
    }
    
    .checklist-checkbox.checked::after {
      content: '✓';
      color: white;
      font-weight: 700;
      font-size: 14px;
    }
    
    .checklist-content {
      flex: 1;
    }
    
    .checklist-text {
      font-size: 14px;
      color: var(--foreground);
      font-weight: 500;
      line-height: 1.5;
    }
    
    .checklist-item.checked .checklist-text {
      text-decoration: line-through;
      color: var(--muted);
    }
    
    .checklist-detail {
      font-size: 12px;
      color: var(--muted);
      margin-top: 4px;
      line-height: 1.5;
    }
    
    .checklist-meta {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
    
    .checklist-tag {
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 100px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .checklist-tag-priority {
      background: #FEE2E2;
      color: #DC2626;
    }
    
    .checklist-tag-category {
      background: var(--primary-lighter);
      color: var(--primary);
    }
    
    /* ===== EDITABLE TOOLBAR ===== */
    .edit-toolbar {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 16px;
      padding: 12px 16px;
      box-shadow: var(--shadow-strong);
      display: flex;
      gap: 8px;
      align-items: center;
      z-index: 1000;
      border: 1px solid var(--border);
    }
    
    .edit-toolbar-btn {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .edit-toolbar-btn-primary {
      background: var(--foreground);
      color: white;
    }
    
    .edit-toolbar-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-soft);
    }
    
    .edit-toolbar-btn-secondary {
      background: var(--background);
      color: var(--foreground);
      border: 1px solid var(--border);
    }
    
    .edit-toolbar-btn-secondary:hover {
      background: var(--border);
    }
    
    .edit-toolbar-divider {
      width: 1px;
      height: 24px;
      background: var(--border);
      margin: 0 4px;
    }
    
    .edit-toolbar-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-right: 8px;
    }
    
    .editable-content {
      outline: none;
    }
    
    .editable-content:focus {
      outline: none;
    }
    
    .editable-content *::selection {
      background: var(--primary-lighter);
    }
    
    @media print {
      .edit-toolbar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- ===== EDIT TOOLBAR ===== -->
  <div class="edit-toolbar">
    <span class="edit-toolbar-label">📝 Modo Edição</span>
    <button class="edit-toolbar-btn edit-toolbar-btn-primary" onclick="window.print()">
      🖨️ Imprimir
    </button>
    <div class="edit-toolbar-divider"></div>
    <button class="edit-toolbar-btn edit-toolbar-btn-secondary" onclick="saveAsHTML()">
      💾 Salvar HTML
    </button>
  </div>
  
  <script>
    // Toggle checklist items
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('checklist-checkbox')) {
        e.target.classList.toggle('checked');
        const item = e.target.closest('.checklist-item');
        if (item) item.classList.toggle('checked');
      }
    });
    
    // Save as HTML function
    function saveAsHTML() {
      const content = document.documentElement.outerHTML;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-editado.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
  
  <div class="container editable-content" contenteditable="true">
    <!-- ===== COVER PAGE ===== -->
    <div class="cover-page">
      <div class="cover-badge">Documento Estratégico Confidencial</div>
      <h1 class="cover-title">Plano de Estruturação<br>em Gestão</h1>
      <p class="cover-subtitle">Diagnóstico Completo e Plano de Ação Personalizado</p>
      
      <div class="cover-divider"></div>
      
      <div class="cover-company">${project.nomeEmpresa}</div>
      <div class="cover-segment">${project.segmento}</div>
      
      <div class="cover-meta-grid">
        <div class="cover-meta-item">
          <div class="cover-meta-label">Responsável</div>
          <div class="cover-meta-value">${project.responsavel}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Data de Emissão</div>
          <div class="cover-meta-value">${formatDate(new Date().toISOString())}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Faturamento Médio</div>
          <div class="cover-meta-value">${formatCurrency(project.faturamentoMedio)}</div>
        </div>
        <div class="cover-meta-item">
          <div class="cover-meta-label">Colaboradores</div>
          <div class="cover-meta-value">${project.quantidadeColaboradores} pessoas</div>
        </div>
      </div>
      
      <div class="cover-progress-ring">
        <div class="cover-progress-circle">
          <div class="cover-progress-inner">
            <div class="cover-progress-value">${overallProgress}%</div>
            <div class="cover-progress-label">Completo</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ===== TABLE OF CONTENTS ===== -->
    <div class="toc">
      <div class="toc-header">
        <div class="toc-badge">Navegação</div>
        <h2 class="toc-title">Sumário do Documento</h2>
        <p class="toc-description">Este documento contém a análise completa da sua empresa com planos de ação específicos para cada área.</p>
      </div>
      
      <div class="toc-grid">
        ${blocks.map((block, index) => `
          <div class="toc-item">
            <div class="toc-item-left">
              <div class="toc-item-number">${String(index + 1).padStart(2, '0')}</div>
              <span class="toc-item-icon">${block.icon}</span>
              <span class="toc-item-name">${block.name}</span>
            </div>
            <div class="toc-item-right">
              <div class="toc-item-progress">
                <div class="toc-item-progress-fill" style="width: ${block.progress}%"></div>
              </div>
              <span class="toc-item-percent">${block.progress}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- ===== CONTENT ===== -->
    <div class="content">
      <!-- ===== COMPANY INFO ===== -->
      <div class="section">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏢</span>
            Visão Geral
          </div>
          <h2 class="section-title">Informações da Empresa</h2>
          <p class="section-description">Dados cadastrais e métricas fundamentais do negócio em análise, servindo como base para todas as recomendações deste documento.</p>
        </div>
        
        <div class="data-grid">
          <div class="data-item">
            <div class="data-label">Razão Social</div>
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
        
        ${project.faturamentoMedio > 0 && project.quantidadeColaboradores > 0 ? `
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Análise de Produtividade por Colaborador</div>
          <div class="insight-box-text">
            <strong>Receita por colaborador: ${formatCurrency(project.faturamentoMedio / project.quantidadeColaboradores)}/mês</strong><br><br>
            ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 
              ? `Este valor está abaixo da média de mercado para empresas do segmento "${project.segmento}". Recomendamos avaliar:<br>
                 • <strong>Processos ineficientes</strong> que consomem tempo desnecessário<br>
                 • <strong>Capacitação da equipe</strong> para aumentar produtividade<br>
                 • <strong>Automação</strong> de tarefas repetitivas<br>
                 • <strong>Revisão do quadro</strong> - pode haver excesso de pessoal em áreas não produtivas`
              : project.faturamentoMedio / project.quantidadeColaboradores > 30000
                ? `Excelente indicador de produtividade! Sua empresa está acima da média do mercado. Para manter e escalar:<br>
                   • <strong>Documente processos</strong> que geram essa eficiência<br>
                   • <strong>Invista em tecnologia</strong> para amplificar os resultados<br>
                   • <strong>Considere expansão</strong> replicando o modelo em novas unidades ou mercados`
                : `Indicador dentro da média de mercado. Para melhorar progressivamente:<br>
                   • <strong>Identifique os 20%</strong> de atividades que geram 80% do resultado<br>
                   • <strong>Elimine reuniões</strong> desnecessárias e burocracias<br>
                   • <strong>Implemente métricas</strong> individuais de produtividade`}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📊</div>
            <div>
              <div class="visual-example-title">Benchmarking de Mercado</div>
              <div class="visual-example-subtitle">Como sua empresa se compara</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 ? 'var(--primary-lighter)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores < 10000 ? 'var(--primary)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Abaixo da Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">< R$ 10k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores >= 10000 && project.faturamentoMedio / project.quantidadeColaboradores <= 30000 ? 'var(--primary-lighter)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores >= 10000 && project.faturamentoMedio / project.quantidadeColaboradores <= 30000 ? 'var(--primary)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Na Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">R$ 10k - 30k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
              <div style="padding: 20px; background: ${project.faturamentoMedio / project.quantidadeColaboradores > 30000 ? 'var(--accent-light)' : 'var(--background)'}; border-radius: 12px; border: 2px solid ${project.faturamentoMedio / project.quantidadeColaboradores > 30000 ? 'var(--accent)' : 'transparent'};">
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Acima da Média</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--foreground);">> R$ 30k</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">por colaborador</div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
      
      <!-- ===== GOLDEN CIRCLE ===== -->
      ${data.goldenCircle.why || data.goldenCircle.how || data.goldenCircle.what ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🎯</span>
            Propósito
          </div>
          <h2 class="section-title">Golden Circle - Círculo Dourado</h2>
          <p class="section-description">Metodologia criada por Simon Sinek que define o propósito, processo e entrega da organização. Empresas que comunicam do "porquê" para o "o quê" criam conexões emocionais mais fortes com clientes.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📖</div>
            <span class="info-box-title">Por que o Golden Circle é importante?</span>
          </div>
          <div class="info-box-text">
            Segundo pesquisa da Harvard Business Review, empresas orientadas por propósito têm <strong>4x mais crescimento</strong> do que empresas focadas apenas em lucro. 
            O Golden Circle ajuda a criar uma narrativa coerente que atrai clientes que compartilham dos mesmos valores, gerando fidelização natural.
          </div>
        </div>
        
        <div class="golden-circle">
          ${data.goldenCircle.why ? `
          <div class="golden-ring golden-why">
            <div class="golden-label">💛 Por quê? (WHY)</div>
            <div class="golden-content">${data.goldenCircle.why}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.how ? `
          <div class="golden-ring golden-how">
            <div class="golden-label">💙 Como? (HOW)</div>
            <div class="golden-content">${data.goldenCircle.how}</div>
          </div>
          ` : ''}
          
          ${data.goldenCircle.what ? `
          <div class="golden-ring golden-what">
            <div class="golden-label">💜 O quê? (WHAT)</div>
            <div class="golden-content">${data.goldenCircle.what}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">🚀</div>
            <span class="implementation-title">Como Aplicar o Golden Circle na Prática</span>
          </div>
          <div class="implementation-steps">
            <div class="implementation-step">
              <div class="implementation-step-number">1</div>
              <div class="implementation-step-content">
                <h4>Use o "Porquê" no seu Pitch de Vendas</h4>
                <p><strong>Exemplo prático:</strong> Ao invés de dizer "Vendemos consultoria em gestão", diga "${data.goldenCircle.why ? `"${data.goldenCircle.why.substring(0, 80)}..." - é por isso que fazemos o que fazemos.` : '"Acreditamos que toda empresa merece crescer de forma estruturada - é por isso que fazemos o que fazemos."'} Isso cria conexão emocional antes de falar do produto.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">2</div>
              <div class="implementation-step-content">
                <h4>Incorpore na Página Inicial do Site</h4>
                <p><strong>Estrutura sugerida:</strong> Hero com o PORQUÊ em destaque → Como você resolve (COMO) → Lista de serviços/produtos (O QUÊ). Isso aumenta tempo na página em até 40% segundo estudos de UX.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">3</div>
              <div class="implementation-step-content">
                <h4>Treine sua Equipe</h4>
                <p><strong>Workshop recomendado:</strong> Faça uma sessão de 2h com toda equipe explicando o Golden Circle. Cada colaborador deve saber responder "Por que a ${project.nomeEmpresa} existe?" de forma consistente.</p>
              </div>
            </div>
            <div class="implementation-step">
              <div class="implementation-step-number">4</div>
              <div class="implementation-step-content">
                <h4>Revise Materiais de Marketing</h4>
                <p><strong>Checklist:</strong> Cartão de visita, assinatura de email, posts em redes sociais, propostas comerciais - todos devem comunicar primeiro o PORQUÊ, depois o resto.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">✍️</div>
            <div>
              <div class="visual-example-title">Exemplo de Aplicação: Texto para Site</div>
              <div class="visual-example-subtitle">Como usar seu Golden Circle na comunicação</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="font-family: Georgia, serif; line-height: 1.9;">
              <p style="font-size: 24px; font-weight: 600; color: var(--foreground); margin-bottom: 16px; font-style: italic;">
                "${data.goldenCircle.why || 'Acreditamos que toda empresa pode alcançar seu potencial máximo.'}"
              </p>
              <p style="font-size: 15px; color: var(--muted); margin-bottom: 12px;">
                ${data.goldenCircle.how || 'Fazemos isso através de metodologias comprovadas e acompanhamento personalizado.'}
              </p>
              <p style="font-size: 14px; color: var(--primary); font-weight: 600;">
                ${data.goldenCircle.what || 'Oferecemos consultoria, treinamentos e mentoria para empresários.'}
              </p>
            </div>
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Golden Circle</div>
            <span class="action-plan-badge">Próximos 30 dias</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Validar o Golden Circle com 5 clientes atuais</div>
                <div class="action-plan-detail">Pergunte: "O que te fez escolher a ${project.nomeEmpresa}?" - as respostas devem refletir seu PORQUÊ. Se não refletirem, refine a mensagem.</div>
                <div class="action-plan-meta">
                  <span class="action-plan-tag">⏱️ 1 semana</span>
                  <span class="action-plan-tag">👤 Comercial</span>
                </div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Atualizar apresentação comercial com a nova narrativa</div>
                <div class="action-plan-detail">Slide 1: PORQUÊ (gere identificação) → Slide 2: COMO (credibilidade) → Slides 3+: O QUÊ (detalhes).</div>
                <div class="action-plan-meta">
                  <span class="action-plan-tag">⏱️ 2 semanas</span>
                  <span class="action-plan-tag">👤 Marketing</span>
                </div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar vídeo institucional de 60 segundos</div>
                <div class="action-plan-detail">Roteiro: 20s contando o PORQUÊ, 20s mostrando COMO trabalham, 20s apresentando O QUÊ oferecem. Use depoimentos de clientes.</div>
                <div class="action-plan-meta">
                  <span class="action-plan-tag">⏱️ 4 semanas</span>
                  <span class="action-plan-tag">👤 Marketing</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== IDENTIDADE ORGANIZACIONAL ===== -->
      ${data.identidade.visao || data.identidade.missao || data.identidade.valores.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏛️</span>
            Fundamentos
          </div>
          <h2 class="section-title">Identidade Organizacional</h2>
          <p class="section-description">Os pilares que definem quem a empresa é, para onde vai e quais princípios guiam suas decisões. Uma identidade clara aumenta engajamento de colaboradores em até 67% (Gallup).</p>
        </div>
        
        ${data.identidade.visao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🔭</div>
            <span class="card-title">Visão de Futuro</span>
          </div>
          <div class="card-content" style="font-size: 18px; font-weight: 500; color: var(--primary);">
            "${data.identidade.visao}"
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">💡</div>
            <span class="suggestion-title">Como usar a Visão no dia a dia</span>
          </div>
          <div class="suggestion-text">
            <strong>1. Nas reuniões de planejamento:</strong> Comece toda reunião estratégica relembrando a visão. Pergunte: "Esta decisão nos aproxima ou afasta da visão?"<br><br>
            <strong>2. Na contratação:</strong> Pergunte aos candidatos: "O que você acha de fazer parte de uma empresa que quer '${data.identidade.visao.substring(0, 50)}...'?"<br><br>
            <strong>3. No escritório:</strong> Coloque a visão em local visível. Quadros, papel de parede, tela de descanso dos computadores.
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.missao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Missão</span>
          </div>
          <div class="card-content" style="font-size: 16px;">
            ${data.identidade.missao}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📝</div>
            <div>
              <div class="visual-example-title">Modelo: Assinatura de E-mail com Missão</div>
              <div class="visual-example-subtitle">Exemplo de aplicação prática</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="font-family: Arial, sans-serif; padding: 16px; background: #f9f9f9; border-radius: 8px;">
              <div style="font-weight: 600; color: #333;">${project.responsavel}</div>
              <div style="font-size: 13px; color: #666;">${project.segmento} | ${project.nomeEmpresa}</div>
              <div style="font-size: 12px; color: #999; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-style: italic;">
                "${data.identidade.missao.substring(0, 80)}${data.identidade.missao.length > 80 ? '...' : ''}"
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.valores.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">💎</div>
            <span class="card-title">Valores Organizacionais</span>
          </div>
          <div class="tags">
            ${data.identidade.valores.map(v => `<span class="tag tag-gold">${v}</span>`).join('')}
          </div>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">⚡</div>
            <span class="implementation-title">Vivenciando os Valores na Prática</span>
          </div>
          <div class="implementation-steps">
            ${data.identidade.valores.slice(0, 3).map((valor, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Valor: ${valor}</h4>
                <p><strong>Como aplicar:</strong> Crie uma situação concreta onde este valor deve prevalecer. Ex: Se o valor é "Transparência", defina que todos os erros devem ser comunicados em até 24h, mesmo os pequenos. Documente exemplos reais de quando o valor foi praticado e compartilhe com a equipe.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Identidade</div>
            <span class="action-plan-badge">Cultura organizacional</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar "Manual de Cultura" de 1 página</div>
                <div class="action-plan-detail">Inclua: Visão, Missão, Valores + 3 comportamentos esperados para cada valor. Distribua para todos e use no onboarding.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar "Momento Valor" nas reuniões semanais</div>
                <div class="action-plan-detail">Dedique 5 minutos para alguém compartilhar um exemplo real de quando vivenciou um dos valores. Isso reforça a cultura de forma orgânica.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Incluir valores na avaliação de desempenho</div>
                <div class="action-plan-detail">Além de metas numéricas, avalie como cada colaborador pratica os valores. Peso sugerido: 30% da avaliação.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== SWOT ===== -->
      ${data.swot.forcas.length > 0 || data.swot.fraquezas.length > 0 || data.swot.oportunidades.length > 0 || data.swot.ameacas.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📊</span>
            Análise Estratégica
          </div>
          <h2 class="section-title">Matriz SWOT</h2>
          <p class="section-description">Análise dos fatores internos (Forças e Fraquezas) e externos (Oportunidades e Ameaças) que impactam o negócio. Esta ferramenta é base para definição de estratégias.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">🎓</div>
            <span class="info-box-title">Como interpretar a Matriz SWOT</span>
          </div>
          <div class="info-box-text">
            • <strong>FORÇAS + OPORTUNIDADES:</strong> Estratégia de ATAQUE - use suas forças para aproveitar oportunidades<br>
            • <strong>FORÇAS + AMEAÇAS:</strong> Estratégia de DEFESA - use forças para neutralizar ameaças<br>
            • <strong>FRAQUEZAS + OPORTUNIDADES:</strong> Estratégia de DESENVOLVIMENTO - melhore fraquezas para aproveitar oportunidades<br>
            • <strong>FRAQUEZAS + AMEAÇAS:</strong> Estratégia de SOBREVIVÊNCIA - minimize fraquezas e evite ameaças
          </div>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-header">
              <div class="swot-icon">💪</div>
              <span class="swot-title">Forças (Strengths)</span>
            </div>
            <div class="swot-list">
              ${data.swot.forcas.length > 0 ? data.swot.forcas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-header">
              <div class="swot-icon">⚠️</div>
              <span class="swot-title">Fraquezas (Weaknesses)</span>
            </div>
            <div class="swot-list">
              ${data.swot.fraquezas.length > 0 ? data.swot.fraquezas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-header">
              <div class="swot-icon">🚀</div>
              <span class="swot-title">Oportunidades (Opportunities)</span>
            </div>
            <div class="swot-list">
              ${data.swot.oportunidades.length > 0 ? data.swot.oportunidades.map(o => `• ${o}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-header">
              <div class="swot-icon">⚡</div>
              <span class="swot-title">Ameaças (Threats)</span>
            </div>
            <div class="swot-list">
              ${data.swot.ameacas.length > 0 ? data.swot.ameacas.map(a => `• ${a}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
        </div>
        
        ${data.swot.forcas.length > 0 && data.swot.oportunidades.length > 0 ? `
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Estratégia Recomendada: ATAQUE</div>
          <div class="insight-box-text">
            <strong>Combinação de alto impacto identificada:</strong><br><br>
            Use sua força "<strong>${data.swot.forcas[0]}</strong>" para aproveitar a oportunidade "<strong>${data.swot.oportunidades[0]}</strong>".<br><br>
            <strong>Ação concreta:</strong> Crie uma campanha ou iniciativa específica que destaque esta força para capturar esta oportunidade nos próximos 90 dias.
          </div>
        </div>
        ` : ''}
        
        ${data.swot.fraquezas.length > 0 && data.swot.ameacas.length > 0 ? `
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🛡️</div>
            <span class="suggestion-title">Alerta: Ponto de Vulnerabilidade</span>
          </div>
          <div class="suggestion-text">
            A fraqueza "<strong>${data.swot.fraquezas[0]}</strong>" combinada com a ameaça "<strong>${data.swot.ameacas[0]}</strong>" representa um risco significativo.<br><br>
            <strong>Mitigação urgente:</strong> Priorize resolver ou minimizar esta fraqueza nas próximas 4-6 semanas para reduzir exposição ao risco.
          </div>
        </div>
        ` : ''}
        
        ${data.swot.horizontes && (data.swot.horizontes.curto || data.swot.horizontes.medio || data.swot.horizontes.longo) ? `
        <div class="card" style="margin-top: 32px;">
          <div class="card-header">
            <div class="card-icon">🗓️</div>
            <span class="card-title">Horizontes Estratégicos</span>
          </div>
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
              <div class="timeline-label">Longo Prazo (18-36 meses)</div>
              <div class="timeline-content">${data.swot.horizontes.longo}</div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - SWOT</div>
            <span class="action-plan-badge">Estratégico</span>
          </div>
          <ul class="action-plan-list">
            ${data.swot.forcas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Documentar e comunicar suas forças</div>
                <div class="action-plan-detail">Crie materiais de marketing que destaquem: ${data.swot.forcas.slice(0, 2).join(', ')}. Use em propostas, site e redes sociais.</div>
              </div>
            </li>
            ` : ''}
            ${data.swot.fraquezas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar plano de melhoria para principal fraqueza</div>
                <div class="action-plan-detail">Foco em "${data.swot.fraquezas[0]}": defina responsável, prazo de 60 dias e 3 ações específicas para melhorar este ponto.</div>
              </div>
            </li>
            ` : ''}
            ${data.swot.oportunidades.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Desenvolver iniciativa para capturar oportunidade</div>
                <div class="action-plan-detail">Oportunidade: "${data.swot.oportunidades[0]}". Crie um projeto específico com metas, orçamento e cronograma para aproveitá-la.</div>
              </div>
            </li>
            ` : ''}
            ${data.swot.ameacas.length > 0 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Montar plano de contingência para ameaças</div>
                <div class="action-plan-detail">Ameaça: "${data.swot.ameacas[0]}". Defina: sinais de alerta para monitorar, ações de resposta, responsável pela vigilância.</div>
              </div>
            </li>
            ` : ''}
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== DIAGNÓSTICO ===== -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🔍</span>
            Diagnóstico
          </div>
          <h2 class="section-title">Diagnóstico de Maturidade</h2>
          <p class="section-description">Avaliação do nível de maturidade em cada área crítica do negócio. Esta análise identifica gaps e prioridades de desenvolvimento.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📊</div>
            <span class="info-box-title">Interpretando os Níveis de Maturidade</span>
          </div>
          <div class="info-box-text">
            <strong>Nível 1 - Inicial:</strong> Processos inexistentes ou caóticos<br>
            <strong>Nível 2 - Básico:</strong> Processos existem mas não são padronizados<br>
            <strong>Nível 3 - Definido:</strong> Processos documentados e seguidos<br>
            <strong>Nível 4 - Gerenciado:</strong> Processos medidos e controlados<br>
            <strong>Nível 5 - Otimizado:</strong> Melhoria contínua e inovação constante<br><br>
            <strong>Maturidade média da ${project.nomeEmpresa}: ${avgMaturity}/5</strong>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📈</div>
            <div>
              <div class="visual-example-title">Visão Geral de Maturidade</div>
              <div class="visual-example-subtitle">Comparativo entre as 4 dimensões</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.pessoas.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Pessoas</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.pessoas.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.processos.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Processos</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.processos.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.financas.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Finanças</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.financas.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 40px; font-weight: 700; color: var(--foreground);">${data.diagnostico.mercado.level}</div>
                <div style="font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Mercado</div>
                <div style="height: 6px; background: var(--border); border-radius: 3px; margin-top: 8px; overflow: hidden;">
                  <div style="height: 100%; width: ${data.diagnostico.mercado.level * 20}%; background: var(--accent); border-radius: 3px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="maturity-grid" style="margin-top: 32px;">
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">👥</span> Pessoas</span>
              <span class="maturity-level">${data.diagnostico.pessoas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.pessoas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.pessoas.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">⚙️</span> Processos</span>
              <span class="maturity-level">${data.diagnostico.processos.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.processos.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.processos.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">💰</span> Finanças</span>
              <span class="maturity-level">${data.diagnostico.financas.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.financas.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.financas.notes || 'Sem observações adicionais'}</div>
          </div>
          
          <div class="maturity-item">
            <div class="maturity-header">
              <span class="maturity-area"><span class="maturity-area-icon">📈</span> Mercado</span>
              <span class="maturity-level">${data.diagnostico.mercado.level}/5</span>
            </div>
            <div class="maturity-bar">
              <div class="maturity-fill" style="width: ${data.diagnostico.mercado.level * 20}%"></div>
            </div>
            <div class="maturity-notes">${data.diagnostico.mercado.notes || 'Sem observações adicionais'}</div>
          </div>
        </div>
        
        <!-- Insights por área -->
        <div style="margin-top: 40px;">
          <h3 style="font-size: 20px; font-weight: 700; color: var(--foreground); margin-bottom: 24px;">📋 Análise Detalhada por Área</h3>
          
          <div class="insight-box">
            <div class="insight-box-title">👥 Pessoas - Nível ${data.diagnostico.pessoas.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.pessoas.level, 'pessoas')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('pessoas', data.diagnostico.pessoas.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">⚙️ Processos - Nível ${data.diagnostico.processos.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.processos.level, 'processos')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('processos', data.diagnostico.processos.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">💰 Finanças - Nível ${data.diagnostico.financas.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.financas.level, 'financas')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('financas', data.diagnostico.financas.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
          
          <div class="insight-box">
            <div class="insight-box-title">📈 Mercado - Nível ${data.diagnostico.mercado.level}</div>
            <div class="insight-box-text">
              ${generateMaturityInsights(data.diagnostico.mercado.level, 'mercado')}<br><br>
              <strong>Ações prioritárias:</strong><br>
              ${generateActionPlan('mercado', data.diagnostico.mercado.level).map((a, i) => `${i + 1}. ${a}`).join('<br>')}
            </div>
          </div>
        </div>
      </div>
      
      <!-- ===== ICP ===== -->
      ${data.icp.descricao || data.icp.segmentos.length > 0 || data.icp.dpisos.length > 0 || data.icp.necessidades.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👤</span>
            Cliente Ideal
          </div>
          <h2 class="section-title">Perfil do Cliente Ideal (ICP)</h2>
          <p class="section-description">Definição detalhada do cliente que mais se beneficia das suas soluções e gera maior valor para o negócio. Empresas com ICP claro têm 68% mais eficiência comercial.</p>
        </div>
        
        ${data.icp.descricao ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Descrição do Cliente Ideal</span>
          </div>
          <div class="card-content" style="font-size: 16px; line-height: 1.9;">
            ${data.icp.descricao}
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📝</div>
            <div>
              <div class="visual-example-title">Modelo: Bio do Cliente Ideal</div>
              <div class="visual-example-subtitle">Use este formato em treinamentos de vendas</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: 80px 1fr; gap: 20px; align-items: start;">
              <div style="width: 80px; height: 80px; background: var(--primary-lighter); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px;">👤</div>
              <div>
                <div style="font-weight: 700; font-size: 18px; margin-bottom: 4px; color: var(--foreground);">Cliente Ideal da ${project.nomeEmpresa}</div>
                <div style="font-size: 13px; color: var(--muted); margin-bottom: 12px;">${project.segmento}</div>
                <div style="font-size: 14px; line-height: 1.7; color: var(--foreground);">
                  "${data.icp.descricao.substring(0, 200)}${data.icp.descricao.length > 200 ? '...' : ''}"
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${data.icp.segmentos.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🏢</div>
            <span class="card-title">Segmentos de Atuação</span>
          </div>
          <div class="tags">
            ${data.icp.segmentos.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🎯</div>
            <span class="suggestion-title">Como usar os segmentos na prospecção</span>
          </div>
          <div class="suggestion-text">
            <strong>LinkedIn Sales Navigator:</strong> Use estes segmentos como filtros de busca. Exemplo: Indústria = "${data.icp.segmentos[0]}"<br><br>
            <strong>Listas de prospecção:</strong> Compre ou desenvolva listas específicas para cada segmento. Personalize a abordagem por segmento.<br><br>
            <strong>Conteúdo segmentado:</strong> Crie cases de sucesso, artigos e posts específicos para cada segmento - isso aumenta conversão em até 3x.
          </div>
        </div>
        ` : ''}
        
        ${data.icp.dpisos && data.icp.dpisos.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">😰</div>
            <span class="card-title">Dores e Problemas do Cliente</span>
          </div>
          <ul class="list">
            ${data.icp.dpisos.map(d => `<li class="list-item"><span class="list-bullet"></span><span>${d}</span></li>`).join('')}
          </ul>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">💬</div>
            <span class="implementation-title">Scripts de Abordagem Baseados nas Dores</span>
          </div>
          <div class="implementation-steps">
            ${data.icp.dpisos.slice(0, 3).map((dor, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Dor: "${dor}"</h4>
                <p><strong>Script de abertura:</strong> "Tenho conversado com [perfil do cliente] que frequentemente me dizem que sofrem com [${dor}]. Isso acontece com você também?" - Esta pergunta gera identificação e abre espaço para apresentar sua solução.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.icp.necessidades.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">✨</div>
            <span class="card-title">Necessidades e Desejos</span>
          </div>
          <ul class="list">
            ${data.icp.necessidades.map(n => `<li class="list-item"><span class="list-bullet"></span><span>${n}</span></li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - ICP</div>
            <span class="action-plan-badge">Comercial</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar "ICP Card" para equipe comercial</div>
                <div class="action-plan-detail">Documento de 1 página com: descrição, segmentos, dores principais e necessidades. Todo vendedor deve ter na mesa ou no celular.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Revisar base atual de clientes</div>
                <div class="action-plan-detail">Classifique seus clientes atuais: quantos são ICP perfeito? Priorize atendimento e upsell para estes. Considere descontinuar clientes muito fora do perfil.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar conteúdo específico para ICP</div>
                <div class="action-plan-detail">Desenvolva: 1 e-book sobre uma dor específica, 3 posts de LinkedIn por semana falando das dores, 1 webinar por mês resolvendo um problema do ICP.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== CONCORRENTES ===== -->
      ${data.concorrentes.principais.length > 0 || data.concorrentes.diferenciais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🏆</span>
            Competição
          </div>
          <h2 class="section-title">Análise Competitiva</h2>
          <p class="section-description">Mapeamento dos principais concorrentes e definição dos seus diferenciais competitivos. Conhecer a concorrência é fundamental para se posicionar de forma única.</p>
        </div>
        
        ${data.concorrentes.principais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Principais Concorrentes Mapeados</span>
          </div>
          <div class="competitor-visual">
            ${data.concorrentes.principais.map(c => `
              <div class="competitor-card">
                <div style="font-size: 32px; margin-bottom: 8px;">🏢</div>
                <div class="competitor-name">${c.nome}</div>
                <div class="competitor-type">${c.tipo}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Concorrente</th>
                <th>Tipo</th>
                <th>Pontos Fortes</th>
                <th>Pontos Fracos</th>
              </tr>
            </thead>
            <tbody>
              ${data.concorrentes.principais.map(c => `
                <tr>
                  <td><strong>${c.nome}</strong></td>
                  <td>${c.tipo}</td>
                  <td>${c.pontosFortes || '-'}</td>
                  <td>${c.pontosFracos || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🔍</div>
            <span class="suggestion-title">Como monitorar a concorrência</span>
          </div>
          <div class="suggestion-text">
            <strong>Google Alerts:</strong> Configure alertas para o nome de cada concorrente. Receba notificações quando saírem notícias.<br><br>
            <strong>Redes sociais:</strong> Siga todos os concorrentes no LinkedIn, Instagram e onde mais atuarem. Analise: frequência de posts, engajamento, tipo de conteúdo.<br><br>
            <strong>Mystery shopping:</strong> Uma vez por trimestre, simule ser cliente do concorrente. Peça orçamento, analise o processo de vendas, compare com o seu.<br><br>
            <strong>Entrevistas com clientes perdidos:</strong> Quando perder uma venda para concorrente, pergunte gentilmente: "O que eles ofereceram que nós não oferecemos?"
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.diferenciais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">⭐</div>
            <span class="card-title">Seus Diferenciais Competitivos</span>
          </div>
          <div class="tags">
            ${data.concorrentes.diferenciais.map(d => `<span class="tag tag-accent">${d}</span>`).join('')}
          </div>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">📢</div>
            <span class="implementation-title">Como comunicar cada diferencial</span>
          </div>
          <div class="implementation-steps">
            ${data.concorrentes.diferenciais.slice(0, 4).map((dif, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>"${dif}"</h4>
                <p><strong>Prova social:</strong> Colete 3 depoimentos de clientes que confirmem este diferencial. Use nas propostas, site e apresentações. <strong>Números:</strong> Quantifique: "90% dos nossos clientes destacam [${dif}] como motivo de escolha."</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.propostaValor ? `
        <div class="card" style="background: var(--foreground); color: white; border: none;">
          <div style="text-align: center; padding: 24px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 14px;">Proposta de Valor Única</div>
            <div style="font-size: 22px; font-weight: 600; line-height: 1.5;">
              "${data.concorrentes.propostaValor}"
            </div>
          </div>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">🖥️</div>
            <div>
              <div class="visual-example-title">Aplicação: Hero do Site</div>
              <div class="visual-example-subtitle">Como usar a proposta de valor na página inicial</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 40px; border-radius: 12px; text-align: center;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 12px;">${data.concorrentes.propostaValor}</div>
              <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">${data.goldenCircle.what || 'Soluções completas para o seu negócio crescer'}</div>
              <div style="display: inline-block; background: white; color: var(--primary); padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">Quero saber mais →</div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Concorrência</div>
            <span class="action-plan-badge">Posicionamento</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar "Battle Card" interno</div>
                <div class="action-plan-detail">Documento comparando você vs cada concorrente principal. Inclua: diferenciais, objeções comuns e como respondê-las. Treine a equipe comercial.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Desenvolver 3 cases de sucesso destacando diferenciais</div>
                <div class="action-plan-detail">Para cada diferencial principal, tenha um case que comprove. Formato: Desafio → Solução → Resultado com números.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar ritual mensal de inteligência competitiva</div>
                <div class="action-plan-detail">Reunião de 30min/mês para compartilhar novidades sobre concorrentes. Quem viu o quê? O que aprendemos? Como reagir?</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== PRECIFICAÇÃO ===== -->
      ${(data.precificacao.produtos && data.precificacao.produtos.length > 0) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💰</span>
            Precificação
          </div>
          <h2 class="section-title">Estratégia de Precificação</h2>
          <p class="section-description">Análise dos produtos/serviços e estratégias para maximização de valor percebido e receita.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📊</div>
            <span class="info-box-title">Os 3 pilares da precificação estratégica</span>
          </div>
          <div class="info-box-text">
            <strong>1. Custo +:</strong> Calcule todos os custos e adicione margem. Base, mas não suficiente.<br>
            <strong>2. Concorrência:</strong> Posicione-se em relação aos concorrentes. Importante, mas não determinante.<br>
            <strong>3. Valor percebido:</strong> Quanto o cliente está disposto a pagar pelo resultado que você entrega? Este é o teto do seu preço.<br><br>
            <strong>Regra de ouro:</strong> Seu preço deve estar entre o custo mínimo e o valor percebido máximo. Quanto mais próximo do valor percebido, maior sua margem.
          </div>
        </div>
        
        ${data.precificacao.produtos.map((produto, idx) => `
        <div class="card" style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Produto/Serviço #${idx + 1}</div>
              <div style="font-size: 22px; font-weight: 800; color: var(--foreground);">${produto.nome || 'Produto sem nome'}</div>
              ${produto.descricao ? `<p style="color: var(--muted); font-size: 14px; margin-top: 6px; max-width: 400px;">${produto.descricao}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Preço Atual</div>
              <div style="font-size: 32px; font-weight: 900; color: var(--primary);">R$ ${produto.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          
          ${produto.precoAtual > 0 ? `
          <div style="margin-top: 24px;">
            <div style="font-size: 15px; font-weight: 700; margin-bottom: 16px; color: var(--foreground);">💡 6 Estratégias de Precificação para "${produto.nome}"</div>
            <div class="pricing-grid">
              <div class="pricing-suggestion pricing-1">
                <div class="pricing-suggestion-label">Valor Agregado (+40%)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 1.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Adicione garantia, suporte VIP e bônus exclusivos</div>
              </div>
              <div class="pricing-suggestion pricing-2">
                <div class="pricing-suggestion-label">Combo/Pacote (3 itens)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 2.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Cliente economiza 15%, você ganha +67% ticket</div>
              </div>
              <div class="pricing-suggestion pricing-3">
                <div class="pricing-suggestion-label">Versão Premium (2x)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Atendimento prioritário e exclusivo</div>
              </div>
              <div class="pricing-suggestion pricing-4">
                <div class="pricing-suggestion-label">Recorrência Mensal</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
                <div class="pricing-suggestion-hint">12x retorno anual garantido (receita previsível)</div>
              </div>
              <div class="pricing-suggestion pricing-5">
                <div class="pricing-suggestion-label">Baseado em ROI (3x)</div>
                <div class="pricing-suggestion-value">R$ ${(produto.precoAtual * 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="pricing-suggestion-hint">Se gera 10x retorno, 3x é barato</div>
              </div>
              <div class="pricing-suggestion pricing-6">
                <div class="pricing-suggestion-label">Ancoragem Visual</div>
                <div class="pricing-suggestion-value" style="font-size: 14px;"><s style="opacity: 0.7;">R$ ${(produto.precoAtual * 2).toLocaleString('pt-BR')}</s> R$ ${produto.precoAtual.toLocaleString('pt-BR')}</div>
                <div class="pricing-suggestion-hint">Percepção de oportunidade/desconto</div>
              </div>
            </div>
          </div>
          
          <div class="implementation-guide" style="margin-top: 24px; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-color: var(--gold);">
            <div class="implementation-header">
              <div class="implementation-icon" style="background: var(--gold);">📈</div>
              <span class="implementation-title" style="color: #92400E;">Roteiro de implementação para "${produto.nome}"</span>
            </div>
            <div class="implementation-steps">
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">1</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Calcule seu custo real</h4>
                  <p style="color: #78350F;">Inclua: tempo de execução (seu e da equipe), custos fixos rateados, ferramentas, impostos. O preço atual de R$ ${produto.precoAtual.toLocaleString('pt-BR')} deixa qual margem líquida?</p>
                </div>
              </div>
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">2</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Teste uma estratégia nos próximos 30 dias</h4>
                  <p style="color: #78350F;">Recomendação: comece com Valor Agregado (+40%). Adicione: garantia de satisfação + 1 mês de suporte extra. Teste com 10 clientes e meça a conversão.</p>
                </div>
              </div>
              <div class="implementation-step">
                <div class="implementation-step-number" style="background: var(--gold);">3</div>
                <div class="implementation-step-content">
                  <h4 style="color: #92400E;">Analise os resultados</h4>
                  <p style="color: #78350F;">Se conversão cair menos de 20% com preço 40% maior, você está ganhando. Exemplo: vendia 10 a R$ ${produto.precoAtual.toLocaleString('pt-BR')} = R$ ${(produto.precoAtual * 10).toLocaleString('pt-BR')}. Se vender 8 a R$ ${(produto.precoAtual * 1.4).toLocaleString('pt-BR')} = R$ ${(produto.precoAtual * 1.4 * 8).toLocaleString('pt-BR')} (+${Math.round((1.4 * 8 / 10 - 1) * 100)}%).</p>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        `).join('')}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Precificação</div>
            <span class="action-plan-badge">Receita</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar planilha de custos detalhada</div>
                <div class="action-plan-detail">Para cada produto/serviço, liste todos os custos: diretos, indiretos, tempo envolvido. Calcule margem real atual.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Pesquisar willingness-to-pay com 10 clientes</div>
                <div class="action-plan-detail">Pergunte: "Quanto você esperava pagar por este resultado?" - A média das respostas é seu teto de preço.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar pelo menos 1 versão premium</div>
                <div class="action-plan-detail">Escolha seu produto mais vendido e crie uma versão 2x mais cara com benefícios exclusivos. Mesmo que venda pouco, melhora a percepção do produto padrão.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== ESTRATÉGIAS DE VALOR ===== -->
      ${data.estrategiasValor.novasOfertas.length > 0 || data.estrategiasValor.pacotes.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💡</span>
            Inovação
          </div>
          <h2 class="section-title">Estratégias de Valor</h2>
          <p class="section-description">Novas formas de agregar valor e expandir o portfólio de ofertas para os clientes.</p>
        </div>
        
        ${data.estrategiasValor.novasOfertas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🚀</div>
            <span class="card-title">Novas Ofertas Planejadas</span>
          </div>
          <ul class="list">
            ${data.estrategiasValor.novasOfertas.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">🎯</div>
            <span class="implementation-title">Framework para lançar novas ofertas</span>
          </div>
          <div class="implementation-steps">
            ${data.estrategiasValor.novasOfertas.slice(0, 2).map((oferta, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>"${oferta}"</h4>
                <p><strong>Validação rápida:</strong> Antes de desenvolver, ofereça para 5 clientes atuais com desconto de lançamento. Se 2+ comprarem, desenvolva. Senão, repense ou descarte.<br>
                <strong>Lançamento:</strong> Base de clientes primeiro (mais fácil) → Marketing de conteúdo → Prospecção ativa.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.estrategiasValor.pacotes.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📦</div>
            <span class="card-title">Pacotes de Serviços</span>
          </div>
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
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">🖥️</div>
            <div>
              <div class="visual-example-title">Modelo: Página de Preços Otimizada</div>
              <div class="visual-example-subtitle">Design que maximiza conversão</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(${Math.min(data.estrategiasValor.pacotes.length, 3)}, 1fr); gap: 16px;">
              ${data.estrategiasValor.pacotes.slice(0, 3).map((p, i) => `
                <div style="background: ${i === 1 ? 'var(--foreground)' : 'white'}; color: ${i === 1 ? 'white' : 'var(--foreground)'}; padding: 28px; border-radius: 12px; border: ${i === 1 ? 'none' : '1px solid var(--border)'}; text-align: center; ${i === 1 ? 'transform: scale(1.02);' : ''}">
                  ${i === 1 ? '<div style="font-size: 10px; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 100px; display: inline-block; margin-bottom: 14px;">MAIS POPULAR</div>' : ''}
                  <div style="font-weight: 600; font-size: 17px; margin-bottom: 10px;">${p.nome}</div>
                  <div style="font-size: 26px; font-weight: 700; margin-bottom: 14px;">${p.preco}</div>
                  <div style="font-size: 14px; opacity: 0.8; line-height: 1.6;">${p.descricao}</div>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; margin-top: 16px; font-size: 12px; color: var(--muted);">
              💡 Dica: O pacote do meio (marcado como "Mais Popular") converte até 60% mais. Use o pacote mais caro como âncora.
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Estratégias de Valor</div>
            <span class="action-plan-badge">Inovação</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Priorizar 1 nova oferta para os próximos 60 dias</div>
                <div class="action-plan-detail">Critérios de escolha: menor esforço de desenvolvimento, maior demanda de clientes, melhor margem potencial. Foque 100% até lançar.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar página de vendas para cada pacote</div>
                <div class="action-plan-detail">Estrutura: Headline com benefício principal → 3 bullets com o que inclui → Preço com âncora → Depoimentos → CTA urgente.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Treinar equipe no pitch de cada oferta</div>
                <div class="action-plan-detail">Role-play semanal: cada vendedor deve saber apresentar cada pacote em 60 segundos, responder 3 objeções comuns e fazer pergunta de fechamento.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== MOTORES DE CRESCIMENTO ===== -->
      ${data.motoresCrescimento.motoresPrincipais.length > 0 || data.motoresCrescimento.canais.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">🚀</span>
            Crescimento
          </div>
          <h2 class="section-title">Motores de Crescimento</h2>
          <p class="section-description">Os principais vetores que impulsionam o crescimento do negócio e os canais de aquisição de clientes.</p>
        </div>
        
        ${data.motoresCrescimento.motoresPrincipais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">⚡</div>
            <span class="card-title">Motores Principais de Crescimento</span>
          </div>
          <div class="tags">
            ${data.motoresCrescimento.motoresPrincipais.map(m => `<span class="tag">${m}</span>`).join('')}
          </div>
        </div>
        
        <div class="implementation-guide">
          <div class="implementation-header">
            <div class="implementation-icon">🎯</div>
            <span class="implementation-title">Ativando cada motor de crescimento</span>
          </div>
          <div class="implementation-steps">
            ${data.motoresCrescimento.motoresPrincipais.slice(0, 3).map((motor, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>${motor}</h4>
                <p><strong>Ação semanal:</strong> Defina 1 atividade específica por semana para este motor. Meça o resultado. Exemplo: se for "Indicações", a ação pode ser "Pedir 3 indicações por semana para clientes satisfeitos".<br>
                <strong>Meta mensal:</strong> Quantifique: quantos leads/vendas este motor deve gerar por mês?</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.canais.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📢</div>
            <span class="card-title">Canais de Aquisição</span>
          </div>
          <div class="tags">
            ${data.motoresCrescimento.canais.map(c => `<span class="tag tag-accent">${c}</span>`).join('')}
          </div>
        </div>
        
        <div class="insight-box">
          <div class="insight-box-title">💡 Regra 70-20-10 para canais</div>
          <div class="insight-box-text">
            <strong>70%</strong> do investimento no canal que já funciona (provavelmente "${data.motoresCrescimento.canais[0] || 'seu canal principal'}")<br>
            <strong>20%</strong> no segundo melhor canal para escalar<br>
            <strong>10%</strong> em experimentos com novos canais<br><br>
            Não tente estar em todos os lugares ao mesmo tempo. Domine um canal antes de ir para o próximo.
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.metricas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <span class="card-title">Métricas e Metas</span>
          </div>
          ${data.motoresCrescimento.metricas.map(m => `
            <div class="metric-visual">
              <div class="metric-visual-header">
                <span class="metric-visual-name">${m.nome}</span>
                <span class="metric-visual-target">${m.meta}</span>
              </div>
              <div class="metric-visual-bar">
                <div class="metric-visual-fill" style="width: 50%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">📈</div>
            <span class="suggestion-title">Como monitorar métricas de crescimento</span>
          </div>
          <div class="suggestion-text">
            <strong>Dashboard semanal:</strong> Crie uma planilha simples (Google Sheets) com todas as métricas. Atualize toda segunda-feira.<br><br>
            <strong>Reunião de 15 minutos:</strong> Toda semana, mesmo dia/hora, revise: "A métrica subiu, desceu ou estabilizou? Por quê? O que fazer diferente?"<br><br>
            <strong>Dono da métrica:</strong> Cada métrica deve ter 1 responsável. Esta pessoa é cobrada pelo resultado.
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Crescimento</div>
            <span class="action-plan-badge">Escala</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar dashboard de métricas de crescimento</div>
                <div class="action-plan-detail">Inclua: leads gerados, taxa de conversão, ticket médio, CAC, LTV. Atualize semanalmente. Compartilhe com a equipe.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar programa de indicação estruturado</div>
                <div class="action-plan-detail">Ofereça: desconto para quem indica E para quem foi indicado. Peça indicações no momento de máxima satisfação (após entrega bem-sucedida).</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Definir experimento de canal para próximo trimestre</div>
                <div class="action-plan-detail">Escolha 1 novo canal para testar com 10% do orçamento. Defina critério de sucesso antes de começar. Se funcionar, escale; se não, descarte sem remorso.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== ORGANOGRAMA ===== -->
      ${data.organograma.cargos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👥</span>
            Estrutura
          </div>
          <h2 class="section-title">Estrutura Organizacional</h2>
          <p class="section-description">Desenho da estrutura de cargos, responsabilidades e indicadores de cada posição.</p>
        </div>
        
        <div class="org-chart">
          ${[1, 2, 3].map(nivel => {
            const cargosNivel = data.organograma.cargos.filter(c => c.nivel === nivel);
            if (cargosNivel.length === 0) return '';
            return `
              <div class="org-level org-level-${nivel}">
                <div class="org-level-header">
                  <div class="org-level-dot"></div>
                  <span class="org-level-title">${nivel === 1 ? '🏆 Nível Estratégico' : nivel === 2 ? '⚙️ Nível Tático' : '🔧 Nível Operacional'}</span>
                </div>
                <div class="org-cards">
                  ${cargosNivel.map(cargo => `
                    <div class="org-card">
                      <div class="org-title">${cargo.titulo}</div>
                      <div class="org-subordinate">Subordinado a: ${cargo.subordinadoA || 'Proprietário'}</div>
                      <div class="org-section">
                        <div class="org-section-title">Responsabilidades</div>
                        <div class="org-responsibilities">${Array.isArray(cargo.responsabilidades) ? cargo.responsabilidades.join(', ') : cargo.responsabilidades}</div>
                      </div>
                      ${cargo.kpis && cargo.kpis.length > 0 ? `
                      <div class="org-section">
                        <div class="org-section-title">Indicadores (KPIs)</div>
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
        
        <div class="action-plan" style="margin-top: 32px;">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Organograma</div>
            <span class="action-plan-badge">Pessoas</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Comunicar estrutura para toda equipe</div>
                <div class="action-plan-detail">Reunião de apresentação: quem responde a quem, quais são as responsabilidades de cada um. Deixe claro "quem procurar para quê".</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar descrição de cargo formal para cada posição</div>
                <div class="action-plan-detail">Inclua: objetivo do cargo, responsabilidades detalhadas, competências necessárias, KPIs. Use para avaliações e contratações.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar reuniões 1:1 mensais</div>
                <div class="action-plan-detail">Cada gestor com seus subordinados diretos. Pauta: feedback de desempenho, evolução dos KPIs, desenvolvimento profissional, impedimentos.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== PROCESSOS ===== -->
      ${data.processos.lista.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">⚙️</span>
            Operações
          </div>
          <h2 class="section-title">Processos Operacionais</h2>
          <p class="section-description">Mapeamento dos processos-chave do negócio, suas frequências e responsáveis.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">📋</div>
            <span class="info-box-title">Por que documentar processos?</span>
          </div>
          <div class="info-box-text">
            <strong>Consistência:</strong> Todos fazem da mesma forma, mesmo resultado sempre.<br>
            <strong>Escalabilidade:</strong> Fácil treinar novos colaboradores. O conhecimento não depende de uma pessoa.<br>
            <strong>Melhoria contínua:</strong> Só é possível melhorar o que está documentado e medido.<br>
            <strong>Valor do negócio:</strong> Empresas com processos documentados valem mais em caso de venda.
          </div>
        </div>
        
        ${data.processos.lista.map(p => `
          <div class="process-card">
            <div class="process-header">
              <span class="process-name">${p.nome}</span>
              <span class="process-frequency">${p.frequencia}</span>
            </div>
            <div class="process-description">${p.descricao}</div>
            <div class="process-responsible">👤 ${p.responsavel}</div>
          </div>
        `).join('')}
        
        <div class="action-plan" style="margin-top: 32px;">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Processos</div>
            <span class="action-plan-badge">Eficiência</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar POPs (Procedimentos Operacionais Padrão)</div>
                <div class="action-plan-detail">Para cada processo listado, documente passo-a-passo: o que fazer, como fazer, ferramentas usadas, critérios de qualidade. Use Google Docs ou Notion.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar checklists para processos críticos</div>
                <div class="action-plan-detail">Identifique os 3 processos mais importantes e crie checklists que garantam que nada será esquecido. Revise e atualize trimestralmente.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar indicadores para cada processo</div>
                <div class="action-plan-detail">Exemplo: processo de vendas → taxa de conversão, tempo de ciclo. Processo financeiro → prazo médio de recebimento, inadimplência.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== FINANCEIRO ===== -->
      ${data.financeiro.faturamentoMensal > 0 || data.financeiro.faturamentoAtual > 0 || data.financeiro.margemLucro > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">💰</span>
            Finanças
          </div>
          <h2 class="section-title">Análise Financeira Completa</h2>
          <p class="section-description">Visão abrangente da saúde financeira, indicadores de desempenho e análise de endividamento.</p>
        </div>
        
        <!-- Indicadores Principais -->
        <div class="card" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <span class="card-title">Indicadores Principais</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0 ? `
            <div class="data-item">
              <div class="data-label">Faturamento Mensal</div>
              <div class="data-value" style="color: #16a34a;">${formatCurrency(data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)}</div>
            </div>
            ` : ''}
            ${(data.financeiro.despesasFixas > 0 || data.financeiro.despesasVariaveis > 0) ? `
            <div class="data-item">
              <div class="data-label">Despesas Totais</div>
              <div class="data-value" style="color: #dc2626;">${formatCurrency(data.financeiro.despesasFixas + data.financeiro.despesasVariaveis)}</div>
            </div>
            ` : ''}
            ${(data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0) && (data.financeiro.despesasFixas > 0 || data.financeiro.despesasVariaveis > 0) ? `
            <div class="data-item">
              <div class="data-label">Lucro Líquido Estimado</div>
              <div class="data-value" style="color: ${(data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) - data.financeiro.despesasFixas - data.financeiro.despesasVariaveis >= 0 ? '#16a34a' : '#dc2626'};">
                ${formatCurrency((data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) - data.financeiro.despesasFixas - data.financeiro.despesasVariaveis)}
              </div>
            </div>
            ` : ''}
            ${data.financeiro.margemLucro > 0 || data.financeiro.margemAtual > 0 ? `
            <div class="data-item">
              <div class="data-label">Margem de Lucro</div>
              <div class="data-value" style="color: ${(data.financeiro.margemLucro || data.financeiro.margemAtual) >= 20 ? '#16a34a' : (data.financeiro.margemLucro || data.financeiro.margemAtual) >= 10 ? '#ea580c' : '#dc2626'};">
                ${data.financeiro.margemLucro || data.financeiro.margemAtual}%
              </div>
            </div>
            ` : ''}
            ${data.financeiro.pontoEquilibrio > 0 ? `
            <div class="data-item">
              <div class="data-label">Ponto de Equilíbrio</div>
              <div class="data-value">${formatCurrency(data.financeiro.pontoEquilibrio)}</div>
            </div>
            ` : ''}
            ${data.financeiro.metaFaturamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Meta de Faturamento</div>
              <div class="data-value" style="color: #7c3aed;">${formatCurrency(data.financeiro.metaFaturamento)}</div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Indicadores de Clientes -->
        ${(data.financeiro.ticketMedio > 0 || data.financeiro.quantidadeClientes > 0 || data.financeiro.cac > 0 || data.financeiro.ltv > 0) ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">👥</div>
            <span class="card-title">Indicadores de Clientes</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.quantidadeClientes > 0 ? `
            <div class="data-item">
              <div class="data-label">Clientes Ativos</div>
              <div class="data-value">${data.financeiro.quantidadeClientes}</div>
            </div>
            ` : ''}
            ${data.financeiro.ticketMedio > 0 ? `
            <div class="data-item">
              <div class="data-label">Ticket Médio</div>
              <div class="data-value">${formatCurrency(data.financeiro.ticketMedio)}</div>
            </div>
            ` : ''}
            ${data.financeiro.cac > 0 ? `
            <div class="data-item">
              <div class="data-label">CAC (Custo de Aquisição)</div>
              <div class="data-value">${formatCurrency(data.financeiro.cac)}</div>
            </div>
            ` : ''}
            ${data.financeiro.ltv > 0 ? `
            <div class="data-item">
              <div class="data-label">LTV (Lifetime Value)</div>
              <div class="data-value">${formatCurrency(data.financeiro.ltv)}</div>
            </div>
            ` : ''}
            ${data.financeiro.cac > 0 && data.financeiro.ltv > 0 ? `
            <div class="data-item">
              <div class="data-label">Ratio LTV/CAC</div>
              <div class="data-value" style="color: ${(data.financeiro.ltv / data.financeiro.cac) >= 3 ? '#16a34a' : '#ea580c'};">
                ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x
              </div>
            </div>
            ` : ''}
          </div>
          ${data.financeiro.cac > 0 && data.financeiro.ltv > 0 ? `
          <div class="insight-box" style="margin-top: 16px;">
            <div class="insight-box-title">💡 Análise LTV/CAC</div>
            <div class="insight-box-text">
              ${(data.financeiro.ltv / data.financeiro.cac) >= 3 
                ? `<strong style="color: #16a34a;">Excelente!</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x indica que cada real investido em aquisição retorna mais de 3x em valor ao longo do tempo. Continue investindo em aquisição.`
                : (data.financeiro.ltv / data.financeiro.cac) >= 2
                  ? `<strong style="color: #ea580c;">Atenção:</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x está abaixo do ideal (3x). Trabalhe para aumentar o LTV (upsell, retenção) ou reduzir o CAC.`
                  : `<strong style="color: #dc2626;">Crítico:</strong> O ratio de ${(data.financeiro.ltv / data.financeiro.cac).toFixed(1)}x é insustentável. Revise urgentemente sua estratégia de aquisição e retenção de clientes.`}
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- Fluxo de Caixa e Liquidez -->
        ${(data.financeiro.prazoMedioRecebimento > 0 || data.financeiro.prazoMedioPagamento > 0 || data.financeiro.capitalGiro > 0 || data.financeiro.reservaEmergencia > 0) ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">💵</div>
            <span class="card-title">Fluxo de Caixa e Liquidez</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.prazoMedioRecebimento > 0 ? `
            <div class="data-item">
              <div class="data-label">Prazo Médio Recebimento</div>
              <div class="data-value">${data.financeiro.prazoMedioRecebimento} dias</div>
            </div>
            ` : ''}
            ${data.financeiro.prazoMedioPagamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Prazo Médio Pagamento</div>
              <div class="data-value">${data.financeiro.prazoMedioPagamento} dias</div>
            </div>
            ` : ''}
            ${data.financeiro.prazoMedioRecebimento > 0 && data.financeiro.prazoMedioPagamento > 0 ? `
            <div class="data-item">
              <div class="data-label">Ciclo Financeiro</div>
              <div class="data-value" style="color: ${(data.financeiro.prazoMedioRecebimento - data.financeiro.prazoMedioPagamento) <= 0 ? '#16a34a' : '#ea580c'};">
                ${data.financeiro.prazoMedioRecebimento - data.financeiro.prazoMedioPagamento} dias
              </div>
            </div>
            ` : ''}
            ${data.financeiro.capitalGiro > 0 ? `
            <div class="data-item">
              <div class="data-label">Capital de Giro</div>
              <div class="data-value">${formatCurrency(data.financeiro.capitalGiro)}</div>
            </div>
            ` : ''}
            ${data.financeiro.reservaEmergencia > 0 ? `
            <div class="data-item">
              <div class="data-label">Reserva de Emergência</div>
              <div class="data-value">${formatCurrency(data.financeiro.reservaEmergencia)}</div>
            </div>
            ` : ''}
            ${data.financeiro.reservaEmergencia > 0 && data.financeiro.despesasFixas > 0 ? `
            <div class="data-item">
              <div class="data-label">Meses de Reserva</div>
              <div class="data-value" style="color: ${(data.financeiro.reservaEmergencia / data.financeiro.despesasFixas) >= 6 ? '#16a34a' : (data.financeiro.reservaEmergencia / data.financeiro.despesasFixas) >= 3 ? '#ea580c' : '#dc2626'};">
                ${(data.financeiro.reservaEmergencia / data.financeiro.despesasFixas).toFixed(1)}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        <!-- Endividamento -->
        ${(data.financeiro.dividas && data.financeiro.dividas.length > 0) || data.financeiro.totalDividas > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #dc2626;">
          <div class="card-header">
            <div class="card-icon">💳</div>
            <span class="card-title">Análise de Endividamento</span>
          </div>
          <div class="data-grid">
            ${data.financeiro.totalDividas > 0 ? `
            <div class="data-item">
              <div class="data-label">Total de Dívidas</div>
              <div class="data-value" style="color: #dc2626;">${formatCurrency(data.financeiro.totalDividas)}</div>
            </div>
            ` : ''}
            ${data.financeiro.dividas && data.financeiro.dividas.length > 0 ? `
            <div class="data-item">
              <div class="data-label">Parcelas Mensais</div>
              <div class="data-value" style="color: #ea580c;">
                ${formatCurrency(data.financeiro.dividas.reduce((acc: number, d: any) => acc + (d.parcelasMensais || 0), 0))}
              </div>
            </div>
            ` : ''}
            ${data.financeiro.comprometimentoReceita > 0 ? `
            <div class="data-item">
              <div class="data-label">Comprometimento da Receita</div>
              <div class="data-value" style="color: ${data.financeiro.comprometimentoReceita > 30 ? '#dc2626' : data.financeiro.comprometimentoReceita > 15 ? '#ea580c' : '#16a34a'};">
                ${data.financeiro.comprometimentoReceita}%
              </div>
            </div>
            ` : ''}
          </div>
          
          ${data.financeiro.dividas && data.financeiro.dividas.length > 0 ? `
          <div class="table-container" style="margin-top: 16px;">
            <table class="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor Total</th>
                  <th>Parcela Mensal</th>
                  <th>Parcelas Restantes</th>
                  <th>Taxa de Juros</th>
                </tr>
              </thead>
              <tbody>
                ${data.financeiro.dividas.map((d: any) => `
                <tr>
                  <td><strong>${d.descricao}</strong></td>
                  <td>${formatCurrency(d.valorTotal)}</td>
                  <td>${formatCurrency(d.parcelasMensais)}</td>
                  <td>${d.parcelasRestantes}x</td>
                  <td>${d.taxaJuros}% a.m.</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          ${data.financeiro.comprometimentoReceita > 15 ? `
          <div class="insight-box" style="margin-top: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);">
            <div class="insight-box-title" style="color: #dc2626;">⚠️ Alerta de Endividamento</div>
            <div class="insight-box-text">
              ${data.financeiro.comprometimentoReceita > 30 
                ? `<strong>Nível crítico!</strong> Com ${data.financeiro.comprometimentoReceita}% da receita comprometida com dívidas, o fluxo de caixa está severamente impactado. Priorize: renegociação de dívidas, consolidação em taxas menores e aumento de receita.`
                : `<strong>Atenção requerida:</strong> ${data.financeiro.comprometimentoReceita}% de comprometimento está acima do ideal (15%). Considere refinanciar dívidas de maior taxa e criar plano de quitação antecipada.`}
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- Análise Geral -->
        ${(data.financeiro.faturamentoAtual > 0 || data.financeiro.faturamentoMensal > 0) && (data.financeiro.margemLucro > 0 || data.financeiro.margemAtual > 0) ? `
        <div class="insight-box" style="margin-bottom: 24px;">
          <div class="insight-box-title">💡 Diagnóstico Financeiro</div>
          <div class="insight-box-text">
            <strong>Lucro líquido estimado: ${formatCurrency((data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) * (data.financeiro.margemLucro || data.financeiro.margemAtual) / 100)}/mês</strong><br><br>
            ${(data.financeiro.margemLucro || data.financeiro.margemAtual) < 10 
              ? '🔴 <strong>Margem crítica:</strong> Abaixo de 10% compromete a sustentabilidade. Ações urgentes: revisar precificação, cortar custos não essenciais, renegociar com fornecedores.'
              : (data.financeiro.margemLucro || data.financeiro.margemAtual) < 20
                ? '🟡 <strong>Margem moderada:</strong> Há espaço para otimização. Foque em: eficiência operacional, automação de processos e estratégias de valor agregado.'
                : '🟢 <strong>Margem saudável:</strong> Continue otimizando e reinvista parte do lucro em crescimento sustentável.'}
            ${data.financeiro.metaFaturamento > 0 && (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal) < data.financeiro.metaFaturamento 
              ? `<br><br>📈 <strong>Gap para meta:</strong> ${formatCurrency(data.financeiro.metaFaturamento - (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal))} (${(((data.financeiro.metaFaturamento - (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)) / (data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal)) * 100).toFixed(0)}% de crescimento necessário)`
              : ''}
          </div>
        </div>
        ` : ''}
        
        <!-- Riscos Identificados -->
        ${data.financeiro.riscos && data.financeiro.riscos.length > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #ea580c;">
          <div class="card-header">
            <div class="card-icon">⚠️</div>
            <span class="card-title">Riscos Financeiros Identificados</span>
          </div>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.financeiro.riscos.map((r: string) => `<li style="padding: 8px 0; color: #374151;">${r}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <!-- Oportunidades -->
        ${data.financeiro.oportunidades && data.financeiro.oportunidades.length > 0 ? `
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid #16a34a;">
          <div class="card-header">
            <div class="card-icon">💡</div>
            <span class="card-title">Oportunidades de Melhoria Financeira</span>
          </div>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.financeiro.oportunidades.map((o: string) => `<li style="padding: 8px 0; color: #374151;">${o}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <!-- Investimentos -->
        ${data.financeiro.investimentos && data.financeiro.investimentos.length > 0 ? `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-icon">📈</div>
            <span class="card-title">Investimentos Planejados</span>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Valor</th>
                  <th>Prazo</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                ${data.financeiro.investimentos.map((inv: any) => `
                  <tr>
                    <td><strong>${inv.area}</strong></td>
                    <td>${formatCurrency(inv.valor)}</td>
                    <td>${inv.prazo}</td>
                    <td><span class="priority priority-${inv.prioridade.toLowerCase()}">${inv.prioridade}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
        
        <!-- Plano de Ação -->
        <div class="action-plan" style="margin-top: 32px;">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Financeiro</div>
            <span class="action-plan-badge">Saúde Financeira</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar DRE mensal gerencial</div>
                <div class="action-plan-detail">Feche o mês até dia 5 e analise: receita, custos variáveis, margem de contribuição, custos fixos e lucro líquido. Decisões sem DRE são tiros no escuro.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Monitorar indicadores-chave semanalmente</div>
                <div class="action-plan-detail">CAC, LTV, ticket médio, inadimplência, ciclo financeiro. Monte um dashboard simples e revise toda segunda-feira. O que não é medido não é gerenciado.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar reserva de emergência empresarial</div>
                <div class="action-plan-detail">Meta: 6 meses de custos fixos. Separe 10% do lucro mensalmente. Isso permite tomar decisões de longo prazo sem pressão de caixa.</div>
              </div>
            </li>
            ${data.financeiro.comprometimentoReceita > 15 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">4</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Renegociar e consolidar dívidas</div>
                <div class="action-plan-detail">Priorize quitar dívidas de maior taxa. Considere consolidação em linha de crédito mais barata. Meta: comprometimento abaixo de 15% da receita.</div>
              </div>
            </li>
            ` : ''}
            ${data.financeiro.cac > 0 && data.financeiro.ltv > 0 && (data.financeiro.ltv / data.financeiro.cac) < 3 ? `
            <li class="action-plan-item">
              <span class="action-plan-number">${data.financeiro.comprometimentoReceita > 15 ? '5' : '4'}</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Melhorar ratio LTV/CAC</div>
                <div class="action-plan-detail">Para aumentar LTV: programas de fidelização, upsell, cross-sell. Para reduzir CAC: refine o ICP, melhore conversão, foque em canais orgânicos.</div>
              </div>
            </li>
            ` : ''}
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== SWOT PESSOAL ===== -->
      ${data.swotPessoal && (data.swotPessoal.forcas.length > 0 || data.swotPessoal.fraquezas.length > 0) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">👤</span>
            Líder
          </div>
          <h2 class="section-title">SWOT Pessoal do Líder</h2>
          <p class="section-description">Análise das forças, fraquezas, oportunidades e ameaças do líder/empreendedor como pessoa.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">
            <div class="info-box-icon">🎯</div>
            <span class="info-box-title">Por que fazer SWOT Pessoal?</span>
          </div>
          <div class="info-box-text">
            O desempenho da empresa é diretamente ligado ao desenvolvimento do líder. Empresas pequenas/médias são um espelho do seu fundador.
            Conhecer suas forças permite potencializá-las; conhecer fraquezas permite compensá-las (delegando, contratando ou desenvolvendo).
          </div>
        </div>
        
        <div class="swot-grid">
          <div class="swot-box swot-forcas">
            <div class="swot-header">
              <div class="swot-icon">💪</div>
              <span class="swot-title">Forças Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.forcas.length > 0 ? data.swotPessoal.forcas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-fraquezas">
            <div class="swot-header">
              <div class="swot-icon">⚠️</div>
              <span class="swot-title">Fraquezas Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.fraquezas.length > 0 ? data.swotPessoal.fraquezas.map(f => `• ${f}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-oportunidades">
            <div class="swot-header">
              <div class="swot-icon">🚀</div>
              <span class="swot-title">Oportunidades de Desenvolvimento</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.oportunidades.length > 0 ? data.swotPessoal.oportunidades.map(o => `• ${o}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
          
          <div class="swot-box swot-ameacas">
            <div class="swot-header">
              <div class="swot-icon">⚡</div>
              <span class="swot-title">Ameaças/Riscos Pessoais</span>
            </div>
            <div class="swot-list">
              ${data.swotPessoal.ameacas.length > 0 ? data.swotPessoal.ameacas.map(a => `• ${a}`).join('<br>') : 'Não identificadas'}
            </div>
          </div>
        </div>
        
        ${data.swotPessoal.fraquezas.length > 0 ? `
        <div class="implementation-guide" style="margin-top: 32px;">
          <div class="implementation-header">
            <div class="implementation-icon">🛠️</div>
            <span class="implementation-title">Plano de desenvolvimento para fraquezas</span>
          </div>
          <div class="implementation-steps">
            ${data.swotPessoal.fraquezas.slice(0, 3).map((fraq, i) => `
            <div class="implementation-step">
              <div class="implementation-step-number">${i + 1}</div>
              <div class="implementation-step-content">
                <h4>Fraqueza: "${fraq}"</h4>
                <p><strong>Opção A - Desenvolver:</strong> Busque curso, mentoria ou coaching específico. Dedique 1h/semana nos próximos 3 meses.<br>
                <strong>Opção B - Delegar:</strong> Contrate ou designe alguém que tenha esta como força. Libere-se para focar no que faz bem.</p>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Desenvolvimento Pessoal</div>
            <span class="action-plan-badge">Liderança</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Buscar feedback 360° com equipe e clientes</div>
                <div class="action-plan-detail">Pergunte: "O que eu faço bem? O que eu poderia melhorar? O que eu deveria parar de fazer?" Faça anotações e compare com sua autoavaliação.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Definir 1 competência para desenvolver no trimestre</div>
                <div class="action-plan-detail">Escolha a fraqueza que mais impacta o negócio. Defina ações: curso, livro, mentoria. Avalie progresso mensalmente.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Criar rotina de autocuidado</div>
                <div class="action-plan-detail">Empreendedor exausto toma decisões ruins. Defina: exercício 3x/semana, 7h+ de sono, 1 dia de folga real por semana. Energia é recurso estratégico.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== AGENDA CEO ===== -->
      ${data.agendaCEO && (data.agendaCEO.prioridades.length > 0 || (data.agendaCEO.rotinas && data.agendaCEO.rotinas.length > 0)) ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📅</span>
            Gestão do Tempo
          </div>
          <h2 class="section-title">Agenda Estratégica do CEO</h2>
          <p class="section-description">Prioridades, rotinas e delegações definidas para maximizar o impacto do líder no negócio.</p>
        </div>
        
        ${data.agendaCEO.prioridades.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">Prioridades Estratégicas</span>
          </div>
          <ul class="list">
            ${data.agendaCEO.prioridades.map((p, i) => `
              <li class="list-item">
                <span style="width: 28px; height: 28px; background: var(--foreground); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">${i + 1}</span>
                <span>${typeof p === 'string' ? p : p.descricao}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="insight-box">
          <div class="insight-box-title">💡 Regra do CEO: Foco implacável</div>
          <div class="insight-box-text">
            Como CEO/líder, você deve dedicar <strong>80% do seu tempo</strong> às ${Math.min(3, data.agendaCEO.prioridades.length)} prioridades acima.<br><br>
            Tudo que não está nesta lista é <strong>delegável</strong>. Cada hora gasta em atividades fora das prioridades é uma hora roubada do crescimento da empresa.
          </div>
        </div>
        ` : ''}
        
        ${data.agendaCEO.rotinas && data.agendaCEO.rotinas.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🔄</div>
            <span class="card-title">Rotinas de Gestão</span>
          </div>
          ${data.agendaCEO.rotinas.map(r => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border);">
              <div>
                <div style="font-weight: 600; color: var(--foreground);">${r.atividade}</div>
                <div style="font-size: 12px; color: var(--muted);">Frequência: ${r.frequencia}</div>
              </div>
              <span class="tag">${r.dia || 'A definir'}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${data.agendaCEO.delegacoes && data.agendaCEO.delegacoes.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <div class="card-icon">🤝</div>
            <span class="card-title">Delegações Definidas</span>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Delegado para</th>
                </tr>
              </thead>
              <tbody>
                ${data.agendaCEO.delegacoes.map(d => `
                  <tr>
                    <td>${d.atividade}</td>
                    <td><strong>${d.para}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="suggestion-box">
          <div class="suggestion-header">
            <div class="suggestion-icon">🎓</div>
            <span class="suggestion-title">Como delegar efetivamente</span>
          </div>
          <div class="suggestion-text">
            <strong>1. Delegue resultados, não tarefas:</strong> "Quero o relatório pronto até sexta" ao invés de "Faça X, depois Y, depois Z".<br><br>
            <strong>2. Dê contexto:</strong> Explique por que aquilo é importante. Pessoas motivadas entregam melhor.<br><br>
            <strong>3. Defina critérios de sucesso:</strong> O que significa "bem feito"? Evite retrabalho definindo antes.<br><br>
            <strong>4. Check-ins, não microgerenciamento:</strong> Combine pontos de verificação, não fique em cima a cada hora.
          </div>
        </div>
        ` : ''}
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📅</div>
            <div>
              <div class="visual-example-title">Modelo: Semana Ideal do CEO</div>
              <div class="visual-example-subtitle">Estrutura sugerida para máxima produtividade</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; font-size: 11px;">
              <div style="background: var(--primary-lighter); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">Segunda</div>
                <div style="color: var(--foreground);">🎯 Planejamento<br>📊 Revisão métricas<br>📞 1:1s equipe</div>
              </div>
              <div style="background: var(--accent-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--accent); margin-bottom: 8px;">Terça</div>
                <div style="color: var(--foreground);">💼 Clientes<br>🤝 Parceiros<br>📈 Vendas</div>
              </div>
              <div style="background: var(--gold-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--gold); margin-bottom: 8px;">Quarta</div>
                <div style="color: var(--foreground);">🧠 Deep work<br>📝 Estratégia<br>🚫 Sem reuniões</div>
              </div>
              <div style="background: var(--accent-light); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--accent); margin-bottom: 8px;">Quinta</div>
                <div style="color: var(--foreground);">💼 Clientes<br>🎓 Treinamento<br>🔧 Operacional</div>
              </div>
              <div style="background: var(--primary-lighter); padding: 12px 8px; border-radius: 8px;">
                <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">Sexta</div>
                <div style="color: var(--foreground);">📋 Revisão semana<br>🎯 Próxima semana<br>🎉 Celebrações</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-plan">
          <div class="action-plan-header">
            <div class="action-plan-title">📋 Plano de Ação - Agenda CEO</div>
            <span class="action-plan-badge">Produtividade</span>
          </div>
          <ul class="action-plan-list">
            <li class="action-plan-item">
              <span class="action-plan-number">1</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Bloquear tempo para prioridades no calendário</div>
                <div class="action-plan-detail">Reserve blocos de 2-3h para trabalho focado nas prioridades. Marque como "ocupado". Proteja esse tempo como uma reunião com o cliente mais importante.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">2</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Implementar "No Meeting Wednesday"</div>
                <div class="action-plan-detail">Um dia por semana sem reuniões para trabalho estratégico profundo. Comunique para equipe e respeite o combinado.</div>
              </div>
            </li>
            <li class="action-plan-item">
              <span class="action-plan-number">3</span>
              <div class="action-plan-content">
                <div class="action-plan-text">Fazer auditoria de tempo por 1 semana</div>
                <div class="action-plan-detail">Anote tudo que faz e quanto tempo gasta. Depois analise: quanto foi em prioridades? Quanto poderia delegar? Ajuste agenda baseado nos dados.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- ===== SUMÁRIO EXECUTIVO ===== -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">📋</span>
            Conclusão
          </div>
          <h2 class="section-title">Sumário Executivo e Próximos Passos</h2>
          <p class="section-description">Visão consolidada das principais descobertas e ações prioritárias para os próximos 90 dias.</p>
        </div>
        
        <div class="visual-example">
          <div class="visual-example-header">
            <div class="visual-example-icon">📊</div>
            <div>
              <div class="visual-example-title">Panorama Geral</div>
              <div class="visual-example-subtitle">Status atual da ${project.nomeEmpresa}</div>
            </div>
          </div>
          <div class="visual-example-content">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${overallProgress}%</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Diagnóstico Completo</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${avgMaturity}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Maturidade Média</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${blocks.filter(b => b.progress === 100).length}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Blocos Completos</div>
              </div>
              <div style="padding: 20px; background: var(--background); border-radius: 12px;">
                <div style="font-size: 32px; font-weight: 900; color: var(--primary);">${blocks.length}</div>
                <div style="font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">Total de Blocos</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card" style="background: var(--foreground); color: white; border: none; margin-top: 40px;">
          <div style="text-align: center; padding: 32px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 16px;">Top 5 Ações Prioritárias</div>
            <div style="font-size: 15px; text-align: left; max-width: 600px; margin: 0 auto; line-height: 1.8;">
              <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px;">
                <span style="background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 600;">1</span>
                <span>Validar e comunicar Golden Circle + Identidade para toda equipe</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px;">
                <span style="background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 600;">2</span>
                <span>Implementar uma estratégia de precificação em pelo menos 1 produto</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px;">
                <span style="background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 600;">3</span>
                <span>Criar material comercial baseado no ICP e diferenciais competitivos</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px;">
                <span style="background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 600;">4</span>
                <span>Documentar os 5 processos mais críticos do negócio</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <span style="background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 600;">5</span>
                <span>Implementar dashboard de métricas e reunião semanal de acompanhamento</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Lembre-se</div>
          <div class="insight-box-text">
            Este documento é um <strong>ponto de partida</strong>, não um ponto final. A execução disciplinada das ações propostas é o que transforma diagnóstico em resultado.<br><br>
            <strong>Sugestão:</strong> Revise este documento mensalmente. Marque o que foi feito, ajuste o que precisa e comemore as vitórias.
          </div>
        </div>
      </div>
      
      <!-- ===== MASTER CHECKLIST ===== -->
      <div class="section page-break">
        <div class="section-header">
          <div class="section-badge">
            <span class="section-icon">✅</span>
            Checklist Completo
          </div>
          <h2 class="section-title">Plano de Ação Consolidado</h2>
          <p class="section-description">Todos os itens de ação identificados ao longo do diagnóstico, organizados por categoria. Clique nas caixas para marcar itens concluídos.</p>
        </div>
        
        <div class="master-checklist">
          <!-- Diagnóstico de Maturidade -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">📊</span>
              Diagnóstico de Maturidade
            </div>
            <div class="checklist-items">
              ${generateActionPlan('pessoas', data.diagnostico.pessoas.level).map((action, i) => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">${action}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Pessoas</span>
                      ${i === 0 ? '<span class="checklist-tag checklist-tag-priority">Prioritário</span>' : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
              ${generateActionPlan('processos', data.diagnostico.processos.level).map((action, i) => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">${action}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Processos</span>
                      ${i === 0 ? '<span class="checklist-tag checklist-tag-priority">Prioritário</span>' : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
              ${generateActionPlan('financas', data.diagnostico.financas.level).map((action, i) => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">${action}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Finanças</span>
                      ${i === 0 ? '<span class="checklist-tag checklist-tag-priority">Prioritário</span>' : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
              ${generateActionPlan('mercado', data.diagnostico.mercado.level).map((action, i) => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">${action}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Mercado</span>
                      ${i === 0 ? '<span class="checklist-tag checklist-tag-priority">Prioritário</span>' : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Golden Circle & Identidade -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">🎯</span>
              Propósito & Identidade
            </div>
            <div class="checklist-items">
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Comunicar o Golden Circle para toda a equipe</div>
                  <div class="checklist-detail">Por Quê: ${data.goldenCircle.why?.substring(0, 100) || 'Definir propósito'}...</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Validar missão e visão com stakeholders</div>
                  <div class="checklist-detail">Missão: ${data.identidade.missao?.substring(0, 80) || 'Definir missão'}...</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Documentar e divulgar valores organizacionais</div>
                  <div class="checklist-detail">Valores definidos: ${data.identidade.valores?.length || 0} valores</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Criar material visual do Golden Circle para escritório</div>
                  <div class="checklist-meta">
                    <span class="checklist-tag checklist-tag-category">Cultura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Estratégia Comercial -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">💼</span>
              Estratégia Comercial
            </div>
            <div class="checklist-items">
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Criar persona documentada do ICP</div>
                  <div class="checklist-detail">Características: ${data.icp.caracteristicasDemograficas?.substring(0, 80) || 'A definir'}...</div>
                  <div class="checklist-meta">
                    <span class="checklist-tag checklist-tag-priority">Prioritário</span>
                  </div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Desenvolver script de vendas baseado nas dores do ICP</div>
                  <div class="checklist-detail">Dores identificadas: ${data.icp.dores?.slice(0, 3).join(', ').substring(0, 80) || 'A definir'}...</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Implementar estratégia de precificação por valor</div>
                  <div class="checklist-detail">Estratégia: ${data.precificacao.estrategia?.substring(0, 80) || 'A definir'}...</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Criar material de diferenciação competitiva</div>
                  <div class="checklist-detail">Concorrentes mapeados: ${data.concorrentes.principais?.length || data.concorrentes.concorrentes?.length || 0}</div>
                </div>
              </div>
              ${data.estrategiasValor.novasOfertas?.slice(0, 3).map(oferta => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Lançar nova oferta: ${oferta}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Produto</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Motores de Crescimento -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">🚀</span>
              Motores de Crescimento
            </div>
            <div class="checklist-items">
              ${data.motoresCrescimento.motoresPrincipais?.slice(0, 3).map(motor => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Implementar motor: ${motor}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Crescimento</span>
                    </div>
                  </div>
                </div>
              `).join('') || ''}
              ${data.motoresCrescimento.metricas?.slice(0, 3).map(metrica => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Atingir meta: ${metrica.nome}</div>
                    <div class="checklist-detail">Meta: ${metrica.meta}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Métrica</span>
                    </div>
                  </div>
                </div>
              `).join('') || `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Definir motores de crescimento prioritários</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-priority">Prioritário</span>
                    </div>
                  </div>
                </div>
              `}
            </div>
          </div>
          
          <!-- Organização & Processos -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">📋</span>
              Organização & Processos
            </div>
            <div class="checklist-items">
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Atualizar e comunicar organograma</div>
                  <div class="checklist-detail">Cargos definidos: ${data.organograma.cargos?.length || 0}</div>
                </div>
              </div>
              ${data.processos.processos?.slice(0, 3).map(processo => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Documentar processo: ${processo.nome}</div>
                    <div class="checklist-detail">Responsável: ${processo.responsavel} | Frequência: ${processo.frequencia}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Processo</span>
                    </div>
                  </div>
                </div>
              `).join('') || ''}
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Implementar reunião semanal de acompanhamento</div>
                  <div class="checklist-meta">
                    <span class="checklist-tag checklist-tag-priority">Prioritário</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Financeiro -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">💰</span>
              Gestão Financeira
            </div>
            <div class="checklist-items">
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Implementar controle de fluxo de caixa semanal</div>
                  <div class="checklist-meta">
                    <span class="checklist-tag checklist-tag-priority">Prioritário</span>
                  </div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Criar DRE mensal gerencial</div>
                  <div class="checklist-detail">Faturamento atual: ${formatCurrency(data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal || 0)}</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Calcular e monitorar ponto de equilíbrio</div>
                  <div class="checklist-detail">Margem atual: ${data.financeiro.margemAtual || data.financeiro.margemLucro || 0}%</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Revisar estrutura de custos fixos e variáveis</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- SWOT Pessoal & Agenda CEO -->
          <div class="checklist-category">
            <div class="checklist-category-header">
              <span class="checklist-category-icon">👤</span>
              Desenvolvimento do Líder
            </div>
            <div class="checklist-items">
              ${data.swotPessoal.forcas?.slice(0, 2).map(forca => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Potencializar força: ${forca}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Força Pessoal</span>
                    </div>
                  </div>
                </div>
              `).join('') || ''}
              ${data.swotPessoal.fraquezas?.slice(0, 2).map(fraqueza => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Desenvolver: ${fraqueza}</div>
                    <div class="checklist-detail">Considerar treinamento, mentoria ou delegação</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-priority">Desenvolvimento</span>
                    </div>
                  </div>
                </div>
              `).join('') || ''}
              ${(data.agendaCEO.prioridades || []).slice(0, 3).map(p => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"></div>
                  <div class="checklist-content">
                    <div class="checklist-text">Prioridade CEO: ${typeof p === 'string' ? p : p.descricao}</div>
                    <div class="checklist-meta">
                      <span class="checklist-tag checklist-tag-category">Agenda CEO</span>
                    </div>
                  </div>
                </div>
              `).join('') || ''}
              <div class="checklist-item">
                <div class="checklist-checkbox"></div>
                <div class="checklist-content">
                  <div class="checklist-text">Bloquear tempo para trabalho estratégico na agenda</div>
                  <div class="checklist-detail">Mínimo 4h semanais para pensar no negócio, não só no operacional</div>
                  <div class="checklist-meta">
                    <span class="checklist-tag checklist-tag-priority">Prioritário</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="insight-box" style="margin-top: 32px;">
          <div class="insight-box-title">💡 Como usar este checklist</div>
          <div class="insight-box-text">
            <strong>1. Priorize:</strong> Comece pelos itens marcados como "Prioritário" - são os que geram mais impacto.<br><br>
            <strong>2. Agende:</strong> Defina datas específicas para cada ação. O que não está na agenda, não acontece.<br><br>
            <strong>3. Delegue:</strong> Identifique quais itens podem ser delegados e para quem.<br><br>
            <strong>4. Acompanhe:</strong> Revise este checklist semanalmente na sua reunião de gestão.<br><br>
            <strong>5. Celebre:</strong> Reconheça as conquistas! Cada item concluído é progresso real.
          </div>
        </div>
      </div>
      
    </div>
    
    <!-- ===== FOOTER ===== -->
    <div class="footer">
      <div class="footer-logo">📊</div>
      <div class="footer-title">Plano de Estruturação em Gestão</div>
      <div class="footer-text">${project.nomeEmpresa} | Documento Estratégico Confidencial</div>
      <div class="footer-date">Gerado em ${formatDate(new Date().toISOString())}</div>
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
