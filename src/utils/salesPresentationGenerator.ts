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
      --primary: #6366f1;
      --primary-light: #818cf8;
      --primary-dark: #4f46e5;
      --secondary: #0ea5e9;
      --accent: #f59e0b;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      --gradient-secondary: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
      --gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --text-primary: #1e293b;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --bg-light: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    /* Hero Section */
    .hero {
      background: var(--gradient-primary);
      color: white;
      padding: 80px 40px;
      border-radius: 24px;
      text-align: center;
      margin-bottom: 60px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.5;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
    }
    
    .hero-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
    }
    
    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 32px;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin-top: 40px;
    }
    
    .hero-stat {
      text-align: center;
    }
    
    .hero-stat-value {
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .hero-stat-label {
      font-size: 14px;
      opacity: 0.8;
    }
    
    /* Section Headers */
    .section {
      margin-bottom: 60px;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .section-icon {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin: 0 auto 20px;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }
    
    .section-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Deliverables Grid */
    .deliverables-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    
    @media (max-width: 900px) {
      .deliverables-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 600px) {
      .deliverables-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .deliverable-card {
      background: var(--bg-card);
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }
    
    .deliverable-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border-color: var(--primary-light);
    }
    
    .deliverable-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    
    .deliverable-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    
    .deliverable-desc {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    
    /* Sample Preview */
    .preview-section {
      background: var(--bg-card);
      border-radius: 24px;
      padding: 48px;
      border: 1px solid var(--border-color);
      margin-bottom: 60px;
    }
    
    .preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .preview-badge {
      background: var(--gradient-secondary);
      color: white;
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .preview-title {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    /* Sample SWOT */
    .sample-swot {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .swot-quadrant {
      padding: 20px;
      border-radius: 12px;
    }
    
    .swot-s { background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.05) 100%); border-left: 4px solid #10b981; }
    .swot-w { background: linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(248,113,113,0.05) 100%); border-left: 4px solid #ef4444; }
    .swot-o { background: linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(56,189,248,0.05) 100%); border-left: 4px solid #0ea5e9; }
    .swot-t { background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.05) 100%); border-left: 4px solid #f59e0b; }
    
    .swot-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .swot-item {
      font-size: 13px;
      color: var(--text-secondary);
      padding: 6px 0;
      border-bottom: 1px dashed var(--border-color);
    }
    
    .swot-item:last-child {
      border-bottom: none;
    }
    
    /* Sample Golden Circle */
    .golden-circle-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0;
      margin: 32px 0;
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
    
    .gc-why {
      width: 120px;
      height: 120px;
      background: var(--gradient-primary);
      font-size: 14px;
      z-index: 3;
    }
    
    .gc-how {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(139,92,246,0.7) 100%);
      margin-left: -40px;
      font-size: 14px;
      z-index: 2;
    }
    
    .gc-what {
      width: 280px;
      height: 280px;
      background: linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.4) 100%);
      margin-left: -40px;
      font-size: 14px;
      z-index: 1;
    }
    
    /* Process Flow */
    .process-flow {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin: 40px 0;
      flex-wrap: wrap;
    }
    
    .process-step {
      text-align: center;
      flex: 1;
      min-width: 150px;
    }
    
    .process-number {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      margin: 0 auto 12px;
    }
    
    .process-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .process-arrow {
      color: var(--text-muted);
      font-size: 24px;
    }
    
    /* Benefits */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .benefit-card {
      background: var(--bg-card);
      border-radius: 16px;
      padding: 32px;
      border: 1px solid var(--border-color);
      display: flex;
      gap: 20px;
    }
    
    .benefit-icon {
      width: 56px;
      height: 56px;
      background: var(--gradient-success);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }
    
    .benefit-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .benefit-desc {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    /* CTA Section */
    .cta-section {
      background: var(--gradient-primary);
      color: white;
      padding: 60px 40px;
      border-radius: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .cta-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    }
    
    .cta-content {
      position: relative;
      z-index: 1;
    }
    
    .cta-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .cta-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 32px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta-features {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    
    .cta-feature {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    
    .cta-feature-icon {
      width: 24px;
      height: 24px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .footer-logo {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    /* Org Chart Preview */
    .org-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin: 32px 0;
    }
    
    .org-node {
      background: var(--bg-card);
      border: 2px solid var(--primary);
      border-radius: 12px;
      padding: 16px 32px;
      text-align: center;
      min-width: 180px;
    }
    
    .org-node-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }
    
    .org-node-level {
      font-size: 12px;
      color: var(--text-muted);
    }
    
    .org-children {
      display: flex;
      gap: 20px;
      position: relative;
    }
    
    .org-children::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 50%;
      width: 2px;
      height: 20px;
      background: var(--border-color);
    }
    
    .org-child-node {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 24px;
      text-align: center;
    }
    
    /* Financial Preview */
    .financial-preview {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin: 32px 0;
    }
    
    .financial-card {
      background: var(--bg-light);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .financial-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .financial-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .financial-value.positive {
      color: var(--success);
    }
    
    @media print {
      body {
        background: white;
      }
      
      .container {
        padding: 20px;
      }
      
      .hero {
        padding: 40px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .deliverable-card:hover,
      .benefit-card:hover {
        transform: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-content">
        <div class="hero-badge">✨ Consultoria Personalizada</div>
        <h1>Programa de Estruturação em Gestão</h1>
        <p class="hero-subtitle">
          Transforme sua empresa com uma metodologia comprovada que estrutura 
          os pilares fundamentais do seu negócio para crescimento sustentável.
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-value">14</div>
            <div class="hero-stat-label">Módulos Completos</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-value">50+</div>
            <div class="hero-stat-label">Ferramentas Incluídas</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-value">100%</div>
            <div class="hero-stat-label">Personalizado</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Process Flow -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">🎯</div>
        <h2 class="section-title">Metodologia Estruturada</h2>
        <p class="section-subtitle">Um passo a passo claro para organizar e escalar seu negócio</p>
      </div>
      
      <div class="process-flow">
        <div class="process-step">
          <div class="process-number">1</div>
          <div class="process-label">Diagnóstico</div>
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <div class="process-number">2</div>
          <div class="process-label">Estratégia</div>
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <div class="process-number">3</div>
          <div class="process-label">Estruturação</div>
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <div class="process-number">4</div>
          <div class="process-label">Implementação</div>
        </div>
        <div class="process-arrow">→</div>
        <div class="process-step">
          <div class="process-number">5</div>
          <div class="process-label">Acompanhamento</div>
        </div>
      </div>
    </div>
    
    <!-- Deliverables -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">📦</div>
        <h2 class="section-title">O Que Você Vai Receber</h2>
        <p class="section-subtitle">Entregas personalizadas para a realidade do seu negócio</p>
      </div>
      
      <div class="deliverables-grid">
        <div class="deliverable-card">
          <div class="deliverable-icon">📊</div>
          <div class="deliverable-title">Diagnóstico de Maturidade</div>
          <div class="deliverable-desc">Análise completa do nível atual em Pessoas, Processos, Finanças e Mercado com plano de evolução.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">🎯</div>
          <div class="deliverable-title">Golden Circle Definido</div>
          <div class="deliverable-desc">Propósito (Por quê), Diferencial (Como) e Oferta (O quê) claramente articulados.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">🏢</div>
          <div class="deliverable-title">Identidade Organizacional</div>
          <div class="deliverable-desc">Missão, Visão, Valores e cultura organizacional documentados e aplicáveis.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">📈</div>
          <div class="deliverable-title">Análise SWOT Completa</div>
          <div class="deliverable-desc">Forças, Fraquezas, Oportunidades e Ameaças mapeadas com plano de ação.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">👥</div>
          <div class="deliverable-title">Perfil de Cliente Ideal (ICP)</div>
          <div class="deliverable-desc">Definição detalhada de quem é seu melhor cliente e como alcançá-lo.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">🎖️</div>
          <div class="deliverable-title">Análise de Concorrentes</div>
          <div class="deliverable-desc">Mapeamento competitivo com oportunidades de diferenciação identificadas.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">💰</div>
          <div class="deliverable-title">Estratégia de Precificação</div>
          <div class="deliverable-desc">Modelo de precificação baseado em valor com cálculos de margem e ROI.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">💎</div>
          <div class="deliverable-title">Estratégias de Valor</div>
          <div class="deliverable-desc">Proposta de valor única e estratégias para comunicá-la ao mercado.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">🚀</div>
          <div class="deliverable-title">Motores de Crescimento</div>
          <div class="deliverable-desc">Canais e táticas priorizados para aquisição de clientes com plano de implementação.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">📋</div>
          <div class="deliverable-title">Organograma Funcional</div>
          <div class="deliverable-desc">Estrutura de cargos com responsabilidades, KPIs e checklist de atividades.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">⚙️</div>
          <div class="deliverable-title">Mapeamento de Processos</div>
          <div class="deliverable-desc">Processos críticos documentados com responsáveis e indicadores.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">📊</div>
          <div class="deliverable-title">Dashboard Financeiro</div>
          <div class="deliverable-desc">Indicadores financeiros essenciais com metas e projeções.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">👤</div>
          <div class="deliverable-title">SWOT Pessoal do Líder</div>
          <div class="deliverable-desc">Autoconhecimento estratégico com plano de desenvolvimento pessoal.</div>
        </div>
        
        <div class="deliverable-card">
          <div class="deliverable-icon">📅</div>
          <div class="deliverable-title">Agenda CEO Estruturada</div>
          <div class="deliverable-desc">Organização do tempo do gestor com foco em atividades estratégicas.</div>
        </div>
      </div>
    </div>
    
    <!-- Sample Preview: SWOT -->
    <div class="preview-section">
      <div class="preview-header">
        <span class="preview-badge">Exemplo</span>
        <h3 class="preview-title">Análise SWOT Personalizada</h3>
      </div>
      
      <div class="sample-swot">
        <div class="swot-quadrant swot-s">
          <div class="swot-title"><span>💪</span> Forças</div>
          <div class="swot-item">• Equipe comprometida e experiente</div>
          <div class="swot-item">• Qualidade reconhecida no mercado</div>
          <div class="swot-item">• Relacionamento próximo com clientes</div>
        </div>
        
        <div class="swot-quadrant swot-w">
          <div class="swot-title"><span>⚠️</span> Fraquezas</div>
          <div class="swot-item">• Processos ainda não documentados</div>
          <div class="swot-item">• Dependência do fundador</div>
          <div class="swot-item">• Marketing digital incipiente</div>
        </div>
        
        <div class="swot-quadrant swot-o">
          <div class="swot-title"><span>🌟</span> Oportunidades</div>
          <div class="swot-item">• Mercado em expansão</div>
          <div class="swot-item">• Novos canais digitais</div>
          <div class="swot-item">• Parcerias estratégicas</div>
        </div>
        
        <div class="swot-quadrant swot-t">
          <div class="swot-title"><span>🔥</span> Ameaças</div>
          <div class="swot-item">• Novos entrantes no mercado</div>
          <div class="swot-item">• Pressão por preços menores</div>
          <div class="swot-item">• Mudanças regulatórias</div>
        </div>
      </div>
      
      <p style="text-align: center; color: var(--text-muted); font-size: 14px;">
        *Exemplo ilustrativo. Sua análise será totalmente personalizada para seu negócio.
      </p>
    </div>
    
    <!-- Sample Preview: Golden Circle -->
    <div class="preview-section">
      <div class="preview-header">
        <span class="preview-badge">Exemplo</span>
        <h3 class="preview-title">Golden Circle - Clareza de Propósito</h3>
      </div>
      
      <div class="golden-circle-preview">
        <div class="gc-ring gc-what">
          <div>
            <strong>O QUÊ</strong><br>
            <span style="font-size: 12px; opacity: 0.8;">Produtos e serviços</span>
          </div>
        </div>
        <div class="gc-ring gc-how">
          <div>
            <strong>COMO</strong><br>
            <span style="font-size: 12px; opacity: 0.8;">Diferencial único</span>
          </div>
        </div>
        <div class="gc-ring gc-why">
          <div>
            <strong>POR QUÊ</strong><br>
            <span style="font-size: 11px; opacity: 0.8;">Propósito</span>
          </div>
        </div>
      </div>
      
      <p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 24px;">
        Definição clara do propósito que guia todas as decisões estratégicas.
      </p>
    </div>
    
    <!-- Sample Preview: Organograma -->
    <div class="preview-section">
      <div class="preview-header">
        <span class="preview-badge">Exemplo</span>
        <h3 class="preview-title">Organograma com Checklist de Atividades</h3>
      </div>
      
      <div class="org-preview">
        <div class="org-node">
          <div class="org-node-title">CEO / Diretor</div>
          <div class="org-node-level">Nível Estratégico</div>
        </div>
        <div class="org-children">
          <div class="org-child-node">
            <div class="org-node-title">Comercial</div>
            <div class="org-node-level">Nível Tático</div>
          </div>
          <div class="org-child-node">
            <div class="org-node-title">Operações</div>
            <div class="org-node-level">Nível Tático</div>
          </div>
          <div class="org-child-node">
            <div class="org-node-title">Financeiro</div>
            <div class="org-node-level">Nível Tático</div>
          </div>
        </div>
      </div>
      
      <p style="text-align: center; color: var(--text-muted); font-size: 14px;">
        Cada cargo inclui: responsabilidades, KPIs e checklist de atividades diárias/semanais.
      </p>
    </div>
    
    <!-- Sample Preview: Financeiro -->
    <div class="preview-section">
      <div class="preview-header">
        <span class="preview-badge">Exemplo</span>
        <h3 class="preview-title">Dashboard Financeiro</h3>
      </div>
      
      <div class="financial-preview">
        <div class="financial-card">
          <div class="financial-label">Faturamento</div>
          <div class="financial-value">R$ 150.000</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Margem</div>
          <div class="financial-value positive">25%</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Ponto de Equilíbrio</div>
          <div class="financial-value">R$ 80.000</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">Projeção 12m</div>
          <div class="financial-value positive">+35%</div>
        </div>
      </div>
      
      <p style="text-align: center; color: var(--text-muted); font-size: 14px;">
        Indicadores financeiros claros para tomada de decisão estratégica.
      </p>
    </div>
    
    <!-- Benefits -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon">✅</div>
        <h2 class="section-title">Benefícios do Programa</h2>
        <p class="section-subtitle">Resultados tangíveis para sua empresa</p>
      </div>
      
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">🎯</div>
          <div>
            <div class="benefit-title">Clareza Estratégica</div>
            <div class="benefit-desc">Saiba exatamente onde está e para onde vai. Decisões baseadas em análise, não em achismo.</div>
          </div>
        </div>
        
        <div class="benefit-card">
          <div class="benefit-icon">⚡</div>
          <div>
            <div class="benefit-title">Eficiência Operacional</div>
            <div class="benefit-desc">Processos documentados, funções claras e equipe alinhada. Menos retrabalho, mais resultado.</div>
          </div>
        </div>
        
        <div class="benefit-card">
          <div class="benefit-icon">📈</div>
          <div>
            <div class="benefit-title">Crescimento Estruturado</div>
            <div class="benefit-desc">Base sólida para escalar. Cresça com segurança, sem perder a qualidade.</div>
          </div>
        </div>
        
        <div class="benefit-card">
          <div class="benefit-icon">💰</div>
          <div>
            <div class="benefit-title">Controle Financeiro</div>
            <div class="benefit-desc">Números na ponta do lápis. Saiba sua margem real, ponto de equilíbrio e potencial de lucro.</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CTA -->
    <div class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Pronto para Estruturar seu Negócio?</h2>
        <p class="cta-subtitle">
          Dê o primeiro passo para transformar sua empresa com uma gestão profissional e estratégica.
        </p>
        <div class="cta-features">
          <div class="cta-feature">
            <div class="cta-feature-icon">✓</div>
            <span>100% Personalizado</span>
          </div>
          <div class="cta-feature">
            <div class="cta-feature-icon">✓</div>
            <span>Metodologia Comprovada</span>
          </div>
          <div class="cta-feature">
            <div class="cta-feature-icon">✓</div>
            <span>Entregas Tangíveis</span>
          </div>
          <div class="cta-feature">
            <div class="cta-feature-icon">✓</div>
            <span>Acompanhamento Contínuo</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">📊</div>
      <div>Programa de Estruturação em Gestão</div>
      <div style="margin-top: 8px;">Transformando negócios através de gestão estratégica</div>
    </div>
    
  </div>
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
