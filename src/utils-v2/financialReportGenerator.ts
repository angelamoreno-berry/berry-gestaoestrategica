import { Project, BlockStatus, ConsultingData } from '@/types-v2/consulting';

const fmtCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const fmtPct = (v: number) => `${Math.round(v)}%`;

const levelLabels: Record<number, string> = { 1: 'Inexistente', 2: 'Inicial', 3: 'Definido', 4: 'Gerenciado', 5: 'Otimizado' };

function getClassificacao(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Excelência', color: '#16a34a', bg: '#f0fdf4' };
  if (score >= 60) return { label: 'Otimizado', color: '#2563eb', bg: '#eff6ff' };
  if (score >= 40) return { label: 'Estruturado', color: '#7c3aed', bg: '#faf5ff' };
  if (score >= 20) return { label: 'Em Desenvolvimento', color: '#d97706', bg: '#fffbeb' };
  return { label: 'Crítico', color: '#dc2626', bg: '#fef2f2' };
}

export function generateFinancialReport(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const fd = (data as any).financialSimulation;
  if (!fd) return '<html><body><p>Sem dados financeiros</p></body></html>';

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const overallProgress = Math.round(blocks.reduce((a, b) => a + b.progress, 0) / blocks.length);

  // Maturidade
  const mp = fd.maturidadeProcessos || {};
  const mpDims = ['padronizacao','rotinas','controles','previsibilidade','usoDeDados','sistemaGestao','automacaoFinanceira','integracaoSistemas','dre','fluxoCaixaRelatorio','balancoPatrimonial','conciliacaoBancaria','analiseIndicadores','orcamentoAnual','planejamentoTributario','gestaoContratos','projecaoFinanceira'];
  const mpValues = mpDims.map(k => mp[k] || 0).filter(v => v > 0);
  const mpAvg = mpValues.length > 0 ? mpValues.reduce((a,b) => a+b, 0) / mpValues.length : 0;

  // Governança
  const gf = fd.governancaFinanceira || {};
  const gfDims = ['separacaoCpfCnpj','disciplinaGestao','tomadaDecisao','proLabore','planejamentoTributario'];
  const gfValues = gfDims.map(k => gf[k] || 0).filter(v => v > 0);
  const gfAvg = gfValues.length > 0 ? gfValues.reduce((a,b) => a+b, 0) / gfValues.length : 0;

  // Análise Financeira
  const af = fd.analiseFinanceira || {};
  const lucro = af.faturamentoMensal - af.despesasFixas - af.despesasVariaveis;
  const margem = af.faturamentoMensal > 0 ? Math.round((lucro / af.faturamentoMensal) * 100) : 0;
  const mcPct = af.faturamentoMensal > 0 ? (af.faturamentoMensal - af.despesasVariaveis) / af.faturamentoMensal : 0;
  const pe = mcPct > 0 ? af.despesasFixas / mcPct : 0;
  const folga = af.faturamentoMensal - pe;

  // Fluxo de Caixa
  const fc = fd.fluxoCaixa || {};
  const saldo30 = fc.saldoAtual + fc.entradasPrevistas30d - fc.saidasPrevistas30d;
  const saldo60 = saldo30 + fc.entradasPrevistas60d - fc.saidasPrevistas60d;
  const saldo90 = saldo60 + fc.entradasPrevistas90d - fc.saidasPrevistas90d;

  // Capital de Giro
  const cg = fd.capitalGiro || {};
  const cicloOp = cg.prazoMedioRecebimento + cg.prazoMedioEstoque;
  const cicloFin = cicloOp - cg.prazoMedioPagamento;
  const gapCG = cg.necessidadeCapitalGiro - cg.capitalGiroDisponivel;

  // Margens
  const mr = fd.margensRentabilidade || {};

  // KPIs
  const kpi = fd.indicadoresKPIs || {};
  const ltvCac = kpi.cac > 0 ? Math.round(kpi.ltv / kpi.cac) : 0;

  // Risco
  const ri = fd.riscoEndividamento || {};
  const riskLevel = ri.comprometimentoReceita > 30 ? 'Alto' : ri.comprometimentoReceita > 15 ? 'Moderado' : 'Baixo';

  // Score Geral
  const allProcessValues = [...mpValues.map(v => v), ...gfValues.map(v => v)];
  const scoreProcessos = allProcessValues.length > 0 ? Math.round((allProcessValues.reduce((a,b)=>a+b,0) / allProcessValues.length / 5) * 100) : 0;
  const finBlocks = blocks.filter(b => !['maturidadeProcessos','governancaFinanceira','scoreGeral'].includes(b.id));
  const scoreFinanceiro = finBlocks.length > 0 ? Math.round(finBlocks.reduce((a,b) => a + b.progress, 0) / finBlocks.length) : 0;
  const scoreGeral = Math.round(scoreProcessos * 0.4 + scoreFinanceiro * 0.6);
  const classificacao = getClassificacao(scoreGeral);

  // Simulador de Decisões
  const decisoes: { titulo: string; descricao: string; impacto: string; tipo: string }[] = [];
  
  if (af.faturamentoMensal > 0 && margem < 10) {
    decisoes.push({ titulo: 'Margem líquida crítica', descricao: `Margem de ${fmtPct(margem)}. Reduza despesas ou aumente preços.`, impacto: 'alto', tipo: 'risco' });
  }
  if (af.faturamentoMensal > 0 && folga < 0) {
    decisoes.push({ titulo: 'Abaixo do ponto de equilíbrio', descricao: `Faturar ${fmtCurrency(pe)} para cobrir custos. Falta ${fmtCurrency(Math.abs(folga))}.`, impacto: 'alto', tipo: 'risco' });
  }
  if (af.ticketMedio > 0 && af.quantidadeClientes > 0) {
    const aumento = af.ticketMedio * 0.1 * af.quantidadeClientes;
    decisoes.push({ titulo: 'Aumentar ticket médio em 10%', descricao: `Geraria ${fmtCurrency(aumento)} a mais por mês.`, impacto: 'medio', tipo: 'oportunidade' });
  }
  if (fc.saldoAtual > 0 && saldo30 < 0) {
    decisoes.push({ titulo: 'Caixa negativo em 30 dias', descricao: `Saldo projetado: ${fmtCurrency(saldo30)}. Antecipe recebíveis.`, impacto: 'alto', tipo: 'risco' });
  }
  if (cg.necessidadeCapitalGiro > 0 && cg.capitalGiroDisponivel > 0 && gapCG > 0) {
    decisoes.push({ titulo: 'Capital de giro insuficiente', descricao: `Faltam ${fmtCurrency(gapCG)} para cobrir a necessidade.`, impacto: 'alto', tipo: 'risco' });
  }
  if (ri.comprometimentoReceita > 30) {
    decisoes.push({ titulo: 'Endividamento alto', descricao: `${fmtPct(ri.comprometimentoReceita)} da receita comprometida com dívidas.`, impacto: 'alto', tipo: 'risco' });
  }
  if (ri.mesesReserva > 0 && ri.mesesReserva < 3) {
    decisoes.push({ titulo: 'Reserva de emergência insuficiente', descricao: `Apenas ${ri.mesesReserva} meses de cobertura. Ideal: 3-6 meses.`, impacto: 'medio', tipo: 'risco' });
  }
  if (gf.separacaoCpfCnpj > 0 && gf.separacaoCpfCnpj <= 2) {
    decisoes.push({ titulo: 'Separação PF/PJ deficiente', descricao: 'Mistura de finanças pessoais e empresariais dificulta análise.', impacto: 'alto', tipo: 'melhoria' });
  }
  if (mpAvg > 0 && mpAvg <= 2) {
    decisoes.push({ titulo: 'Processos financeiros imaturos', descricao: 'Documente rotinas e implemente controles para reduzir riscos.', impacto: 'medio', tipo: 'melhoria' });
  }

  // Categories for maturidade
  const matCategories = [
    { label: 'Processos', dims: ['padronizacao','rotinas','controles','previsibilidade','usoDeDados'] },
    { label: 'Ferramentas', dims: ['sistemaGestao','automacaoFinanceira','integracaoSistemas'] },
    { label: 'Relatórios', dims: ['dre','fluxoCaixaRelatorio','balancoPatrimonial','conciliacaoBancaria','analiseIndicadores'] },
    { label: 'Planejamento', dims: ['orcamentoAnual','planejamentoTributario','gestaoContratos','projecaoFinanceira'] },
  ];

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico Financeiro - ${project.nomeEmpresa}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #18181B; --accent: #0D9488; --accent-light: #CCFBF1;
      --gold: #A16207; --gold-light: #FEF9C3;
      --bg: #FFFFFF; --fg: #18181B; --muted: #71717A; --border: #E4E4E7;
      --green: #16a34a; --red: #dc2626; --orange: #d97706; --blue: #2563eb;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; line-height: 1.8; color: var(--fg); background: #f8f8f8; font-size: 15px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 900px; margin: 0 auto; background: white; box-shadow: 0 8px 32px rgba(0,0,0,0.08); overflow: hidden; }
    .editable-content { outline: none; }
    
    /* Cover */
    .cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 40px; background: linear-gradient(180deg, #18181B, #27272A); color: white; page-break-after: always; }
    .cover-badge { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 12px 28px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 48px; }
    .cover h1 { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 600; margin-bottom: 16px; line-height: 1.15; }
    .cover .subtitle { font-size: 18px; opacity: 0.7; margin-bottom: 64px; }
    .cover .company { font-size: 28px; font-weight: 600; margin-bottom: 8px; }
    .cover .segment { font-size: 15px; opacity: 0.6; margin-bottom: 48px; }
    .cover .score-ring { width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--accent) ${scoreGeral * 3.6}deg, rgba(255,255,255,0.1) 0deg); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .cover .score-inner { width: 96px; height: 96px; border-radius: 50%; background: #18181B; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .cover .score-value { font-size: 32px; font-weight: 700; }
    .cover .score-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; }

    /* Toolbar */
    .edit-toolbar { position: fixed; top: 20px; right: 20px; background: white; border-radius: 16px; padding: 12px 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); display: flex; gap: 8px; align-items: center; z-index: 1000; border: 1px solid var(--border); }
    .edit-toolbar button { padding: 10px 16px; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .edit-toolbar .primary { background: var(--fg); color: white; }
    .edit-toolbar .secondary { background: white; color: var(--fg); border: 1px solid var(--border); }
    .edit-toolbar span { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-right: 8px; }

    /* Content */
    .content { padding: 60px 48px; overflow: hidden; }
    .section { margin-bottom: 72px; page-break-inside: avoid; overflow: hidden; }
    .section-badge { display: inline-flex; align-items: center; gap: 10px; background: #f4f4f5; padding: 10px 18px; border-radius: 100px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .section-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.02em; }
    .section-desc { font-size: 15px; color: var(--muted); max-width: 600px; margin-bottom: 32px; }
    .page-break { page-break-before: always; }

    /* Cards */
    .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .metric-card { padding: 20px 16px; border-radius: 12px; border: 1px solid var(--border); text-align: center; overflow: hidden; word-break: break-word; }
    .metric-card .label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .metric-card .value { font-size: 22px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; }

    .info-box { background: #f4f4f5; border-left: 3px solid var(--fg); padding: 24px 28px; border-radius: 0 12px 12px 0; margin-bottom: 32px; overflow: hidden; word-break: break-word; }
    .info-box .title { font-weight: 600; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
    .info-box .text { font-size: 14px; line-height: 1.8; }

    .insight-box { background: #FEFCE8; border-left: 3px solid var(--gold); padding: 24px 28px; border-radius: 0 12px 12px 0; margin-bottom: 32px; overflow: hidden; word-break: break-word; }
    .insight-box .title { font-weight: 600; color: var(--gold); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
    .insight-box .text { color: #713F12; font-size: 14px; line-height: 1.8; }

    .alert-box { background: #fef2f2; border-left: 3px solid var(--red); padding: 24px 28px; border-radius: 0 12px 12px 0; margin-bottom: 32px; overflow: hidden; word-break: break-word; }
    .alert-box .title { font-weight: 600; color: var(--red); margin-bottom: 12px; }
    .alert-box .text { color: #991B1B; font-size: 14px; line-height: 1.8; }

    .success-box { background: #f0fdf4; border-left: 3px solid var(--green); padding: 24px 28px; border-radius: 0 12px 12px 0; margin-bottom: 32px; overflow: hidden; word-break: break-word; }
    .success-box .title { font-weight: 600; color: var(--green); margin-bottom: 12px; }
    .success-box .text { color: #166534; font-size: 14px; line-height: 1.8; }

    /* Maturity bar */
    .mat-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
    .mat-row:last-child { border-bottom: none; }
    .mat-label { flex: 1; font-size: 13px; font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .mat-bar { width: 100px; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; flex-shrink: 0; }
    .mat-fill { height: 100%; background: var(--accent); border-radius: 4px; }
    .mat-score { width: 80px; text-align: right; font-weight: 700; font-size: 13px; flex-shrink: 0; white-space: nowrap; }

    /* Table */
    .table-wrap { border-radius: 10px; border: 1px solid var(--border); overflow-x: auto; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th { background: var(--fg); color: white; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
    td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; overflow: hidden; text-overflow: ellipsis; word-break: break-word; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) { background: #fafafa; }

    /* Decision cards */
    .decision-card { padding: 20px; border-radius: 12px; border: 1px solid; margin-bottom: 16px; overflow: hidden; word-break: break-word; }
    .decision-card.risco { background: #fef2f2; border-color: #fecaca; }
    .decision-card.oportunidade { background: #f0fdf4; border-color: #bbf7d0; }
    .decision-card.melhoria { background: #fffbeb; border-color: #fde68a; }
    .decision-card .d-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
    .decision-card .d-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }
    .decision-card .d-badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; margin-bottom: 12px; }

    /* Action plan */
    .action-plan { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 28px; margin-bottom: 32px; overflow: hidden; }
    .action-plan .ap-title { font-weight: 600; color: #166534; font-size: 18px; margin-bottom: 24px; }
    .action-item { display: flex; gap: 14px; padding: 16px; background: white; border-radius: 10px; border: 1px solid #d1fae5; margin-bottom: 12px; overflow: hidden; }
    .action-item .num { width: 28px; height: 28px; background: #166534; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px; flex-shrink: 0; }
    .action-item .text { font-weight: 600; color: #166534; font-size: 14px; margin-bottom: 4px; }
    .action-item .detail { color: #15803d; font-size: 13px; line-height: 1.7; }

    /* Checklist */
    .checklist-cat { margin-bottom: 32px; }
    .checklist-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: var(--fg); color: white; border-radius: 10px 10px 0 0; font-weight: 600; font-size: 14px; }
    .checklist-items { border: 1px solid var(--border); border-top: none; border-radius: 0 0 10px 10px; }
    .checklist-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .checklist-item:last-child { border-bottom: none; }
    .checkbox { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 6px; flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
    .checkbox.checked { background: var(--accent); border-color: var(--accent); }
    .checkbox.checked::after { content: '✓'; color: white; font-weight: 700; font-size: 12px; }
    .checklist-text { font-size: 14px; font-weight: 500; }

    /* Footer */
    .footer { text-align: center; padding: 64px; background: var(--fg); color: white; }
    .footer .f-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .footer .f-text { opacity: 0.7; font-size: 14px; margin-bottom: 16px; }
    .footer .f-date { font-size: 12px; opacity: 0.5; }

    @media print {
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .container { box-shadow: none; }
      .edit-toolbar { display: none !important; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="edit-toolbar">
    <span>📝 Modo Edição</span>
    <button class="primary" onclick="window.print()">🖨️ Imprimir</button>
    <button class="secondary" onclick="saveHTML()">💾 Salvar HTML</button>
  </div>
  <script>
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('checkbox')) {
        e.target.classList.toggle('checked');
      }
    });
    function saveHTML() {
      var blob = new Blob([document.documentElement.outerHTML], {type:'text/html'});
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'diagnostico-financeiro.html'; a.click();
    }
  </script>

  <div class="container editable-content" contenteditable="true">
    <!-- COVER -->
    <div class="cover">
      <div class="cover-badge">Diagnóstico Financeiro Confidencial</div>
      <h1>Diagnóstico de<br>Gestão Financeira</h1>
      <p class="subtitle">Análise Completa de Maturidade e Saúde Financeira</p>
      <p class="company">${project.nomeEmpresa}</p>
      <p class="segment">${project.segmento}</p>
      <div class="score-ring">
        <div class="score-inner">
          <div class="score-value">${scoreGeral}</div>
          <div class="score-label">Score</div>
        </div>
      </div>
      <p style="opacity:0.6; font-size:14px; margin-top: 8px;">${classificacao.label}</p>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- SCORE GERAL -->
      <div class="section">
        <div class="section-badge">🏆 Score Geral</div>
        <h2 class="section-title">Score de Maturidade Financeira</h2>
        <p class="section-desc">Pontuação consolidada baseada em processos, governança e indicadores financeiros.</p>

        <div class="metric-grid">
          <div class="metric-card" style="background: ${classificacao.bg}; border-color: ${classificacao.color}30;">
            <div class="label">Score Geral</div>
            <div class="value" style="color: ${classificacao.color};">${scoreGeral}/100</div>
            <div style="font-size:13px; color: ${classificacao.color}; font-weight:600; margin-top:4px;">${classificacao.label}</div>
          </div>
          <div class="metric-card">
            <div class="label">Score de Processos</div>
            <div class="value">${scoreProcessos}/100</div>
          </div>
          <div class="metric-card">
            <div class="label">Score Financeiro</div>
            <div class="value">${scoreFinanceiro}/100</div>
          </div>
          <div class="metric-card">
            <div class="label">Progresso</div>
            <div class="value">${overallProgress}%</div>
          </div>
        </div>

        <div class="info-box">
          <div class="title">📊 Progresso por Módulo</div>
          <div class="text">
            ${blocks.filter(b => b.id !== 'scoreGeral').map(b => `<div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;"><span style="font-size:16px;">${b.icon}</span><span style="flex:1; font-size:14px;">${b.name}</span><div style="width:100px; height:6px; background:#e4e4e7; border-radius:3px; overflow:hidden;"><div style="height:100%; width:${b.progress}%; background:var(--accent); border-radius:3px;"></div></div><span style="font-size:12px; color:var(--muted); width:36px; text-align:right;">${b.progress}%</span></div>`).join('')}
          </div>
        </div>
      </div>

      <!-- MATURIDADE DE PROCESSOS -->
      ${mpValues.length > 0 ? `
      <div class="section page-break">
        <div class="section-badge">⚙️ Maturidade</div>
        <h2 class="section-title">Maturidade de Processos Financeiros</h2>
        <p class="section-desc">Avaliação de 17 dimensões organizadas em 4 categorias, com notas de 1 (Inexistente) a 5 (Otimizado).</p>

        <div class="metric-grid">
          <div class="metric-card" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-color: var(--accent);">
            <div class="label">Média Geral</div>
            <div class="value" style="color: var(--accent);">${Math.round(mpAvg)}/5</div>
          </div>
          ${matCategories.map(cat => {
            const vals = cat.dims.map(k => mp[k] || 0).filter(v => v > 0);
            const avg = vals.length > 0 ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : 0;
            return `<div class="metric-card"><div class="label">${cat.label}</div><div class="value">${avg > 0 ? avg + '/5' : '—'}</div></div>`;
          }).join('')}
        </div>

        ${matCategories.map(cat => `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size:16px; font-weight:600; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border);">${cat.label}</h3>
          ${cat.dims.map(k => {
            const v = mp[k] || 0;
            const naoSabe = mp._naoSabe?.[k];
            return `<div class="mat-row"><span class="mat-label">${k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span><div class="mat-bar"><div class="mat-fill" style="width: ${v * 20}%;"></div></div><span class="mat-score">${naoSabe ? 'N/I' : v > 0 ? v + ' — ' + (levelLabels[v] || '') : '—'}</span></div>`;
          }).join('')}
        </div>
        `).join('')}

        ${mpAvg > 0 && mpAvg <= 2 ? `
        <div class="alert-box">
          <div class="title">⚠️ Maturidade Baixa Detectada</div>
          <div class="text">A média geral de ${Math.round(mpAvg)}/5 indica que os processos financeiros estão em estágio inicial. Priorize a padronização de rotinas e a implantação de ferramentas básicas de controle.</div>
        </div>` : mpAvg >= 4 ? `
        <div class="success-box">
          <div class="title">✅ Excelente Maturidade</div>
          <div class="text">Média de ${Math.round(mpAvg)}/5 demonstra processos financeiros maduros. Mantenha a melhoria contínua e busque automação avançada.</div>
        </div>` : ''}

        ${mp.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${mp.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- GOVERNANÇA FINANCEIRA -->
      ${gfValues.length > 0 ? `
      <div class="section page-break">
        <div class="section-badge">🏛️ Governança</div>
        <h2 class="section-title">Governança Financeira</h2>
        <p class="section-desc">Avaliação da disciplina, separação patrimonial e qualidade da gestão financeira.</p>

        <div class="metric-card" style="text-align:center; padding:32px; margin-bottom:32px; background: linear-gradient(135deg, #f4f4f5, #e4e4e7);">
          <div class="label">Score de Governança</div>
          <div class="value" style="font-size:40px;">${Math.round(gfAvg)}/5</div>
        </div>

        ${gfDims.map(k => {
          const v = gf[k] || 0;
          const labels: Record<string,string> = {separacaoCpfCnpj:'Separação CPF x CNPJ', disciplinaGestao:'Disciplina de Gestão', tomadaDecisao:'Tomada de Decisão', proLabore:'Pró-labore Definido', planejamentoTributario:'Planejamento Tributário'};
          return `<div class="mat-row"><span class="mat-label">${labels[k] || k}</span><div class="mat-bar"><div class="mat-fill" style="width: ${v * 20}%;"></div></div><span class="mat-score">${v > 0 ? v + '/5' : '—'}</span></div>`;
        }).join('')}

        ${gf.separacaoCpfCnpj > 0 && gf.separacaoCpfCnpj <= 2 ? `
        <div class="alert-box" style="margin-top:24px;">
          <div class="title">⚠️ Separação PF/PJ Deficiente</div>
          <div class="text">A mistura de finanças pessoais e empresariais compromete toda a análise financeira. Esta é a prioridade #1 a ser resolvida.</div>
        </div>` : ''}

        ${gf.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${gf.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- ANÁLISE FINANCEIRA -->
      ${af.faturamentoMensal > 0 || af.despesasFixas > 0 ? `
      <div class="section page-break">
        <div class="section-badge">📊 Análise Financeira</div>
        <h2 class="section-title">Análise Financeira</h2>
        <p class="section-desc">Leitura dos números atuais, ponto de equilíbrio e saúde financeira.</p>

        <div class="metric-grid">
          <div class="metric-card" style="background: #f0fdf4;">
            <div class="label">Faturamento</div>
            <div class="value" style="color: var(--green);">${fmtCurrency(af.faturamentoMensal)}</div>
          </div>
          <div class="metric-card" style="background: #fef2f2;">
            <div class="label">Despesas Totais</div>
            <div class="value" style="color: var(--red);">${fmtCurrency(af.despesasFixas + af.despesasVariaveis)}</div>
          </div>
          <div class="metric-card">
            <div class="label">Lucro Líquido</div>
            <div class="value" style="color: ${lucro >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(lucro)}</div>
          </div>
          <div class="metric-card">
            <div class="label">Margem</div>
            <div class="value" style="color: ${margem >= 20 ? 'var(--green)' : margem >= 10 ? 'var(--orange)' : 'var(--red)'};">${fmtPct(margem)}</div>
          </div>
        </div>

        ${af.ticketMedio > 0 ? `<div class="metric-grid"><div class="metric-card"><div class="label">Ticket Médio</div><div class="value">${fmtCurrency(af.ticketMedio)}</div></div><div class="metric-card"><div class="label">Clientes</div><div class="value">${af.quantidadeClientes}</div></div></div>` : ''}

        ${pe > 0 ? `
        <div class="info-box" style="border-left-color: var(--orange); background: #fffbeb;">
          <div class="title" style="color: var(--orange);">⚠️ Ponto de Equilíbrio (Break-even)</div>
          <div class="text">
            <strong>Faturamento mínimo necessário:</strong> ${fmtCurrency(pe)}<br>
            <strong>Margem de contribuição:</strong> ${fmtPct(mcPct * 100)}<br>
            <strong>Folga sobre o break-even:</strong> <span style="color: ${folga >= 0 ? 'var(--green)' : 'var(--red)'}; font-weight:700;">${fmtCurrency(folga)} (${pe > 0 ? Math.round((folga / pe) * 100) : 0}%)</span>
            ${folga < 0 ? '<br><br><strong style="color:var(--red);">⚠️ Faturamento abaixo do ponto de equilíbrio. A empresa está operando no prejuízo.</strong>' : ''}
            ${folga >= 0 && folga < pe * 0.1 ? '<br><br><strong style="color:var(--orange);">⚠️ Folga muito pequena. Qualquer queda de receita pode levar ao prejuízo.</strong>' : ''}
          </div>
        </div>
        ` : ''}

        ${af.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${af.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- FLUXO DE CAIXA -->
      ${fc.saldoAtual > 0 || fc.entradasPrevistas30d > 0 ? `
      <div class="section page-break">
        <div class="section-badge">💧 Fluxo de Caixa</div>
        <h2 class="section-title">Fluxo de Caixa & Projeções</h2>
        <p class="section-desc">Projeção do caixa para os próximos 30, 60 e 90 dias.</p>

        <div class="metric-grid">
          <div class="metric-card"><div class="label">Saldo Atual</div><div class="value">${fmtCurrency(fc.saldoAtual)}</div></div>
          <div class="metric-card"><div class="label">Projeção 30d</div><div class="value" style="color: ${saldo30 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo30)}</div></div>
          <div class="metric-card"><div class="label">Projeção 60d</div><div class="value" style="color: ${saldo60 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo60)}</div></div>
          <div class="metric-card"><div class="label">Projeção 90d</div><div class="value" style="color: ${saldo90 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo90)}</div></div>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Período</th><th>Entradas</th><th>Saídas</th><th>Saldo Projetado</th></tr></thead>
            <tbody>
              <tr><td>Atual</td><td>—</td><td>—</td><td><strong>${fmtCurrency(fc.saldoAtual)}</strong></td></tr>
              <tr><td>30 dias</td><td style="color:var(--green);">${fmtCurrency(fc.entradasPrevistas30d)}</td><td style="color:var(--red);">${fmtCurrency(fc.saidasPrevistas30d)}</td><td><strong style="color:${saldo30 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo30)}</strong></td></tr>
              <tr><td>60 dias</td><td style="color:var(--green);">${fmtCurrency(fc.entradasPrevistas60d)}</td><td style="color:var(--red);">${fmtCurrency(fc.saidasPrevistas60d)}</td><td><strong style="color:${saldo60 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo60)}</strong></td></tr>
              <tr><td>90 dias</td><td style="color:var(--green);">${fmtCurrency(fc.entradasPrevistas90d)}</td><td style="color:var(--red);">${fmtCurrency(fc.saidasPrevistas90d)}</td><td><strong style="color:${saldo90 >= 0 ? 'var(--green)' : 'var(--red)'};">${fmtCurrency(saldo90)}</strong></td></tr>
            </tbody>
          </table>
        </div>

        ${saldo30 < 0 || saldo60 < 0 || saldo90 < 0 ? `
        <div class="alert-box">
          <div class="title">⚠️ Alerta de Caixa</div>
          <div class="text">${saldo30 < 0 ? 'Caixa ficará <strong>negativo nos próximos 30 dias</strong>. Ação imediata necessária: antecipe recebíveis ou renegocie pagamentos.' : saldo60 < 0 ? 'Risco de caixa negativo em 60 dias. Planeje-se com antecedência.' : 'Atenção ao caixa em 90 dias. Monitore entradas e saídas.'}</div>
        </div>` : `
        <div class="success-box">
          <div class="title">✅ Caixa Saudável</div>
          <div class="text">As projeções indicam saldo positivo nos próximos 90 dias. Mantenha o monitoramento regular.</div>
        </div>`}

        ${fc.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${fc.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- CAPITAL DE GIRO -->
      ${cg.prazoMedioRecebimento > 0 || cg.prazoMedioPagamento > 0 || cg.necessidadeCapitalGiro > 0 ? `
      <div class="section page-break">
        <div class="section-badge">🔄 Capital de Giro</div>
        <h2 class="section-title">Capital de Giro & Ciclo Financeiro</h2>
        <p class="section-desc">Análise dos prazos médios e necessidade de capital de giro.</p>

        <div class="metric-grid">
          <div class="metric-card"><div class="label">Ciclo Operacional</div><div class="value">${cicloOp} dias</div></div>
          <div class="metric-card" style="background: ${cicloFin > 0 ? '#fffbeb' : '#f0fdf4'};"><div class="label">Ciclo Financeiro</div><div class="value" style="color: ${cicloFin > 0 ? 'var(--orange)' : 'var(--green)'};">${cicloFin} dias</div></div>
          <div class="metric-card" style="background: ${gapCG > 0 ? '#fef2f2' : '#f0fdf4'};"><div class="label">Gap de Capital</div><div class="value" style="color: ${gapCG > 0 ? 'var(--red)' : 'var(--green)'};">${fmtCurrency(gapCG)}</div></div>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Indicador</th><th>Valor</th><th>Análise</th></tr></thead>
            <tbody>
              <tr><td>Prazo Médio de Recebimento</td><td><strong>${cg.prazoMedioRecebimento} dias</strong></td><td>${cg.prazoMedioRecebimento > 45 ? '⚠️ Prazo longo' : '✅ Adequado'}</td></tr>
              <tr><td>Prazo Médio de Pagamento</td><td><strong>${cg.prazoMedioPagamento} dias</strong></td><td>${cg.prazoMedioPagamento < 30 ? '⚠️ Prazo curto' : '✅ Adequado'}</td></tr>
              <tr><td>Prazo Médio de Estoque</td><td><strong>${cg.prazoMedioEstoque} dias</strong></td><td>${cg.prazoMedioEstoque > 60 ? '⚠️ Estoque parado' : '✅ Adequado'}</td></tr>
              <tr><td>Necessidade de Capital de Giro</td><td><strong>${fmtCurrency(cg.necessidadeCapitalGiro)}</strong></td><td>—</td></tr>
              <tr><td>Capital de Giro Disponível</td><td><strong>${fmtCurrency(cg.capitalGiroDisponivel)}</strong></td><td>${gapCG > 0 ? '⚠️ Insuficiente' : '✅ Suficiente'}</td></tr>
            </tbody>
          </table>
        </div>

        ${cg.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${cg.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- MARGENS & RENTABILIDADE -->
      ${mr.margemBruta > 0 || mr.margemContribuicao > 0 || mr.margemLiquida > 0 ? `
      <div class="section page-break">
        <div class="section-badge">📈 Margens</div>
        <h2 class="section-title">Margens & Rentabilidade</h2>
        <p class="section-desc">Análise das margens bruta, de contribuição e líquida, além de indicadores de rentabilidade.</p>

        <div class="metric-grid">
          <div class="metric-card"><div class="label">Margem Bruta</div><div class="value" style="color: ${mr.margemBruta >= 40 ? 'var(--green)' : mr.margemBruta >= 25 ? 'var(--orange)' : 'var(--red)'};">${mr.margemBruta}%</div></div>
          <div class="metric-card"><div class="label">Margem Contribuição</div><div class="value" style="color: ${mr.margemContribuicao >= 30 ? 'var(--green)' : mr.margemContribuicao >= 15 ? 'var(--orange)' : 'var(--red)'};">${mr.margemContribuicao}%</div></div>
          <div class="metric-card"><div class="label">Margem Líquida</div><div class="value" style="color: ${mr.margemLiquida >= 15 ? 'var(--green)' : mr.margemLiquida >= 5 ? 'var(--orange)' : 'var(--red)'};">${mr.margemLiquida}%</div></div>
          ${mr.roe > 0 ? `<div class="metric-card"><div class="label">ROE</div><div class="value">${mr.roe}%</div></div>` : ''}
          ${mr.roiMedio > 0 ? `<div class="metric-card"><div class="label">ROI Médio</div><div class="value">${mr.roiMedio}%</div></div>` : ''}
        </div>

        ${mr.margemLiquida > 0 && mr.margemLiquida < 10 ? `
        <div class="alert-box">
          <div class="title">⚠️ Margem Líquida Crítica</div>
          <div class="text">Margem de ${mr.margemLiquida}% está abaixo do mínimo recomendado de 10%. Revise estrutura de custos e estratégia de preços.</div>
        </div>` : ''}

        ${mr.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${mr.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- KPIs -->
      ${kpi.ebitda > 0 || kpi.cac > 0 || kpi.ltv > 0 ? `
      <div class="section page-break">
        <div class="section-badge">🎯 KPIs</div>
        <h2 class="section-title">Indicadores Financeiros (KPIs)</h2>
        <p class="section-desc">EBITDA, geração de caixa, eficiência operacional e métricas de aquisição de clientes.</p>

        <div class="metric-grid">
          ${kpi.ebitda > 0 ? `<div class="metric-card"><div class="label">EBITDA</div><div class="value">${fmtCurrency(kpi.ebitda)}</div></div>` : ''}
          ${kpi.ebitdaMargin > 0 ? `<div class="metric-card"><div class="label">Margem EBITDA</div><div class="value">${kpi.ebitdaMargin}%</div></div>` : ''}
          ${kpi.geracaoCaixa > 0 ? `<div class="metric-card"><div class="label">Geração de Caixa</div><div class="value">${fmtCurrency(kpi.geracaoCaixa)}</div></div>` : ''}
          ${kpi.eficienciaOperacional > 0 ? `<div class="metric-card"><div class="label">Eficiência</div><div class="value">${kpi.eficienciaOperacional}%</div></div>` : ''}
          ${kpi.cac > 0 ? `<div class="metric-card"><div class="label">CAC</div><div class="value">${fmtCurrency(kpi.cac)}</div></div>` : ''}
          ${kpi.ltv > 0 ? `<div class="metric-card"><div class="label">LTV</div><div class="value">${fmtCurrency(kpi.ltv)}</div></div>` : ''}
          ${kpi.cac > 0 && kpi.ltv > 0 ? `<div class="metric-card" style="background: ${ltvCac >= 3 ? '#f0fdf4' : '#fffbeb'};"><div class="label">LTV/CAC</div><div class="value" style="color: ${ltvCac >= 3 ? 'var(--green)' : 'var(--orange)'};">${ltvCac}x</div><div style="font-size:11px; color:var(--muted);">ideal: ≥ 3x</div></div>` : ''}
        </div>

        ${kpi.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${kpi.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- RISCO & ENDIVIDAMENTO -->
      ${ri.totalDividas > 0 || ri.comprometimentoReceita > 0 || ri.reservaEmergencia > 0 ? `
      <div class="section page-break">
        <div class="section-badge">⚠️ Risco</div>
        <h2 class="section-title">Risco & Endividamento</h2>
        <p class="section-desc">Avaliação do nível de risco e capacidade de absorver impactos financeiros.</p>

        <div class="metric-grid">
          <div class="metric-card" style="background: ${riskLevel === 'Alto' ? '#fef2f2' : riskLevel === 'Moderado' ? '#fffbeb' : '#f0fdf4'};">
            <div class="label">Nível de Risco</div>
            <div class="value" style="color: ${riskLevel === 'Alto' ? 'var(--red)' : riskLevel === 'Moderado' ? 'var(--orange)' : 'var(--green)'};">${riskLevel}</div>
          </div>
          <div class="metric-card"><div class="label">Total Dívidas</div><div class="value">${fmtCurrency(ri.totalDividas)}</div></div>
          <div class="metric-card"><div class="label">Comprometimento</div><div class="value">${ri.comprometimentoReceita}%</div></div>
          <div class="metric-card"><div class="label">Reserva</div><div class="value">${ri.mesesReserva} meses</div></div>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Indicador</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Total de Dívidas</td><td>${fmtCurrency(ri.totalDividas)}</td><td>${ri.totalDividas === 0 ? '✅ Sem dívidas' : '📊 Monitorar'}</td></tr>
              <tr><td>Parcelas Mensais</td><td>${fmtCurrency(ri.parcelasMensais)}</td><td>—</td></tr>
              <tr><td>% Receita Comprometida</td><td>${ri.comprometimentoReceita}%</td><td>${ri.comprometimentoReceita > 30 ? '🔴 Crítico' : ri.comprometimentoReceita > 15 ? '🟡 Atenção' : '🟢 Saudável'}</td></tr>
              <tr><td>Reserva de Emergência</td><td>${fmtCurrency(ri.reservaEmergencia)}</td><td>${ri.mesesReserva >= 6 ? '✅ Sólida' : ri.mesesReserva >= 3 ? '🟡 Razoável' : '🔴 Insuficiente'}</td></tr>
              <tr><td>Cobertura</td><td>${ri.mesesReserva} meses</td><td>Ideal: 3-6 meses</td></tr>
            </tbody>
          </table>
        </div>

        ${ri.comprometimentoReceita > 30 ? `
        <div class="alert-box">
          <div class="title">🚨 Endividamento Crítico</div>
          <div class="text">${ri.comprometimentoReceita}% da receita comprometida com dívidas. Priorize renegociação, consolidação e redução do endividamento.</div>
        </div>` : ''}

        ${ri.notes ? `<div class="insight-box"><div class="title">💡 Observações</div><div class="text">${ri.notes}</div></div>` : ''}
      </div>
      ` : ''}

      <!-- SIMULADOR DE DECISÕES -->
      ${decisoes.length > 0 ? `
      <div class="section page-break">
        <div class="section-badge">🧪 Decisões</div>
        <h2 class="section-title">Simulador de Decisões Estratégicas</h2>
        <p class="section-desc">${decisoes.length} decisões identificadas automaticamente com base nos dados preenchidos.</p>

        ${decisoes.map(d => `
        <div class="decision-card ${d.tipo}">
          <div class="d-badge" style="background: ${d.tipo === 'risco' ? '#fee2e2' : d.tipo === 'oportunidade' ? '#dcfce7' : '#fef3c7'}; color: ${d.tipo === 'risco' ? 'var(--red)' : d.tipo === 'oportunidade' ? 'var(--green)' : 'var(--orange)'};">
            ${d.tipo === 'risco' ? '⚠️ Risco' : d.tipo === 'oportunidade' ? '📈 Oportunidade' : '💡 Melhoria'} — ${d.impacto === 'alto' ? 'Alto Impacto' : d.impacto === 'medio' ? 'Médio Impacto' : 'Baixo Impacto'}
          </div>
          <div class="d-title">${d.titulo}</div>
          <div class="d-desc">${d.descricao}</div>
        </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- PLANO DE AÇÃO -->
      <div class="section page-break">
        <div class="section-badge">📋 Plano de Ação</div>
        <h2 class="section-title">Plano de Ação Consolidado</h2>
        <p class="section-desc">Ações prioritárias baseadas nos diagnósticos realizados.</p>

        <div class="action-plan">
          <div class="ap-title">🎯 Ações Prioritárias</div>

          ${gf.separacaoCpfCnpj > 0 && gf.separacaoCpfCnpj <= 2 ? `
          <div class="action-item">
            <div class="num">1</div>
            <div><div class="text">Separar completamente finanças PF e PJ</div><div class="detail">Abra conta empresarial exclusiva. Defina pró-labore fixo. Elimine retiradas não documentadas.</div></div>
          </div>` : ''}

          ${af.faturamentoMensal > 0 && folga < 0 ? `
          <div class="action-item">
            <div class="num">2</div>
            <div><div class="text">Atingir o ponto de equilíbrio</div><div class="detail">Faturamento mínimo: ${fmtCurrency(pe)}. Aumente receita e/ou reduza custos fixos de ${fmtCurrency(af.despesasFixas)}.</div></div>
          </div>` : ''}

          ${ri.mesesReserva > 0 && ri.mesesReserva < 3 ? `
          <div class="action-item">
            <div class="num">3</div>
            <div><div class="text">Construir reserva de emergência</div><div class="detail">Atual: ${ri.mesesReserva} meses. Meta: 6 meses de custos fixos. Separe 10% do lucro mensalmente.</div></div>
          </div>` : ''}

          ${mpAvg > 0 && mpAvg <= 2 ? `
          <div class="action-item">
            <div class="num">4</div>
            <div><div class="text">Estruturar processos financeiros básicos</div><div class="detail">Implemente: DRE mensal, fluxo de caixa semanal, conciliação bancária. Considere ERP ou planilhas estruturadas.</div></div>
          </div>` : ''}

          <div class="action-item">
            <div class="num">5</div>
            <div><div class="text">Implementar rotina de acompanhamento financeiro</div><div class="detail">Reunião semanal de 30 min: revisar caixa, cobranças, pagamentos e indicadores-chave. Responsável definido.</div></div>
          </div>

          ${ri.comprometimentoReceita > 30 ? `
          <div class="action-item">
            <div class="num">6</div>
            <div><div class="text">Renegociar e consolidar dívidas</div><div class="detail">Priorize quitar dívidas de maior taxa. Meta: comprometimento abaixo de 15% da receita.</div></div>
          </div>` : ''}
        </div>
      </div>

      <!-- CHECKLIST -->
      <div class="section page-break">
        <div class="section-badge">✅ Checklist</div>
        <h2 class="section-title">Checklist de Implementação</h2>
        <p class="section-desc">Itens acionáveis organizados por prioridade. Clique nas caixas para marcar concluídos.</p>

        <div class="checklist-cat">
          <div class="checklist-header">🔴 Urgente — Fazer Agora</div>
          <div class="checklist-items">
            ${gf.separacaoCpfCnpj > 0 && gf.separacaoCpfCnpj <= 2 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Separar contas PF e PJ completamente</div></div>` : ''}
            ${af.faturamentoMensal > 0 && folga < 0 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Criar plano de ação para atingir ponto de equilíbrio (${fmtCurrency(pe)})</div></div>` : ''}
            ${ri.comprometimentoReceita > 30 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Renegociar dívidas — comprometimento em ${ri.comprometimentoReceita}%</div></div>` : ''}
            ${saldo30 < 0 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Resolver projeção de caixa negativo nos próximos 30 dias</div></div>` : ''}
            ${gapCG > 0 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Buscar capital de giro — gap de ${fmtCurrency(gapCG)}</div></div>` : ''}
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Implementar controle de fluxo de caixa semanal</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Criar DRE mensal gerencial</div></div>
          </div>
        </div>

        <div class="checklist-cat">
          <div class="checklist-header">🟡 Importante — Próximas 4 Semanas</div>
          <div class="checklist-items">
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Definir pró-labore fixo para sócios</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Revisar e documentar processos financeiros principais</div></div>
            ${ri.mesesReserva < 3 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Iniciar formação de reserva de emergência (meta: 6 meses)</div></div>` : ''}
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Calcular e monitorar ponto de equilíbrio mensalmente</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Implementar conciliação bancária semanal</div></div>
            ${kpi.cac > 0 && kpi.ltv > 0 && ltvCac < 3 ? `<div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Melhorar ratio LTV/CAC (atual: ${ltvCac}x, meta: 3x+)</div></div>` : ''}
          </div>
        </div>

        <div class="checklist-cat">
          <div class="checklist-header">🟢 Melhoria Contínua — Próximos 90 Dias</div>
          <div class="checklist-items">
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Implementar dashboard de indicadores financeiros</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Automatizar cobranças e pagamentos recorrentes</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Criar orçamento anual com metas mensais</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Avaliar e implementar sistema ERP/gestão financeira</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Realizar planejamento tributário</div></div>
            <div class="checklist-item"><div class="checkbox"></div><div class="checklist-text">Criar projeções financeiras de 6-12 meses</div></div>
          </div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div style="font-size:32px; margin-bottom:16px;">📊</div>
      <div class="f-title">Diagnóstico de Gestão Financeira</div>
      <div class="f-text">${project.nomeEmpresa} | Documento Estratégico Confidencial</div>
      <div class="f-date">Gerado em ${formatDate(new Date().toISOString())}</div>
    </div>
  </div>
</body>
</html>`;

  return html;
}

export function openFinancialReportInNewTab(project: Project, data: ConsultingData, blocks: BlockStatus[]) {
  const html = generateFinancialReport(project, data, blocks);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
