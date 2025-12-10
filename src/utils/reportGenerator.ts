import { ConsultingData, BlockStatus, Project } from '@/types/consulting';

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
            Este mapeamento permite identificar prioridades de atuação e direcionar esforços de forma estratégica.
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
      </div>
      
      <!-- Identidade Organizacional -->
      ${data.identidade.visao || data.identidade.missao || data.identidade.valores.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🎯</div>
          <h2 class="section-title">Identidade Organizacional</h2>
          <p class="section-description">Os pilares que definem quem somos, aonde queremos chegar e o que nos guia.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 Por que a Identidade é importante?</div>
          <div class="info-box-text">
            A identidade organizacional é o DNA da empresa. A <strong>Visão</strong> indica o destino almejado a longo prazo. 
            A <strong>Missão</strong> define o propósito de existência da empresa e sua contribuição para o mundo.
            Os <strong>Valores</strong> são os princípios inegociáveis que guiam todas as decisões e comportamentos.
            O <strong>Posicionamento</strong> é como a empresa deseja ser percebida no mercado.
          </div>
        </div>
        
        ${data.identidade.visao ? `
        <div class="card">
          <div class="card-title">🔭 Visão de Futuro</div>
          <div class="card-content">${data.identidade.visao}</div>
        </div>
        ` : ''}
        
        ${data.identidade.missao ? `
        <div class="card">
          <div class="card-title">🎯 Missão</div>
          <div class="card-content">${data.identidade.missao}</div>
        </div>
        ` : ''}
        
        ${data.identidade.valores.length > 0 ? `
        <div class="card">
          <div class="card-title">💎 Valores Organizacionais</div>
          <div class="tags">
            ${data.identidade.valores.map(v => `<span class="tag">${v}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.identidade.posicionamento ? `
        <div class="card">
          <div class="card-title">📍 Posicionamento de Mercado</div>
          <div class="card-content">${data.identidade.posicionamento}</div>
        </div>
        ` : ''}
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
        
        <div class="info-box">
          <div class="info-box-title">💡 Entendendo o Golden Circle</div>
          <div class="info-box-text">
            Desenvolvido por Simon Sinek, o Golden Circle propõe que empresas inspiradoras comunicam de dentro para fora:
            <strong>WHY (Por quê)</strong> - O propósito, causa ou crença que move a empresa.
            <strong>HOW (Como)</strong> - Os processos e diferenciais que tornam o "por quê" uma realidade.
            <strong>WHAT (O quê)</strong> - Os produtos ou serviços que a empresa oferece.
            Pessoas não compram O QUE você faz, compram POR QUE você faz.
          </div>
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
        
        <div class="info-box">
          <div class="info-box-title">💡 O que é o ICP?</div>
          <div class="info-box-text">
            O Ideal Customer Profile (ICP) é a descrição detalhada do cliente perfeito para o seu negócio.
            Conhecer profundamente suas <strong>dores</strong> (problemas e frustrações), <strong>desejos</strong> (aspirações e objetivos) 
            e <strong>comportamento</strong> permite criar ofertas irresistíveis e comunicação assertiva.
            Vender para o cliente errado gera desperdício de recursos e frustrações para ambos os lados.
          </div>
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
        
        <div class="info-box">
          <div class="info-box-title">💡 Por que analisar concorrentes?</div>
          <div class="info-box-text">
            Conhecer os concorrentes permite identificar lacunas de mercado, aprender com erros e acertos de outros 
            e posicionar-se de forma diferenciada. A análise revela pontos fortes a serem neutralizados e pontos fracos 
            que podem ser explorados como oportunidade de diferenciação.
          </div>
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
        ` : ''}
        
        ${data.concorrentes.diferenciais.length > 0 ? `
        <div class="card" style="margin-top: 20px;">
          <div class="card-title">⭐ Nossos Diferenciais Competitivos</div>
          <div class="tags">
            ${data.concorrentes.diferenciais.map(d => `<span class="tag tag-accent">${d}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.concorrentes.propostaValor ? `
        <div class="card">
          <div class="card-title">💎 Proposta de Valor Única</div>
          <div class="card-content">${data.concorrentes.propostaValor}</div>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      <!-- Estratégias de Valor -->
      ${data.estrategiasValor.novasOfertas.length > 0 || data.estrategiasValor.pacotes.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">💡</div>
          <h2 class="section-title">Estratégias de Valor</h2>
          <p class="section-description">Novas ofertas e formas de agregar valor aos clientes.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 Criando Valor Adicional</div>
          <div class="info-box-text">
            Estratégias de valor envolvem criar novas ofertas, serviços complementares e pacotes que aumentam 
            o ticket médio e a percepção de valor pelo cliente. O objetivo é maximizar o valor entregue 
            enquanto aumenta a rentabilidade do negócio através de upselling e cross-selling inteligentes.
          </div>
        </div>
        
        ${data.estrategiasValor.novasOfertas.length > 0 ? `
        <div class="card">
          <div class="card-title">🚀 Novas Ofertas Planejadas</div>
          <ul class="list">
            ${data.estrategiasValor.novasOfertas.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
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
        ` : ''}
      </div>
      ` : ''}
      
      <!-- Precificação -->
      ${data.precificacao.modelo || data.precificacao.estrategia ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">💰</div>
          <h2 class="section-title">Estratégia de Precificação</h2>
          <p class="section-description">Modelo de precificação e estratégias para maximização de valor.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 A Arte de Precificar</div>
          <div class="info-box-text">
            Precificação vai muito além de cobrir custos. O <strong>modelo de precificação</strong> define como você cobra (hora, projeto, assinatura).
            A <strong>estratégia</strong> determina seu posicionamento (premium, competitivo, penetração).
            A <strong>ancoragem</strong> utiliza referências de preço para influenciar a percepção de valor.
            Uma precificação bem estruturada pode aumentar lucros em 20-50% sem alterar custos.
          </div>
        </div>
        
        <div class="data-grid">
          ${data.precificacao.modelo ? `
          <div class="card">
            <div class="card-title">📐 Modelo de Precificação</div>
            <div class="card-content">${data.precificacao.modelo}</div>
          </div>
          ` : ''}
          
          ${data.precificacao.estrategia ? `
          <div class="card">
            <div class="card-title">🎯 Estratégia</div>
            <div class="card-content">${data.precificacao.estrategia}</div>
          </div>
          ` : ''}
          
          ${data.precificacao.ancoragem ? `
          <div class="card">
            <div class="card-title">⚓ Ancoragem de Preço</div>
            <div class="card-content">${data.precificacao.ancoragem}</div>
          </div>
          ` : ''}
          
          ${data.precificacao.margemDesejada ? `
          <div class="card">
            <div class="card-title">📈 Margem Desejada</div>
            <div class="card-content">${data.precificacao.margemDesejada}</div>
          </div>
          ` : ''}
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
        
        <div class="info-box">
          <div class="info-box-title">💡 Escolhendo seus Motores</div>
          <div class="info-box-text">
            Existem três motores principais de crescimento: <strong>Viral</strong> (indicações e compartilhamentos), 
            <strong>Pago</strong> (publicidade e marketing) e <strong>Retenção</strong> (fidelização e recorrência).
            Empresas de sucesso dominam 1-2 motores antes de expandir. Tentar todos ao mesmo tempo dilui recursos e resultados.
            Escolha os motores alinhados ao seu modelo de negócio e ICP.
          </div>
        </div>
        
        ${data.motoresCrescimento.motoresPrincipais.length > 0 ? `
        <div class="card">
          <div class="card-title">🎯 Motores Principais Selecionados</div>
          <div class="tags">
            ${data.motoresCrescimento.motoresPrincipais.map(m => `<span class="tag tag-accent">${m}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${data.motoresCrescimento.canais.length > 0 ? `
        <div class="card">
          <div class="card-title">📢 Canais de Aquisição</div>
          <ul class="list">
            ${data.motoresCrescimento.canais.map(c => `<li class="list-item"><span class="list-bullet"></span><span>${c}</span></li>`).join('')}
          </ul>
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
                  <td>${m.nome}</td>
                  <td><strong>${m.meta}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      <!-- Organograma -->
      ${data.organograma.cargos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">👥</div>
          <h2 class="section-title">Estrutura Organizacional</h2>
          <p class="section-description">Cargos, responsabilidades, KPIs e hierarquia da equipe em 3 níveis.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 Estrutura em 3 Níveis</div>
          <div class="info-box-text">
            <strong>Nível 1 - Estratégico:</strong> Define visão, direção e grandes decisões (CEO, Diretores, Sócios).<br>
            <strong>Nível 2 - Tático:</strong> Traduz estratégia em planos e gerencia equipes (Gerentes, Coordenadores).<br>
            <strong>Nível 3 - Operacional:</strong> Executa processos e entrega resultados do dia a dia (Analistas, Assistentes).<br><br>
            Cada cargo deve ter responsabilidades claras e KPIs mensuráveis para acompanhamento de performance.
          </div>
        </div>
        
        <div class="org-chart">
          ${[1, 2, 3].map(nivel => {
            const cargosNivel = data.organograma.cargos.filter(c => (c as any).nivel === nivel);
            if (cargosNivel.length === 0) return '';
            const nivelLabels: Record<number, string> = {
              1: '👑 Nível 1 - Estratégico',
              2: '🎯 Nível 2 - Tático', 
              3: '⚡ Nível 3 - Operacional'
            };
            return `
              <div class="org-level org-level-${nivel}">
                <div class="org-level-header">
                  <span class="org-level-dot"></span>
                  <span class="org-level-title">${nivelLabels[nivel]}</span>
                </div>
                <div class="org-cards">
                  ${cargosNivel.map(c => `
                    <div class="org-card">
                      <div class="org-title">${c.titulo}</div>
                      ${c.subordinadoA ? `<div class="org-subordinate">📍 Reporta-se a: ${c.subordinadoA}</div>` : ''}
                      
                      ${c.responsabilidades.length > 0 ? `
                      <div class="org-section">
                        <div class="org-section-title">📋 Responsabilidades</div>
                        <div class="org-responsibilities">
                          <ul style="margin: 0; padding-left: 16px;">
                            ${c.responsabilidades.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
                          </ul>
                        </div>
                      </div>
                      ` : ''}
                      
                      ${((c as any).kpis || []).length > 0 ? `
                      <div class="org-section">
                        <div class="org-section-title">📊 KPIs</div>
                        <div class="org-kpis">
                          ${((c as any).kpis || []).map((k: string) => `<span class="org-kpi">📈 ${k}</span>`).join('')}
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
      </div>
      ` : ''}
      
      <!-- Processos -->
      ${data.processos.processos.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">⚙️</div>
          <h2 class="section-title">Processos Operacionais</h2>
          <p class="section-description">Processos padronizados que garantem consistência e qualidade.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 A Importância dos Processos</div>
          <div class="info-box-text">
            Processos documentados e padronizados são a base da escalabilidade. Eles garantem que a qualidade 
            não dependa de indivíduos específicos, facilitam o treinamento de novos colaboradores e permitem 
            identificar gargalos e oportunidades de melhoria contínua. Um bom processo é claro, mensurável e repetível.
          </div>
        </div>
        
        ${data.processos.processos.map(p => `
          <div class="process-card">
            <div class="process-header">
              <span class="process-name">${p.nome}</span>
              <span class="process-frequency">${p.frequencia}</span>
            </div>
            <div class="process-description">${p.descricao}</div>
            <div class="process-responsible">👤 Responsável: ${p.responsavel}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- Financeiro -->
      ${data.financeiro.faturamentoAtual > 0 || data.financeiro.metaFaturamento > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">📈</div>
          <h2 class="section-title">Análise Financeira</h2>
          <p class="section-description">Panorama financeiro atual e projeções estratégicas.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 Gestão Financeira Estratégica</div>
          <div class="info-box-text">
            A saúde financeira determina a capacidade de investimento e crescimento. Conhecer sua <strong>margem de contribuição</strong>,
            <strong>ponto de equilíbrio</strong> e <strong>fluxo de caixa</strong> permite tomar decisões informadas.
            A meta de faturamento deve ser ambiciosa mas realista, considerando capacidade operacional e mercado.
          </div>
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
        
        ${data.financeiro.oportunidades.length > 0 ? `
        <div class="card" style="margin-top: 20px;">
          <div class="card-title">🎯 Oportunidades Identificadas</div>
          <ul class="list">
            ${data.financeiro.oportunidades.map(o => `<li class="list-item"><span class="list-bullet"></span><span>${o}</span></li>`).join('')}
          </ul>
        </div>
        ` : ''}
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
        
        <div class="info-box">
          <div class="info-box-title">💡 Como usar a Matriz SWOT</div>
          <div class="info-box-text">
            A SWOT cruza fatores internos (Forças e Fraquezas) com externos (Oportunidades e Ameaças).
            <strong>Forças + Oportunidades</strong> = Estratégias de avanço agressivo.
            <strong>Forças + Ameaças</strong> = Estratégias de confronto/defesa.
            <strong>Fraquezas + Oportunidades</strong> = Estratégias de reforço/desenvolvimento.
            <strong>Fraquezas + Ameaças</strong> = Estratégias de proteção/recuo.
          </div>
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
        ` : ''}
      </div>
      ` : ''}
      
      <!-- SWOT Pessoal -->
      ${data.swotPessoal.forcas.length > 0 || data.swotPessoal.fraquezas.length > 0 ? `
      <div class="section page-break">
        <div class="section-header">
          <div class="section-icon">🧠</div>
          <h2 class="section-title">SWOT Pessoal do Líder</h2>
          <p class="section-description">Autoconhecimento como base para liderança efetiva.</p>
        </div>
        
        <div class="info-box">
          <div class="info-box-title">💡 Liderança Consciente</div>
          <div class="info-box-text">
            O sucesso da empresa está intimamente ligado ao desenvolvimento do líder. Conhecer suas próprias 
            forças permite potencializá-las; reconhecer fraquezas abre caminho para desenvolvimento ou delegação.
            Líderes efetivos buscam constantemente feedback e trabalham ativamente em seu crescimento pessoal.
          </div>
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
        
        <div class="info-box">
          <div class="info-box-title">💡 Gerenciando o Recurso Mais Escasso</div>
          <div class="info-box-text">
            O tempo do CEO/fundador é o recurso mais escasso e valioso da empresa. Definir prioridades claras,
            eliminar distrações e focar no que realmente move o ponteiro é essencial. A regra de Pareto se aplica:
            20% das atividades geram 80% dos resultados. Identifique e proteja esse tempo a todo custo.
          </div>
        </div>
        
        ${data.agendaCEO.focoTrimestre ? `
        <div class="card" style="background: linear-gradient(135deg, var(--primary-light) 0%, #E0E7FF 100%); border: 2px solid var(--primary);">
          <div class="card-title" style="color: var(--primary);">🎯 Foco Principal do Trimestre</div>
          <div class="card-content" style="font-size: 16px; font-weight: 500;">${data.agendaCEO.focoTrimestre}</div>
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
        ` : ''}
      </div>
      ` : ''}
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
