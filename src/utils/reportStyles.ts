// CSS do relatório principal — extraído de reportGenerator.ts (etapa 1 do refactor).
// Única interpolação: progresso geral usado no anel da capa.
export function reportStyles(overallProgress: number): string {
  return `
    :root {
      --primary: #18181B;
      --primary-light: #3F3F46;
      --primary-lighter: #F4F4F5;
      --accent: #22C55E;
      --accent-light: #DCFCE7;
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
      --gradient-accent: linear-gradient(135deg, #3B82F6 0%, #22C55E 100%);
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
      background: linear-gradient(180deg, #080808 0%, #141414 100%);
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
      background: #080808;
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
    
    /* ===== ACHADOS ===== */
    .achado { border: 1px solid #E4E4E7; border-radius: 14px; padding: 24px 28px; margin-bottom: 20px; }
    .achado-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .achado-numero { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #71717A; }
    .achado-gravidade { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
    .achado-critico { border-left: 5px solid #EF4444; } .achado-critico .achado-gravidade { background: #FEF2F2; color: #B91C1C; }
    .achado-atencao { border-left: 5px solid #F59E0B; } .achado-atencao .achado-gravidade { background: #FFFBEB; color: #B45309; }
    .achado-oportunidade { border-left: 5px solid #22C55E; } .achado-oportunidade .achado-gravidade { background: #F0FDF4; color: #15803D; }
    .achado-titulo { font-size: 19px; font-weight: 700; color: #18181B; margin-bottom: 12px; }
    .achado-corpo p { font-size: 14.5px; line-height: 1.7; color: #3F3F46; margin-bottom: 8px; }

    /* ===== PRIMEIROS 30 DIAS ===== */
    .p30-grupo { margin-bottom: 28px; }
    .p30-iniciativa { font-size: 16px; font-weight: 700; color: #18181B; margin-bottom: 10px; }
    .p30-tabela { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .p30-tabela th { background: #18181B; color: #FFF; text-align: left; padding: 10px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .p30-tabela td { padding: 12px 14px; border-bottom: 1px solid #E4E4E7; vertical-align: top; line-height: 1.5; }
    .p30-tabela td:first-child { font-weight: 500; color: #18181B; }

    /* ===== PRIMEIRA SEMANA ===== */
    .semana-lista { counter-reset: sem; list-style: none; padding: 0; max-width: 640px; }
    .semana-lista li { counter-increment: sem; position: relative; padding: 16px 20px 16px 64px; margin-bottom: 12px; background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 12px; font-size: 15px; font-weight: 500; color: #18181B; line-height: 1.5; }
    .semana-lista li::before { content: counter(sem); position: absolute; left: 18px; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; border-radius: 50%; background: #22C55E; color: #FFF; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 14px; }

    /* ===== CHAPTER BANNER (Contribui para / Horizonte / Objetivo) ===== */
    .chapter-banner { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 14px 20px; margin: 20px 0 8px; background: #F0FDF4; border: 1px solid #BBF7D0; border-left: 4px solid #22C55E; border-radius: 10px; font-size: 13px; color: #166534; }
    .chapter-banner strong { color: #14532D; font-weight: 600; }
    @media print { .chapter-banner { background: #F0FDF4 !important; -webkit-print-color-adjust: exact; } }

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
      background: #DCFCE7;
      color: #15803D;
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
      color: #15803D;
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

    /* === Resumo Executivo & Roadmap (Berry) === */
    .exec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px; }
    .exec-card { background: var(--background); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
    .exec-card.full { grid-column: 1 / -1; }
    .exec-card h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 12px; font-weight: 600; }
    .exec-score { font-size: 40px; font-weight: 900; color: var(--accent); }
    .exec-score-max { color: var(--muted); font-size: 16px; }
    .exec-bar { height: 8px; background: var(--primary-lighter); border-radius: 99px; margin-top: 12px; overflow: hidden; }
    .exec-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #3B82F6, #22C55E); }
    .exec-combo { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; line-height: 1.5; }
    .exec-combo:last-child { border-bottom: none; }
    .exec-priority { font-size: 19px; font-weight: 700; color: var(--accent); margin-bottom: 6px; }

    .roadmap-legend { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: var(--muted);
      background: var(--primary-lighter); border-radius: 10px; padding: 12px 18px; margin: 20px 0; }
    .roadmap-tier { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 18px; }
    .roadmap-tier-head { display: flex; align-items: center; gap: 10px; padding: 12px 20px; font-weight: 700; font-family: inherit; }
    .roadmap-tier-head .dot { width: 11px; height: 11px; border-radius: 50%; }
    .roadmap-tier-head small { margin-left: auto; font-weight: 400; color: var(--muted); font-size: 11px; }
    .roadmap-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-top: 1px solid var(--border); font-size: 13px; }
    .roadmap-item .origem { margin-left: auto; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
      color: var(--muted); background: var(--primary-lighter); border-radius: 99px; padding: 3px 10px; white-space: nowrap; }

    .tier-critica .dot { background: #EF4444; } .tier-critica .roadmap-tier-head { background: #FEF2F2; color: #B91C1C; }
    .tier-alta .dot { background: #F97316; } .tier-alta .roadmap-tier-head { background: #FFF7ED; color: #C2410C; }
    .tier-media .dot { background: #EAB308; } .tier-media .roadmap-tier-head { background: #FEFCE8; color: #A16207; }
    .tier-evolucao .dot { background: #22C55E; } .tier-evolucao .roadmap-tier-head { background: #F0FDF4; color: #15803D; }
    .tier-estrategica .dot { background: #3B82F6; } .tier-estrategica .roadmap-tier-head { background: #EFF6FF; color: #1D4ED8; }
    .tier-h30 .dot { background: #EF4444; } .tier-h30 .roadmap-tier-head { background: #FEF2F2; color: #B91C1C; }
    .tier-h3 .dot { background: #F97316; } .tier-h3 .roadmap-tier-head { background: #FFF7ED; color: #C2410C; }
    .tier-h6 .dot { background: #EAB308; } .tier-h6 .roadmap-tier-head { background: #FEFCE8; color: #A16207; }
    .tier-h9 .dot { background: #22C55E; } .tier-h9 .roadmap-tier-head { background: #F0FDF4; color: #15803D; }
    .tier-h12 .dot { background: #3B82F6; } .tier-h12 .roadmap-tier-head { background: #EFF6FF; color: #1D4ED8; }

    /* === Impressão / PDF: fundo branco garantido === */
    @media print {
      body { background: #FFFFFF !important; }
      .cover-page { background: #080808 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .content, .section { background: #FFFFFF !important; }
      .section { page-break-before: always; break-before: page; }
      .cover-page { page-break-after: always; break-after: page; }
      .action-plan-item, .card, .swot-box, .exec-card, .roadmap-tier, li, table
        { page-break-inside: avoid; break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
      .edit-toolbar { display: none !important; }
    }
`;
}
