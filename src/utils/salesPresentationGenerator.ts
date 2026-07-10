export function generateSalesPresentation() {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programa de Estruturação em Gestão</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    :root {
      --primary: #3B82F6;
      --primary-light: #60A5FA;
      --primary-dark: #2563EB;
      --secondary: #22C55E;
      --accent: #f59e0b;
      --success: #22C55E;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gradient-primary: linear-gradient(135deg, #3B82F6 0%, #22C55E 100%);
      --gradient-secondary: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
      --gradient-success: linear-gradient(135deg, #22C55E 0%, #4ADE80 100%);
      --text-primary: #1e293b;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --bg-light: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
    }
    html[data-theme="dark"] {
      --text-primary: #F0F0F0;
      --text-secondary: #C4C9D2;
      --text-muted: #8B93A1;
      --bg-light: #080808;
      --bg-card: #141414;
      --border-color: #2A2A2A;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-light);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
    
    .hero {
      background: var(--gradient-primary);
      color: white;
      padding: 60px 40px;
      border-radius: 24px;
      text-align: center;
      margin-bottom: 48px;
    }
    
    .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; }
    .hero-subtitle { font-size: 1.1rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }
    
    .preview-section {
      background: var(--bg-card);
      border-radius: 20px;
      padding: 40px;
      border: 1px solid var(--border-color);
      margin-bottom: 32px;
    }
    
    .preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .preview-number {
      width: 36px;
      height: 36px;
      background: var(--gradient-primary);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }
    
    .preview-title { font-size: 1.4rem; font-weight: 700; }
    .preview-desc { color: var(--text-secondary); margin-bottom: 24px; font-size: 15px; }
    
    .sample-swot {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .swot-quadrant { padding: 16px; border-radius: 10px; }
    .swot-s { background: rgba(16,185,129,0.1); border-left: 3px solid #10b981; }
    .swot-w { background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; }
    .swot-o { background: rgba(14,165,233,0.1); border-left: 3px solid #0ea5e9; }
    .swot-t { background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; }
    
    .swot-title { font-weight: 600; font-size: 13px; margin-bottom: 8px; }
    .swot-item { font-size: 12px; color: var(--text-secondary); padding: 4px 0; }
    
    .gc-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .gc-ring {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      font-weight: 600;
    }
    
    .gc-why { width: 100px; height: 100px; background: var(--gradient-primary); font-size: 12px; z-index: 3; }
    .gc-how { width: 160px; height: 160px; background: rgba(37,99,235,0.7); margin-left: -30px; font-size: 12px; z-index: 2; }
    .gc-what { width: 220px; height: 220px; background: rgba(37,99,235,0.4); margin-left: -30px; font-size: 12px; z-index: 1; }
    
    .maturity-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .maturity-item {
      text-align: center;
      padding: 16px 12px;
      background: var(--bg-light);
      border-radius: 10px;
    }
    
    .maturity-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
    .maturity-bar { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
    .maturity-fill { height: 100%; background: var(--gradient-primary); border-radius: 4px; }
    .maturity-value { font-size: 14px; font-weight: 600; }
    
    .identity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .identity-card {
      padding: 20px;
      background: var(--bg-light);
      border-radius: 12px;
      text-align: center;
    }
    
    .identity-icon { font-size: 24px; margin-bottom: 8px; }
    .identity-label { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-value { font-size: 13px; color: var(--text-primary); font-weight: 500; }
    
    .icp-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .icp-section { padding: 20px; background: var(--bg-light); border-radius: 12px; }
    .icp-title { font-size: 13px; font-weight: 600; margin-bottom: 12px; color: var(--text-primary); }
    .icp-item { font-size: 12px; color: var(--text-secondary); padding: 4px 0; display: flex; align-items: center; gap: 8px; }
    .icp-bullet { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; }
    
    .competitor-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .competitor-table th, .competitor-table td {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .competitor-table th {
      background: var(--bg-light);
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .competitor-table td { color: var(--text-secondary); }
    .competitor-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .badge-high { background: rgba(16,185,129,0.1); color: #10b981; }
    .badge-medium { background: rgba(245,158,11,0.1); color: #f59e0b; }
    .badge-low { background: rgba(239,68,68,0.1); color: #ef4444; }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .pricing-card {
      padding: 24px;
      background: var(--bg-light);
      border-radius: 12px;
      text-align: center;
    }
    
    .pricing-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
    .pricing-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
    .pricing-value.highlight { color: var(--success); }
    
    .motors-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .motor-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--bg-light);
      border-radius: 10px;
    }
    
    .motor-check { width: 20px; height: 20px; background: var(--gradient-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; }
    .motor-name { font-size: 14px; font-weight: 500; }
    
    .org-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .org-node {
      background: var(--bg-card);
      border: 2px solid var(--primary);
      border-radius: 10px;
      padding: 12px 24px;
      text-align: center;
    }
    
    .org-node-title { font-weight: 600; font-size: 13px; }
    .org-node-level { font-size: 11px; color: var(--text-muted); }
    
    .org-children { display: flex; gap: 16px; }
    .org-child-node { background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 20px; text-align: center; }
    
    .process-list { display: flex; flex-direction: column; gap: 12px; }
    .process-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-light); border-radius: 10px; }
    .process-icon { width: 40px; height: 40px; background: var(--gradient-secondary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
    .process-info { flex: 1; }
    .process-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
    .process-meta { font-size: 12px; color: var(--text-muted); }
    
    .financial-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .financial-card {
      background: var(--bg-light);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }
    
    .financial-label { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; }
    .financial-value { font-size: 1.25rem; font-weight: 700; }
    .financial-value.positive { color: var(--success); }
    
    .swot-pessoal { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    
    .agenda-list { display: flex; flex-direction: column; gap: 10px; }
    .agenda-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-light); border-radius: 10px; }
    .agenda-time { font-size: 12px; color: var(--primary); font-weight: 600; min-width: 80px; }
    .agenda-task { font-size: 13px; color: var(--text-primary); }
    
    .note { text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 20px; font-style: italic; }
    
    .footer {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .footer-logo { font-size: 28px; margin-bottom: 8px; }
    
    @media (max-width: 768px) {
      .maturity-grid, .identity-grid, .pricing-grid, .financial-grid { grid-template-columns: repeat(2, 1fr); }
      .icp-card, .motors-grid, .swot-pessoal { grid-template-columns: 1fr; }
      .sample-swot { grid-template-columns: 1fr; }
      .org-children { flex-direction: column; }
    }
    
    .theme-toggle { position: fixed; top: 20px; right: 20px; z-index: 1000; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: 0.2s; }
    .theme-toggle:hover { transform: scale(1.05); }

    @media print {
      body { background: white; }
      .theme-toggle { display: none !important; }
      .preview-section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <svg width="180" height="60" viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Circles -->
        <circle cx="30" cy="30" r="22" fill="none" stroke="#2563eb" stroke-width="8"/>
        <circle cx="30" cy="75" r="22" fill="none" stroke="#2563eb" stroke-width="8"/>
        <circle cx="68" cy="52" r="18" fill="none" stroke="#4ade80" stroke-width="7"/>
        <!-- Text -->
        <text x="100" y="65" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" fill="var(--text-primary)">berry</text>
        <text x="100" y="95" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="400" fill="var(--text-secondary)">Consultoria empresarial</text>
      </svg>
    </div>
    
    <!-- Hero -->
    <div class="hero">
      <h1>Estruturação em Gestão</h1>
      <p class="hero-subtitle">
        Um trabalho completo de organização dos principais pilares do seu negócio, 
        com entregas práticas e personalizadas para sua realidade.
      </p>
    </div>
    
    <!-- 1. Diagnóstico de Maturidade -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">1</div>
        <h3 class="preview-title">Diagnóstico de Maturidade</h3>
      </div>
      <p class="preview-desc">
        Avaliação do estágio atual da empresa em 4 dimensões fundamentais. Identificamos onde você está 
        e quais são os próximos passos para evoluir em cada área.
      </p>
      <div class="maturity-grid">
        <div class="maturity-item">
          <div class="maturity-label">Pessoas</div>
          <div class="maturity-bar"><div class="maturity-fill" style="width: 60%; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);"></div></div>
          <div class="maturity-value" style="color: #3b82f6;">Nível 3</div>
        </div>
        <div class="maturity-item">
          <div class="maturity-label">Processos</div>
          <div class="maturity-bar"><div class="maturity-fill" style="width: 40%; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);"></div></div>
          <div class="maturity-value" style="color: #f59e0b;">Nível 2</div>
        </div>
        <div class="maturity-item">
          <div class="maturity-label">Finanças</div>
          <div class="maturity-bar"><div class="maturity-fill" style="width: 60%; background: linear-gradient(135deg, #10b981 0%, #34d399 100%);"></div></div>
          <div class="maturity-value" style="color: #10b981;">Nível 3</div>
        </div>
        <div class="maturity-item">
          <div class="maturity-label">Mercado</div>
          <div class="maturity-bar"><div class="maturity-fill" style="width: 80%; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);"></div></div>
          <div class="maturity-value" style="color: #8b5cf6;">Nível 4</div>
        </div>
      </div>
      <p class="note">*Exemplo ilustrativo. Cada área terá análise detalhada com plano de ação específico.</p>
    </div>
    
    <!-- 2. Golden Circle -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">2</div>
        <h3 class="preview-title">Golden Circle</h3>
      </div>
      <p class="preview-desc">
        Definição clara do propósito da empresa (Por quê), do diferencial (Como) e dos produtos/serviços (O quê). 
        Essa clareza orienta todas as decisões estratégicas e de comunicação.
      </p>
      <div class="gc-preview">
        <div class="gc-ring gc-what"><div><strong>O QUÊ</strong><br><span style="font-size:10px;opacity:0.8">Produtos/Serviços</span></div></div>
        <div class="gc-ring gc-how"><div><strong>COMO</strong><br><span style="font-size:10px;opacity:0.8">Diferencial</span></div></div>
        <div class="gc-ring gc-why"><div><strong>POR QUÊ</strong><br><span style="font-size:10px;opacity:0.8">Propósito</span></div></div>
      </div>
      <p class="note">*Será construído em conjunto, refletindo a essência única do seu negócio.</p>
    </div>
    
    <!-- 3. Identidade Organizacional -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">3</div>
        <h3 class="preview-title">Identidade Organizacional</h3>
      </div>
      <p class="preview-desc">
        Missão, Visão e Valores documentados de forma clara e aplicável. 
        A base para alinhar a equipe e tomar decisões consistentes.
      </p>
      <div class="identity-grid">
        <div class="identity-card">
          <div class="identity-icon">🎯</div>
          <div class="identity-label">Missão</div>
          <div class="identity-value">O que fazemos e para quem</div>
        </div>
        <div class="identity-card">
          <div class="identity-icon">🔭</div>
          <div class="identity-label">Visão</div>
          <div class="identity-value">Onde queremos chegar</div>
        </div>
        <div class="identity-card">
          <div class="identity-icon">💎</div>
          <div class="identity-label">Valores</div>
          <div class="identity-value">O que nos guia no dia a dia</div>
        </div>
      </div>
      <p class="note">*Textos serão desenvolvidos de forma personalizada para sua empresa.</p>
    </div>
    
    <!-- 4. Análise SWOT -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">4</div>
        <h3 class="preview-title">Análise SWOT</h3>
      </div>
      <p class="preview-desc">
        Mapeamento das Forças, Fraquezas, Oportunidades e Ameaças do negócio. 
        Ferramenta fundamental para decisões estratégicas.
      </p>
      <div class="sample-swot">
        <div class="swot-quadrant swot-s">
          <div class="swot-title">💪 Forças</div>
          <div class="swot-item">• Equipe experiente</div>
          <div class="swot-item">• Qualidade reconhecida</div>
          <div class="swot-item">• Relacionamento com clientes</div>
        </div>
        <div class="swot-quadrant swot-w">
          <div class="swot-title">⚠️ Fraquezas</div>
          <div class="swot-item">• Processos não documentados</div>
          <div class="swot-item">• Dependência do fundador</div>
          <div class="swot-item">• Marketing limitado</div>
        </div>
        <div class="swot-quadrant swot-o">
          <div class="swot-title">🌟 Oportunidades</div>
          <div class="swot-item">• Mercado em crescimento</div>
          <div class="swot-item">• Canais digitais</div>
          <div class="swot-item">• Novas parcerias</div>
        </div>
        <div class="swot-quadrant swot-t">
          <div class="swot-title">🔥 Ameaças</div>
          <div class="swot-item">• Novos concorrentes</div>
          <div class="swot-item">• Pressão de preços</div>
          <div class="swot-item">• Mudanças no setor</div>
        </div>
      </div>
      
      <!-- Horizontes de Planejamento -->
      <div style="margin-top: 24px;">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text-primary);">📅 Horizontes de Planejamento</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="background: linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(248,113,113,0.05) 100%); border-left: 3px solid #ef4444; padding: 14px; border-radius: 8px;">
            <div style="font-weight: 600; font-size: 13px; color: #ef4444;">Curto Prazo</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">0-6 meses</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Ações imediatas para resolver fraquezas críticas</div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.05) 100%); border-left: 3px solid #f59e0b; padding: 14px; border-radius: 8px;">
            <div style="font-weight: 600; font-size: 13px; color: #f59e0b;">Médio Prazo</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">6-18 meses</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Aproveitar oportunidades identificadas</div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.05) 100%); border-left: 3px solid #10b981; padding: 14px; border-radius: 8px;">
            <div style="font-weight: 600; font-size: 13px; color: #10b981;">Longo Prazo</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">18-36 meses</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Visão estratégica e posicionamento futuro</div>
          </div>
        </div>
      </div>
      
      <p class="note">*Exemplo. Sua análise será baseada na realidade específica do seu negócio.</p>
    </div>
    
    <!-- 5. Perfil de Cliente Ideal (ICP) -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">5</div>
        <h3 class="preview-title">Perfil de Cliente Ideal (ICP)</h3>
      </div>
      <p class="preview-desc">
        Definição detalhada de quem é seu melhor cliente: características, comportamentos, dores e desejos. 
        Fundamental para direcionar marketing e vendas.
      </p>
      <div class="icp-card">
        <div class="icp-section">
          <div class="icp-title">Características</div>
          <div class="icp-item"><span class="icp-bullet"></span> Faixa etária e localização</div>
          <div class="icp-item"><span class="icp-bullet"></span> Poder aquisitivo</div>
          <div class="icp-item"><span class="icp-bullet"></span> Comportamento de compra</div>
          <div class="icp-item"><span class="icp-bullet"></span> Canais de informação</div>
        </div>
        <div class="icp-section">
          <div class="icp-title">Dores e Desejos</div>
          <div class="icp-item"><span class="icp-bullet"></span> Principais problemas enfrentados</div>
          <div class="icp-item"><span class="icp-bullet"></span> O que busca como solução</div>
          <div class="icp-item"><span class="icp-bullet"></span> Critérios de decisão</div>
          <div class="icp-item"><span class="icp-bullet"></span> Objeções comuns</div>
        </div>
      </div>
      <p class="note">*Será construído com base nos seus melhores clientes atuais.</p>
    </div>
    
    <!-- 6. Análise de Concorrentes -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">6</div>
        <h3 class="preview-title">Análise de Concorrentes</h3>
      </div>
      <p class="preview-desc">
        Mapeamento dos principais concorrentes com análise de pontos fortes, fracos e oportunidades de diferenciação.
      </p>
      <table class="competitor-table">
        <thead>
          <tr>
            <th>Concorrente</th>
            <th>Ponto Forte</th>
            <th>Ponto Fraco</th>
            <th>Ameaça</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Concorrente A</td>
            <td>Preço baixo</td>
            <td>Atendimento</td>
            <td><span class="competitor-badge badge-high">Alta</span></td>
          </tr>
          <tr>
            <td>Concorrente B</td>
            <td>Marca conhecida</td>
            <td>Pouca personalização</td>
            <td><span class="competitor-badge badge-medium">Média</span></td>
          </tr>
          <tr>
            <td>Concorrente C</td>
            <td>Tecnologia</td>
            <td>Preço alto</td>
            <td><span class="competitor-badge badge-low">Baixa</span></td>
          </tr>
        </tbody>
      </table>
      <p class="note">*Análise personalizada dos concorrentes do seu mercado específico.</p>
    </div>
    
    <!-- 7. Estratégia de Precificação -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">7</div>
        <h3 class="preview-title">Estratégia de Precificação</h3>
      </div>
      <p class="preview-desc">
        Para cada produto/serviço, analisamos diferentes estratégias de precificação para maximizar valor percebido e rentabilidade.
      </p>
      <div style="background: var(--bg-light); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px;">📦 Exemplo: Consultoria Estratégica - Preço base R$ 1.000</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #10b981;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">💎 Valor Agregado</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #10b981;">R$ 1.400</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">+40% com garantia e suporte VIP</div>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #3b82f6;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">📦 Combo/Pacote</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #3b82f6;">R$ 2.500</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">3 serviços com 15% desconto</div>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #f59e0b;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">👑 Plano Premium</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #f59e0b;">R$ 2.000</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">2x com atendimento prioritário</div>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #8b5cf6;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🔄 Recorrência</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #8b5cf6;">R$ 150/mês</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">15% mensal = 12x retorno anual</div>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #ec4899;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">🎯 Baseado em ROI</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #ec4899;">R$ 3.000</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Se gera 10x retorno, 3x é "barato"</div>
          </div>
          <div style="background: var(--bg-card); padding: 16px; border-radius: 10px; border-left: 3px solid #06b6d4;">
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">⚓ Ancoragem</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #06b6d4;">De R$ 2.000 por R$ 1.000</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Âncora alta = oportunidade</div>
          </div>
        </div>
      </div>
      <p class="note">*Cada produto/serviço terá análise completa com sugestões personalizáveis.</p>
    </div>
    
    <!-- 8. Estratégias de Valor -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">8</div>
        <h3 class="preview-title">Estratégias de Valor</h3>
      </div>
      <p class="preview-desc">
        Definição da proposta de valor única da empresa e como comunicá-la ao mercado. 
        O que faz o cliente escolher você e não o concorrente.
      </p>
      <div class="identity-grid">
        <div class="identity-card">
          <div class="identity-icon">🏆</div>
          <div class="identity-label">Diferencial Principal</div>
          <div class="identity-value">O que você faz de único</div>
        </div>
        <div class="identity-card">
          <div class="identity-icon">💬</div>
          <div class="identity-label">Promessa</div>
          <div class="identity-value">O que o cliente pode esperar</div>
        </div>
        <div class="identity-card">
          <div class="identity-icon">✨</div>
          <div class="identity-label">Prova</div>
          <div class="identity-value">Como você demonstra isso</div>
        </div>
      </div>
      <p class="note">*Construído a partir dos seus diferenciais reais e feedback de clientes.</p>
    </div>
    
    <!-- 9. Motores de Crescimento -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">9</div>
        <h3 class="preview-title">Motores de Crescimento</h3>
      </div>
      <p class="preview-desc">
        Identificação e priorização dos canais de aquisição de clientes mais adequados para seu negócio, 
        com plano de implementação para cada um.
      </p>
      <div class="motors-grid">
        <div class="motor-item">
          <div class="motor-check">✓</div>
          <div class="motor-name">Indicações</div>
        </div>
        <div class="motor-item">
          <div class="motor-check">✓</div>
          <div class="motor-name">Marketing de Conteúdo</div>
        </div>
        <div class="motor-item">
          <div class="motor-check">✓</div>
          <div class="motor-name">Parcerias</div>
        </div>
        <div class="motor-item">
          <div class="motor-check">✓</div>
          <div class="motor-name">SEO Local</div>
        </div>
      </div>
      <p class="note">*Cada motor terá estratégias detalhadas e passo a passo de implementação.</p>
    </div>
    
    <!-- 10. Organograma -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">10</div>
        <h3 class="preview-title">Organograma Funcional</h3>
      </div>
      <p class="preview-desc">
        Estrutura de cargos clara com responsabilidades definidas, KPIs e checklist de atividades 
        para cada função. Mesmo que hoje seja você em várias funções, mapear ajuda a delegar no futuro.
      </p>
      <div class="org-preview">
        <div class="org-node">
          <div class="org-node-title">Diretor / CEO</div>
          <div class="org-node-level">Nível Estratégico</div>
        </div>
        <div class="org-children">
          <div class="org-child-node">
            <div class="org-node-title">Comercial</div>
            <div class="org-node-level">Tático</div>
          </div>
          <div class="org-child-node">
            <div class="org-node-title">Operações</div>
            <div class="org-node-level">Tático</div>
          </div>
          <div class="org-child-node">
            <div class="org-node-title">Financeiro</div>
            <div class="org-node-level">Tático</div>
          </div>
        </div>
      </div>
      <p class="note">*Cada cargo terá descrição completa: responsabilidades, KPIs e checklist semanal.</p>
    </div>
    
    <!-- 11. Processos -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">11</div>
        <h3 class="preview-title">Mapeamento de Processos</h3>
      </div>
      <p class="preview-desc">
        Documentação dos processos críticos do negócio com responsáveis, frequência e indicadores. 
        A base para padronização e melhoria contínua.
      </p>
      <div class="process-list">
        <div class="process-item">
          <div class="process-icon">📞</div>
          <div class="process-info">
            <div class="process-name">Atendimento ao Cliente</div>
            <div class="process-meta">Responsável: Comercial • Diário</div>
          </div>
        </div>
        <div class="process-item">
          <div class="process-icon">📦</div>
          <div class="process-info">
            <div class="process-name">Entrega do Serviço/Produto</div>
            <div class="process-meta">Responsável: Operações • Por demanda</div>
          </div>
        </div>
        <div class="process-item">
          <div class="process-icon">💳</div>
          <div class="process-info">
            <div class="process-name">Cobrança e Recebimentos</div>
            <div class="process-meta">Responsável: Financeiro • Semanal</div>
          </div>
        </div>
      </div>
      <p class="note">*Processos específicos do seu negócio serão mapeados e documentados.</p>
    </div>
    
    <!-- 12. Financeiro -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">12</div>
        <h3 class="preview-title">Painel com os Principais Indicadores Financeiros</h3>
      </div>
      <p class="preview-desc">
        Visão completa dos indicadores financeiros essenciais para gestão e tomada de decisão. 
        Dados organizados para acompanhamento mensal.
      </p>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px;">
        <div class="financial-card">
          <div class="financial-label">Faturamento Bruto</div>
          <div class="financial-value">R$ 150K</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Custos Variáveis</div>
          <div class="financial-value">R$ 52K</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Custos Fixos</div>
          <div class="financial-value">R$ 38K</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Lucro Líquido</div>
          <div class="financial-value positive">R$ 60K</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px;">
        <div class="financial-card">
          <div class="financial-label">Margem de Contribuição</div>
          <div class="financial-value positive">65%</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Margem Líquida</div>
          <div class="financial-value positive">40%</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">EBITDA</div>
          <div class="financial-value">R$ 72K</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Ponto de Equilíbrio</div>
          <div class="financial-value">R$ 58K</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        <div class="financial-card">
          <div class="financial-label">Ticket Médio</div>
          <div class="financial-value">R$ 850</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">CAC</div>
          <div class="financial-value">R$ 120</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">LTV</div>
          <div class="financial-value">R$ 3.400</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">LTV/CAC</div>
          <div class="financial-value positive">28x</div>
        </div>
      </div>
      <p class="note">*Indicadores calculados com seus dados reais. Inclui análise histórica e projeções.</p>
    </div>
    
    <!-- 13. SWOT Pessoal -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">13</div>
        <h3 class="preview-title">SWOT Pessoal do Líder</h3>
      </div>
      <p class="preview-desc">
        Análise das forças e áreas de desenvolvimento do gestor principal. 
        Autoconhecimento para liderar melhor e saber o que delegar.
      </p>
      <div class="swot-pessoal">
        <div class="swot-quadrant swot-s">
          <div class="swot-title">💪 Forças Pessoais</div>
          <div class="swot-item">• Habilidades técnicas</div>
          <div class="swot-item">• Relacionamento</div>
          <div class="swot-item">• Resiliência</div>
        </div>
        <div class="swot-quadrant swot-w">
          <div class="swot-title">📚 Áreas de Desenvolvimento</div>
          <div class="swot-item">• Gestão de tempo</div>
          <div class="swot-item">• Delegação</div>
          <div class="swot-item">• Finanças</div>
        </div>
      </div>
      <p class="note">*Análise confidencial para desenvolvimento pessoal do gestor.</p>
    </div>
    
    <!-- 14. Agenda CEO -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="preview-number">14</div>
        <h3 class="preview-title">Agenda CEO</h3>
      </div>
      <p class="preview-desc">
        Estruturação da rotina do gestor com blocos de tempo para atividades estratégicas. 
        Sair do operacional e focar no que realmente faz o negócio crescer.
      </p>
      <div class="agenda-list">
        <div class="agenda-item">
          <div class="agenda-time">Segunda 8h</div>
          <div class="agenda-task">Planejamento semanal e revisão de metas</div>
        </div>
        <div class="agenda-item">
          <div class="agenda-time">Terça 14h</div>
          <div class="agenda-task">Reunião com equipe comercial</div>
        </div>
        <div class="agenda-item">
          <div class="agenda-time">Quarta 10h</div>
          <div class="agenda-task">Bloco estratégico (sem interrupções)</div>
        </div>
        <div class="agenda-item">
          <div class="agenda-time">Sexta 16h</div>
          <div class="agenda-task">Revisão financeira e fechamento</div>
        </div>
      </div>
      <p class="note">*Agenda personalizada conforme sua realidade e prioridades.</p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">📊</div>
      <div>Programa de Estruturação em Gestão</div>
      <div style="margin-top: 8px; font-size: 13px;">Entregas práticas e personalizadas para organizar seu negócio</div>
    </div>
    
  </div>
<button id="themeToggle" class="theme-toggle" title="Alternar tema claro/escuro" aria-label="Alternar tema">◐</button>
<script>
(function(){
  var KEY = 'berry-report-theme';
  var root = document.documentElement;
  function apply(t){ if(t==='dark'){ root.setAttribute('data-theme','dark'); } else { root.removeAttribute('data-theme'); } }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch(e) {}
  apply(saved === 'dark' ? 'dark' : 'light');
  document.getElementById('themeToggle').addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch(e) {}
  });
})();
</script>
</body>
</html>
`;

  return html;
}

export function openSalesPresentationInNewTab() {
  const html = generateSalesPresentation();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
