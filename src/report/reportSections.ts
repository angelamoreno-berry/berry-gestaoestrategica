import { ConsultingData, Project, BlockStatus } from "@/types/consulting";
import { getExecutiveMetrics } from "./executiveMetrics";

const CSS_V2 = `
:root {
  --cinza: #7A7A7A; --cinza-claro: #F0F0F0; --azul: #60A5FA; --verde: #47C97E;
  --surface-1: rgba(122,122,122,.045); --surface-2: rgba(122,122,122,.08); --surface-3: rgba(122,122,122,.13);
  --border: rgba(122,122,122,.26); --bg: #0A0A0B;
  --font-display: "IBM Plex Sans", -apple-system, sans-serif;
  --font-body: "Inter", -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}

@media print {
  :root {
    --bg: #FFFFFF; --txt-claro: #111111; --cinza: #555555;
    --surface-1: #F9F9FB; --surface-2: #F0F0F2; --surface-3: #E2E2E5;
    --border: #CCCCCC; --azul: #1E3A8A; --verde: #15803D;
  }
  * { 
    -webkit-print-color-adjust: exact !important; 
    print-color-adjust: exact !important; 
    color: var(--txt-claro) !important; 
  }
  body { background: #FFFFFF !important; color: #111111 !important; }
  
  .cover { background: #FFFFFF !important; min-height: 100vh !important; display: flex !important; page-break-after: always !important; }
  .cover *, .cover-badge { color: #111111 !important; border-color: #CCCCCC !important; }
  .cover-meta div { background: #F9F9FB !important; border-color: #DDDDDD !important; }
  .cover-meta label { color: #666666 !important; }
  
  .section { page-break-before: always !important; page-break-inside: avoid !important; }
  .exec-card, .faixa, .acao, .ind-item { page-break-inside: avoid !important; background: #F9F9FB !important; border: 1px solid #CCCCCC !important; }
  .checkbox-v2 { border: 2px solid #555 !important; background: #FFF !important; }
  .score-fill, .pfill { background: #15803D !important; }
  .score-big { color: #15803D !important; }
  .ind-positive { color: #15803D !important; }
  .ind-negative { color: #DC2626 !important; }
  .no-print { display: none !important; }
  .kicker { color: #15803D !important; }
  
  .berry-dots span { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .berry-dots .dot-1 { background-color: #60A5FA !important; }
  .berry-dots .dot-2 { background-color: #47C97E !important; }
  .berry-dots .dot-3 { border-color: #47C97E !important; background-color: transparent !important; }
  
  .dep-node { background: #F0F0F2 !important; border: 1px solid #CCCCCC !important; }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); background: var(--bg); color: var(--cinza-claro); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.wrap { max-width: 880px; margin: 0 auto; padding: 0 28px; }

.berry-header { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; justify-content: center; }
.berry-dots { display: flex; gap: 6px; }
.berry-dots span { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
.berry-dots .dot-1 { background-color: #60A5FA; }
.berry-dots .dot-2 { background-color: #47C97E; }
.berry-dots .dot-3 { border: 2px solid #47C97E; background-color: transparent; }
.berry-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; color: var(--txt-claro); letter-spacing: -0.01em; }

.cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 24px; background: radial-gradient(120% 90% at 50% 130%, rgba(13,48,164,.15), transparent 70%); }
.cover h1 { font-size: clamp(28px, 4.5vw, 44px); margin-bottom: 12px; font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; }
.cover .sub { color: var(--cinza); margin-bottom: 56px; font-size: 16px; }
.cover .empresa { font-size: 28px; font-weight: 600; margin-bottom: 40px; }
.cover-meta { display: grid; grid-template-columns: repeat(2, minmax(180px, 220px)); gap: 12px; }
.cover-meta div { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; text-align: left; }
.cover-meta label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--cinza); display: block; margin-bottom: 6px; }
.cover-badge { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--cinza); border: 1px solid var(--border); border-radius: 999px; padding: 10px 24px; margin-bottom: 44px; }

.section { padding: 80px 0 40px; }
.kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--verde); margin-bottom: 12px; font-weight: 500; }
.section h2 { font-size: 26px; color: #FFF; margin-bottom: 12px; font-family: var(--font-display); font-weight: 600; }
.section > .wrap > p.lead { color: #AAA; font-size: 15px; max-width: 600px; margin-bottom: 40px; }

.exec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
.exec-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 26px; }
.exec-card.full { grid-column: 1 / -1; }
.exec-card h3 { font-size: 12px; font-family: var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; color: var(--cinza); margin-bottom: 16px; font-weight: 500; }

.veredito-box { background: rgba(71, 201, 126, 0.05); border-left: 4px solid var(--verde); padding: 24px; border-radius: 0 16px 16px 0; margin-bottom: 24px; }
.veredito-box h4 { font-family: var(--font-display); font-size: 18px; color: #FFF; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
.veredito-box p { font-size: 15px; color: var(--cinza-claro); line-height: 1.6; }

.score-row { display: flex; align-items: baseline; gap: 6px; }
.score-big { font-size: 52px; font-weight: 700; color: var(--verde); font-family: var(--font-display); line-height: 1; }
.score-max { font-size: 18px; color: var(--cinza); font-weight: 500; font-family: var(--font-display); }
.score-bar { height: 6px; background: var(--surface-3); border-radius: 999px; margin-top: 16px; overflow: hidden; }
.score-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #0D30A4, var(--verde)); }
.combo { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 14px; line-height: 1.5; }
.combo:last-child { border-bottom: 0; padding-bottom: 0; }
.combo .n { font-family: var(--font-mono); color: #666; font-size: 12px; padding-top: 2px; }
.prioridade { font-size: 20px; font-weight: 600; color: var(--verde); line-height: 1.4; }
.exec-card p.exp { color: #999; font-size: 14px; margin-top: 12px; }

.dep-chain { display: flex; align-items: center; justify-content: space-between; background: var(--surface-1); border: 1px solid var(--border); padding: 20px; border-radius: 12px; margin: 32px 0; gap: 12px; }
.dep-node { flex: 1; text-align: center; background: var(--surface-2); padding: 12px; border-radius: 8px; border: 1px solid var(--border); }
.dep-node h5 { font-size: 13px; color: #FFF; margin-bottom: 4px; }
.dep-node small { font-size: 11px; color: var(--cinza); font-family: var(--font-mono); text-transform: uppercase; }
.dep-arrow { color: var(--verde); font-weight: 700; font-size: 18px; }

.progress-line { display: flex; align-items: center; gap: 16px; margin-top: 12px; font-size: 14px; }
.progress-line .plabel { width: 140px; color: #AAA; }
.pbar { flex: 1; height: 8px; background: var(--surface-3); border-radius: 999px; overflow: hidden; }
.pfill { height: 100%; background: linear-gradient(90deg, #0D30A4, var(--verde)); border-radius: 999px; }
.pval { font-family: var(--font-mono); width: 48px; text-align: right; color: var(--txt-claro); }

.faixa { margin-bottom: 24px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface-1); }
.faixa-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: rgba(255,255,255,0.02); font-weight: 600; font-size: 15px; border-bottom: 1px solid var(--border); }
.faixa-head small { margin-left: auto; font-family: var(--font-mono); font-size: 11px; color: var(--cinza); font-weight: 400; letter-spacing: 0.5px; }
.rmap-item { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-top: 1px solid var(--border); font-size: 14px; }
.rmap-item:first-of-type { border-top: none; }
.rmap-item .titulo { flex: 1; font-weight: 500; }
.checkbox-v2 { width: 18px; height: 18px; border: 2px solid var(--border); border-radius: 4px; flex-shrink: 0; background: var(--surface-1); }
.origem { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--cinza); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; white-space: nowrap; }

.acao { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
.acao h4 { font-size: 17px; margin-bottom: 8px; color: #FFF; }
.acao .desc { color: #AAA; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
.acao-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 13px; }
.acao-meta > div { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
.acao-meta label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--cinza); display: block; margin-bottom: 6px; }
.acao-meta .resultado { grid-column: 3 / -1; }

.interp { border-left: 3px solid var(--azul); background: var(--surface-2); border-radius: 0 12px 12px 0; padding: 16px 20px; font-size: 14px; color: #BBB; margin: 24px 0; line-height: 1.6; }
.ind-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
.ind-item { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.ind-item label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--cinza); display: block; margin-bottom: 8px; }
.ind-item .valor { font-size: 24px; font-weight: 700; font-family: var(--font-display); }
.ind-positive { color: var(--verde); }
.ind-negative { color: #EF4444; }
.ind-neutral { color: #EAB308; }

.fim { border-top: 1px solid var(--border); margin-top: 60px; padding: 60px 0 80px; text-align: center; }
.fim p { max-width: 600px; margin: 0 auto 16px; color: #999; font-size: 15px; }
footer { padding: 40px 0; text-align: center; color: #666; font-size: 12px; font-family: var(--font-mono); border-top: 1px solid var(--border); display: flex; justify-content: center; align-items: center; gap: 8px; }

.fab-container { position: fixed; top: 24px; right: 24px; display: flex; gap: 12px; z-index: 100; }
.fab-btn { padding: 10px 18px; background: #FFF; color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: var(--font-body); font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: 0.2s; }
.fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

@media (max-width: 640px) {
  .exec-grid, .acao-meta, .ind-grid, .cover-meta { grid-template-columns: 1fr; }
  .fab-container { top: auto; bottom: 24px; right: 24px; flex-direction: column; }
  .dep-chain { flex-direction: column; }
  .dep-arrow { transform: rotate(90deg); margin: 6px 0; }
}
`;

function esc(s: any): string {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function fmtCurrency(v: number): string {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}
function fmtDate(): string {
  return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function renderToolbar(): string {
  return `
  <div class="no-print fab-container">
    <button onclick="window.print()" class="fab-btn">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 002-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      Salvar PDF / Imprimir
    </button>
  </div>`;
}

function renderCover(data: ConsultingData, project: Project): string {
  const nome = project.nomeEmpresa || data.clienteNome || "Empresa";
  const fat = data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal || 0;
  return `
  <div class="cover">
    <div class="berry-header">
      <div class="berry-dots">
        <span class="dot-1"></span>
        <span class="dot-2"></span>
        <span class="dot-3"></span>
      </div>
      <span class="berry-text">Berry</span>
    </div>
    <div class="cover-badge">Documento Estratégico Confidencial</div>
    <h1>Plano de Estruturação<br>em Gestão</h1>
    <p class="sub">Guia estratégico e roadmap executivo consolidando os 14 blocos de diagnóstico</p>
    <div class="empresa">${esc(nome)}</div>
    <div class="cover-meta">
      <div><label>Responsável</label><span style="font-weight:500;color:#FFF;">${esc(project.responsavel || data.consultorNome || "-")}</span></div>
      <div><label>Emissão</label><span style="font-weight:500;color:#FFF;">${fmtDate()}</span></div>
      ${fat > 0 ? `<div><label>Faturamento</label><span style="font-weight:500;color:#FFF;">${fmtCurrency(fat)}/mês</span></div>` : ""}
      ${project.quantidadeColaboradores > 0 ? `<div><label>Colaboradores</label><span style="font-weight:500;color:#FFF;">${project.quantidadeColaboradores} pessoas</span></div>` : ""}
    </div>
  </div>`;
}

function renderResumo(m: any, data: ConsultingData, blocks: BlockStatus[]): string {
  const pct = blocks.length > 0 ? Math.round(blocks.reduce((s, b) => s + b.progress, 0) / blocks.length) : 0;
  const risks = m.risksDetailed && m.risksDetailed.length > 0
    ? m.risksDetailed.slice(0, 3).map((r: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(r.split('×')[0] || r)}</b> ${r.includes('×') ? '×' + esc(r.split('×')[1] || '') : ''}</span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhum risco crítico identificado.</span></div>`;
  const oport = m.opportunitiesDetailed && m.opportunitiesDetailed.length > 0
    ? m.opportunitiesDetailed.slice(0, 3).map((o: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(o.split('×')[0] || o)}</b> ${o.includes('×') ? '×' + esc(o.split('×')[1] || '') : ''}</span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhuma oportunidade mapeada.</span></div>`;
    
  return `
  <section class="section" id="resumo">
    <div class="wrap">
      <div class="kicker">Resumo Executivo</div>
      <h2>O cenário estratégico atual</h2>
      
      <div class="veredito-box">
        <h4>Veredito</h4>
        <p>A <b>${esc(data.clienteNome)}</b> possui uma base operacional estabelecida, mas enfrenta sérios riscos de subsistência e crescimento devido à ausência completa de visão e controle financeiro de caixa, associada a processos informais centrados no proprietário. <b>O risco crítico atual não é falta de mercado ou clientes, mas sim crescer sem margem e sem controle de caixa.</b></p>
      </div>
      
      <div class="exec-grid">
        <div class="exec-card">
          <h3>Nota Geral · Berry Score</h3>
          <div class="score-row">
            <span class="score-big">${m.berryScore}</span>
            <span class="score-max">/100</span>
          </div>
          <div class="score-bar"><div class="score-fill" style="width:${m.berryScore}%"></div></div>
          <p class="exp">${esc(m.berryScoreInterpretation)}</p>
        </div>
        <div class="exec-card">
          <h3>Maturidade Média</h3>
          <div class="score-row">
            <span class="score-big">${Math.round(m.avgMaturity*10)/10}</span>
            <span class="score-max">/5</span>
          </div>
          <div class="score-bar"><div class="score-fill" style="width:${(m.avgMaturity/5)*100}%"></div></div>
          <p class="exp" style="color:#FFF;font-weight:500;margin-top:12px;margin-bottom:4px;">Estágio: ${esc(m.maturityLabel)}</p>
          <p class="exp" style="margin-top:0">${esc(m.maturityBreakdown)}</p>
        </div>
        <div class="exec-card">
          <h3>3 Maiores Riscos <span style="text-transform:none;opacity:0.6">(Fraqueza × Ameaça)</span></h3>
          ${risks}
        </div>
        <div class="exec-card">
          <h3>3 Maiores Oportunidades <span style="text-transform:none;opacity:0.6">(Força × Oportunidade)</span></h3>
          ${oport}
        </div>
        <div class="exec-card">
          <h3>Prioridade Estratégica</h3>
          <div class="prioridade">${esc(m.strategicPriority)}</div>
          <p class="exp">Derivada da dimensão de menor maturidade operacional nos blocos analisados.</p>
        </div>
        <div class="exec-card">
          <h3>Objetivo · Próximos 12 meses</h3>
          <p style="font-weight:500;font-size:15px;color:#FFF;line-height:1.5">${esc(m.objective12Months) || "Estruturar as bases da gestão para permitir crescimento estável."}</p>
        </div>
        <div class="exec-card full">
          <h3>Avanço do Diagnóstico</h3>
          <div class="progress-line"><span class="plabel">Mapeamento dos Blocos</span><div class="pbar"><div class="pfill" style="width:${pct}%"></div></div><span class="pval">${pct}%</span></div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderRoadmap(data: ConsultingData): string {
  const d = data.diagnostico; const swot = data.swot;
  const isAudiovisual = String(data.clienteNome).toLowerCase().includes("video") || String(data.concorrentes.publicoAlvo).toLowerCase().includes("prod") || String(data.concorrentes.publicoAlvo).toLowerCase().includes("video");

  const acaoFin = isAudiovisual ? "Implantar precificação por projeto e apuração real de custos" : "Revisar precificação com base em valor percebido e mix";
  const acaoProc = isAudiovisual ? "Mapear e documentar os 3 processos de produção core (briefing, edição, entrega)" : "Mapear e documentar os 3 processos operacionais críticos";

  let h = `
  <section class="section" id="roadmap">
    <div class="wrap">
      <div class="kicker">Caminho Crítico</div>
      <h2>Fluxo de Dependência de Execução</h2>
      <p class="lead">Para crescer de forma sustentável, as ações devem seguir uma ordem lógica. Não tente pular etapas.</p>
      
      <div class="dep-chain">
        <div class="dep-node">
          <h5>1. Fundação</h5>
          <small>DRE & Caixa</small>
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>2. Engenharia</h5>
          <small>Margens & Preços</small>
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>3. Padronização</h5>
          <small>Processos Core</small>
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>4. Tração</h5>
          <small>Expansão</small>
        </div>
      </div>

      <div class="kicker" style="margin-top:50px">Planejamento Tático</div>
      <h2>Roadmap de Execução (12 Meses)</h2>
      <p class="lead">Iniciativas táticas prioritárias. Utilize os checkboxes para acompanhamento manual de progresso nas reuniões de diretoria.</p>`;
      
  if ((d.financas.level||0) <= 3) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #EF4444">CRÍTICA — até 30 dias<small>visibilidade e controle</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Implantar painel de indicadores (DRE gerencial) para apuração real de lucro</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> DRE mensal preenchido e rodando retroativo.</span></div><span class="origem">FINANÇAS</span></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Estruturar fluxo de caixa semanal de 8 semanas</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Projeção semanal atualizada.</span></div><span class="origem">FINANÇAS</span></div>
      </div>`;
  } else {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #EF4444">CRÍTICA — até 30 dias<small>otimização financeira</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Otimizar indicadores financeiros e buscar eficiência de custos (Margem)</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Plano de eficiência financeira rodando.</span></div><span class="origem">FINANÇAS</span></div>
      </div>`;
  }
  
  if ((d.mercado.level||0) <= 3) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #F97316">ALTA — até 3 meses<small>vendas e operações</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">${acaoProc}</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Fluxogramas core desenhados e validados.</span></div><span class="origem">PROCESSOS</span></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">${acaoFin}</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Nova tabela de precificação homologada.</span></div><span class="origem">MERCADO</span></div>
      </div>`;
  } else {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #F97316">ALTA — até 3 meses<small>tração comercial</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Testar novos canais de aquisição ou novas estratégias de valor (Upsell/Crossell)</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> 1 novo funil rodando.</span></div><span class="origem">MERCADO</span></div>
      </div>`;
  }
  
  h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #EAB308">MÉDIA — até 6 meses<small>gestão e pessoas</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Implementar rotina semanal de acompanhamento de KPIs da equipe</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Ata de reunião semanal de gestão.</span></div><span class="origem">GESTÃO</span></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">Definição formal de organograma, cultura e metas por cargo</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Descrição de funções assinada por cargo.</span></div><span class="origem">PESSOAS</span></div>
      </div>`;
      
  if (swot?.horizontes?.medio || swot?.horizontes?.longo) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #3B82F6">ESTRATÉGICA — até 12 meses<small>expansão e perpetuidade</small></div>
        <div class="rmap-item"><div class="checkbox-v2"></div><div style="flex:1"><span class="titulo" style="display:block;font-weight:600">${esc(swot.horizontes.medio || swot.horizontes.longo)}</span><span style="font-size:12px;color:var(--cinza)"><b>Entregável:</b> Marco estratégico homologado.</span></div><span class="origem">ESTRATÉGIA</span></div>
      </div>`;
  }
  h += `</div></section>`; return h;
}

function renderCapitulos(data: ConsultingData): string {
  const f = data.financeiro; 
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const desp = (f.despesasFixas||0)+(f.despesasVariaveis||0); const lucro=fat-desp;
  
  // Detectar dinamicamente o segmento do cliente para evitar misturar termos
  const segmentLower = String(data.clienteNome).toLowerCase() + " " + String(data.icp.descricao).toLowerCase();
  const isAudiovisual = segmentLower.includes("video") || segmentLower.includes("cafe") || segmentLower.includes("produtora") || segmentLower.includes("filme") || segmentLower.includes("criativo");

  // Ajustes de terminologia dinâmicos baseado no segmento real do cliente
  const termServico = isAudiovisual ? "produções e pacotes criativos" : "produtos e serviços ofertados";
  const termClientes = isAudiovisual ? "clientes corporativos e marcas" : "clientes e consumidores";
  const termMaoDeObra = isAudiovisual ? "editores, câmeras e freelas" : "balconistas e equipe operacional";
  const termProcessoCore = isAudiovisual ? "briefing, captação e edição" : "atendimento, compras e entrega";

  let h = "";
  let capCount = 1;
  
  const renderAcao = (titulo: string, desc: string, impacto: string, esforco: string, resultado: string) => `
    <div class="acao">
      <h4>${titulo}</h4>
      <p class="desc">${desc}</p>
      <div class="acao-meta">
        <div><label>Impacto</label><span style="color:var(--verde);font-weight:600">${impacto}</span></div>
        <div><label>Esforço</label><span style="color:var(--cinza)">${esforco}</span></div>
        <div class="resultado"><label>Resultado esperado</label>${resultado}</div>
      </div>
    </div>`;

  // CAPÍTULO 1: FINANÇAS
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Pilar Financeiro</div>
      <h2>Quanto isso está custando?</h2>
      <p class="lead">Análise da saúde financeira, do ciclo de caixa por projeto e da margem de lucro líquido real.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> Sem a separação rígida das contas pessoais e da empresa, associada a custos flutuantes de freelas e equipamentos, o faturamento aparente é uma ilusão de caixa. É urgente apurar a margem por projeto ou lote.
      </div>
      
      ${fat > 0 ? `
      <div class="ind-grid">
        <div class="ind-item"><label>Faturamento Mensal</label><div class="valor">${fmtCurrency(fat)}</div></div>
        <div class="ind-item"><label>Despesa Geral Estimada</label><div class="valor ind-negative">${fmtCurrency(desp)}</div></div>
        <div class="ind-item"><label>Margem Líquida Estimada</label><div class="valor ${lucro > 0 ? 'ind-positive' : 'ind-negative'}">${fat > 0 ? Math.round((lucro/fat)*100) : 0}%</div></div>
        ${f.metaFaturamento > 0 ? `<div class="ind-item"><label>Meta de Receita</label><div class="valor ind-neutral">${fmtCurrency(f.metaFaturamento)}</div></div>` : ""}
      </div>` : ""}
      
      ${renderAcao(
        "Implantar DRE & Divisão de Contas", 
        "Separação absoluta das contas pessoais (PF/PJ), fixando pró-labore rígido para os sócios, com apuração mensal de DRE para calcular margem real de lucro.", 
        "★★★★★", "★★☆☆☆", 
        "Saber exatamente quanto sobra de lucro real no caixa no fechamento de cada mês."
      )}
    </div>
  </section>`;

  // CAPÍTULO 2: MERCADO E COMERCIAL
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Pilar Comercial</div>
      <h2>Como crescer?</h2>
      <p class="lead">Canais de atração ativa, ajuste de precificação baseada em valor de mercado e novos pacotes de receita recorrente.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> O negócio precisa parar de depender exclusivamente de indicações espontâneas e criar uma máquina de aquisição previsível. A engenharia de preços deve focar em vender valor agregado e inteligência técnica, não apenas horas de serviço.
      </div>
      
      ${renderAcao(
        `Engenharia de Preços e Mix de ${isAudiovisual ? 'Projetos' : 'Produtos'}`, 
        `Desenvolver pacotes estruturados com foco em elevar o ticket médio e criar opções de recorrência mensal (como assinaturas ou contratos de longo prazo) para oxigenar o caixa.`, 
        "★★★★☆", "★★☆☆☆", 
        `Estabilização de receita mensal e previsibilidade de caixa através de recorrência sã.`
      )}
    </div>
  </section>`;
  
  // CAPÍTULO 3: OPERAÇÕES
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Pilar Operacional</div>
      <h2>O que está travando?</h2>
      <p class="lead">Gargalos operacionais, ineficiências manuais que drenam o tempo do proprietário e falta de manuais críticos.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> A centralização extrema de decisões e execuções no proprietário cria um teto de crescimento físico. A operação em ${esc(termProcessoCore)} deve rodar sob padrões fáceis de serem executados por terceiros.
      </div>
      
      ${renderAcao(
        `Documentação Operacional Core`, 
        `Isolar, desenhar e documentar o passo a passo das 3 atividades diárias que mais demandam tempo ou geram retrabalho na empresa, estruturando playbooks rápidos.`, 
        "★★★★☆", "★★★☆☆", 
        "Descentralização do conhecimento, redução drástica de erros operacionais e liberação do proprietário para o estratégico."
      )}
    </div>
  </section>`;

  // CAPÍTULO 4: PESSOAS
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Pilar de Liderança</div>
      <h2>Quem precisa mudar?</h2>
      <p class="lead">Readequação de papéis organizacionais, definição clara de responsabilidades por escopo e metas de bônus por resultado.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> A equipe deve atuar de forma mais autônoma e produtiva. Cada colaborador de ${esc(termMaoDeObra)} ou administrativo precisa ter metas individuais claras vinculadas diretamente ao resultado e lucratividade do negócio.
      </div>
      
      ${renderAcao(
        `Definição de Funções e Metas de Desempenho`, 
        `Mapear papéis ideais e alinhar metas financeiras ou de entrega com bônus e premiações vinculadas aos resultados reais apurados no DRE.`, 
        "★★★★★", "★★★☆☆", 
        `Equipe engajada, focada na alta performance e comprometida com a saúde financeira do negócio.`
      )}
    </div>
  </section>`;

  return h;
}

function renderFinal(): string {
  return `
  <section class="fim no-print" id="proximos-passos">
    <div class="wrap">
      <div class="kicker">Próximos Passos</div>
      <h2>A Execução Faz o Estrategista</h2>
      <p>Este diagnóstico agrupou inteligentemente 14 áreas da sua empresa em pilares executivos. Os dados revelam as oportunidades, mas apenas a implementação implacável transformará estes insights em caixa na conta e eficiência operacional.</p>
      <p>Utilize o Roadmap do início deste documento e seus checkboxes físicos para cobrar avanço real nas próximas reuniões de diretoria.</p>
    </div>
  </section>
  <footer>
    <div class="berry-dots">
      <span class="dot-1" style="width:10px;height:10px"></span>
      <span class="dot-2" style="width:10px;height:10px"></span>
      <span class="dot-3" style="width:10px;height:10px;border-width:1.5px"></span>
    </div>
    <span class="berry-text" style="font-size:14px;color:#888;font-weight:600;margin-left:4px">Berry</span>
    <span style="color:#555">· Plano de Estruturação · Gerado em ${fmtDate()}</span>
  </footer>`;
}

export function render(html: string): string {
  return html;
}

export function generateReportV2(data: ConsultingData, project: Project, blocks: BlockStatus[]): string {
  const m = getExecutiveMetrics(data);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano Executivo · ${esc(project.nomeEmpresa||data.clienteNome)}</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS_V2}</style></head><body>${renderToolbar()}<div class="wrap">${renderCover(data,project)}${renderResumo(m,data,blocks)}${renderRoadmap(data)}${renderCapitulos(data)}${renderFinal()}</div><script>document.title = "Plano Executivo - ${esc(project.nomeEmpresa||data.clienteNome)}";</script></body></html>`;
}
