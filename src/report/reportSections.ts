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
  .exec-card, .faixa, .acao, .ind-item, .comparison-card, .dash-card { page-break-inside: avoid !important; background: #F9F9FB !important; border: 1px solid #CCCCCC !important; }
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

/* Cabeçalho Berry */
.berry-header { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; justify-content: center; }
.berry-dots { display: flex; gap: 6px; }
.berry-dots span { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
.berry-dots .dot-1 { background-color: #60A5FA; }
.berry-dots .dot-2 { background-color: #47C97E; }
.berry-dots .dot-3 { border: 2px solid #47C97E; background-color: transparent; }
.berry-text { font-family: var(--font-display); font-weight: 700; font-size: 20px; color: var(--txt-claro); letter-spacing: -0.01em; }

/* Capa */
.cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 24px; background: radial-gradient(120% 90% at 50% 130%, rgba(13,48,164,.15), transparent 70%); }
.cover h1 { font-size: clamp(28px, 4.5vw, 44px); margin-bottom: 12px; font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em; }
.cover .sub { color: var(--cinza); margin-bottom: 56px; font-size: 16px; }
.cover .empresa { font-size: 28px; font-weight: 600; color: #FFF; margin-bottom: 40px; }
.cover-meta { display: grid; grid-template-columns: repeat(2, minmax(180px, 220px)); gap: 12px; }
.cover-meta div { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; text-align: left; }
.cover-meta label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--cinza); display: block; margin-bottom: 6px; }
.cover-badge { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--cinza); border: 1px solid var(--border); border-radius: 999px; padding: 10px 24px; margin-bottom: 44px; }

/* Seções */
.section { padding: 80px 0 40px; }
.kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--verde); margin-bottom: 12px; font-weight: 500; }
.section h2 { font-size: 26px; color: #FFF; margin-bottom: 12px; font-family: var(--font-display); font-weight: 600; }
.section > .wrap > p.lead { color: #AAA; font-size: 15px; max-width: 600px; margin-bottom: 40px; }

/* Resumo */
.exec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
.exec-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 26px; }
.exec-card.full { grid-column: 1 / -1; }
.exec-card h3 { font-size: 12px; font-family: var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; color: var(--cinza); margin-bottom: 16px; font-weight: 500; }

/* Veredito */
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

/* Cadeia de Dependencia */
.dep-chain { display: flex; align-items: center; justify-content: space-between; background: var(--surface-1); border: 1px solid var(--border); padding: 20px; border-radius: 12px; margin: 32px 0; gap: 12px; }
.dep-node { flex: 1; text-align: center; background: var(--surface-2); padding: 12px; border-radius: 8px; border: 1px solid var(--border); }
.dep-node h5 { font-size: 13px; color: #FFF; margin-bottom: 4px; }
.dep-node small { font-size: 11px; color: var(--cinza); font-family: var(--font-mono); text-transform: uppercase; }
.dep-arrow { color: var(--verde); font-weight: 700; font-size: 18px; }

/* Playbook Roadmap Modules */
.playbook-module { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 32px; overflow: hidden; }
.playbook-header { padding: 24px; border-bottom: 1px solid var(--border); }
.playbook-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.playbook-horizonte { font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; padding: 6px 14px; border-radius: 999px; }
.playbook-urgencia { font-size: 13px; color: var(--cinza); font-weight: 500; }
.playbook-title { font-size: 22px; font-weight: 600; color: #FFF; font-family: var(--font-display); margin-bottom: 16px; }

.playbook-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); }
.playbook-col { padding: 24px; border-right: 1px solid var(--border); }
.playbook-col:last-child { border-right: none; }
.playbook-col h5 { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--cinza); margin-bottom: 12px; }
.playbook-col p { font-size: 14px; color: #CCC; line-height: 1.6; }

.playbook-iniciativas { padding: 24px; background: var(--surface-2); border-top: 1px solid var(--border); }
.playbook-iniciativas h5 { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--cinza); margin-bottom: 16px; }
.playbook-iniciativa-item { display: flex; gap: 16px; margin-bottom: 16px; align-items: flex-start; }
.playbook-iniciativa-item:last-child { margin-bottom: 0; }
.checkbox-v2 { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 4px; flex-shrink: 0; background: var(--surface-1); margin-top: 2px; }
.playbook-iniciativa-text { font-size: 15px; color: #FFF; font-weight: 500; line-height: 1.5; }

/* Comparação Hoje vs Amanhã */
.comparison-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px; }
.comparison-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.comparison-card h3 { font-size: 18px; color: #FFF; font-family: var(--font-display); margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
.comparison-list { list-style: none; }
.comparison-item { display: flex; gap: 12px; margin-bottom: 12px; font-size: 14px; line-height: 1.5; }
.comparison-item .icon { font-size: 16px; flex-shrink: 0; }

/* Dashboard Card */
.dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 24px; }
.dash-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.dash-card h4 { font-size: 16px; color: #FFF; font-family: var(--font-display); margin-bottom: 12px; }
.dash-card-meta { display: flex; justify-content: space-between; margin-bottom: 16px; background: var(--surface-2); padding: 12px; border-radius: 8px; font-size: 14px; }
.dash-card-meta label { color: var(--cinza); font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; }
.dash-card p { font-size: 13px; color: #AAA; line-height: 1.6; }

/* Rodapé */
.fim { border-top: 1px solid var(--border); margin-top: 60px; padding: 60px 0 80px; text-align: center; }
.fim p { max-width: 600px; margin: 0 auto 16px; color: #999; font-size: 15px; }
footer { padding: 40px 0; text-align: center; color: #666; font-size: 12px; font-family: var(--font-mono); border-top: 1px solid var(--border); display: flex; justify-content: center; align-items: center; gap: 8px; }

/* Barra de Ferramentas */
.fab-container { position: fixed; top: 24px; right: 24px; display: flex; gap: 12px; z-index: 100; }
.fab-btn { padding: 10px 18px; background: #FFF; color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: var(--font-body); font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: 0.2s; }
.fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

@media (max-width: 640px) {
  .exec-grid, .playbook-grid, .comparison-container, .dash-grid { grid-template-columns: 1fr; }
  .playbook-col { border-right: none; border-bottom: 1px solid var(--border); }
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
  const fat = data.financeiro?.faturamentoAtual || data.financeiro?.faturamentoMensal || 0;
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
    <h1>Plano Executivo<br>de Transformação</h1>
    <p class="sub">Mapeamento transversal de 14 blocos de diagnóstico e plano de ação estruturado</p>
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
      <h2>O Cenário Estratégico Atual</h2>
      
      <div class="veredito-box">
        <h4>Veredito Executivo</h4>
        <p>A <b>${esc(data.clienteNome)}</b> tem fundamentos operacionais estabelecidos, mas enfrenta gaps gerenciais que ameaçam sua margem de contribuição. O desafio atual de escala exige controle imediato de caixa e reestruturação comercial, substituindo esforços empíricos por processos orientados a dados.</p>
      </div>

      <div class="exec-grid">
        <div class="exec-card">
          <h3>Nota Geral · Berry Score</h3>
          <div class="score-row"><span class="score-big">${m.berryScore}</span><span class="score-max">/100</span></div>
          <div class="score-bar"><div class="score-fill" style="width:${m.berryScore}%"></div></div>
          <p class="exp">${esc(m.berryScoreInterpretation)}</p>
        </div>
        <div class="exec-card">
          <h3>Maturidade Média</h3>
          <div class="score-row"><span class="score-big">${Math.round(m.avgMaturity*10)/10}</span><span class="score-max">/5</span></div>
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
      </div>
    </div>
  </section>`;
}

function classifyPriorities(prioridades: any[], diagnostico: any, swot: any) {
  const critica = [];
  const alta = [];
  const media = [];
  const estrategica = [];

  const baseLevel = (diagnostico?.financas?.level || 2) + (diagnostico?.processos?.level || 2) / 2;

  (prioridades || []).forEach((p: any) => {
    if (p.importancia === 'alta') {
      if (baseLevel <= 2) critica.push(p);
      else alta.push(p);
    } else if (p.importancia === 'media') {
      media.push(p);
    } else {
      estrategica.push(p);
    }
  });

  if (critica.length === 0 && alta.length > 0) {
    critica.push(alta.shift());
  }

  if (swot?.horizontes?.longo) {
    estrategica.push({ descricao: swot.horizontes.longo, importancia: 'baixa' });
  }

  return { critica, alta, media, estrategica };
}

function generateDynamicModule(title: string, color: string, bgHead: string, horizonte: string, prazo: string, prioridades: any[]) {
  if (!prioridades || prioridades.length === 0) return "";
  
  let h = "";

  prioridades.forEach((p) => {
    const isFin = p.descricao.toLowerCase().includes("finan") || p.descricao.toLowerCase().includes("caixa") || p.descricao.toLowerCase().includes("fatura") || p.descricao.toLowerCase().includes("dre");
    const isMercado = p.descricao.toLowerCase().includes("vendas") || p.descricao.toLowerCase().includes("cliente") || p.descricao.toLowerCase().includes("market") || p.descricao.toLowerCase().includes("preco") || p.descricao.toLowerCase().includes("precificacao");

    const objEstrategico = isFin ? "Construir uma gestão financeira previsível e com clareza de margem."
      : isMercado ? "Estruturar uma máquina de atração e vendas previsível."
      : "Estabelecer uma operação autônoma sem gargalos de liderança.";

    const valorGerado = isFin ? "Aumento imediato de margem líquida, eliminação de vazamentos e blindagem de fluxo de caixa."
      : isMercado ? "Previsibilidade de receita, otimização de ticket médio e diminuição do custo de aquisição (CAC)."
      : "Descentralização operacional, ganho de produtividade da equipe e liberação de tempo estratégico do sócio.";

    const resultadoEsperado = isFin ? "DRE gerencial rodando mensalmente com dados reais e previsibilidade de caixa para 8 semanas."
      : isMercado ? "Nova esteira de pacotes de serviços ativa e canais orgânicos monitorados com ROI positivo."
      : "Processos críticos documentados em manual de acesso rápido e equipe atuando sem microgerenciamento.";

    const iniciativa1 = isFin ? "Levantamento de extratos bancários e planilhamento de despesas fixas conhecidas." : "Mapeamento dos diferenciais de mercado vs concorrência direta.";
    const iniciativa2 = isFin ? "Separação de despesas pessoais (PF) e fixação de pró-labore rígido para sócios." : "Treinamento tático da equipe comercial e homologação de metas por cargo.";

    h += `
    <div class="playbook-module">
      <div class="playbook-header" style="background: ${bgHead}">
        <div class="playbook-header-top">
          <span class="playbook-horizonte" style="background: ${color}; color: #FFF;">${horizonte} — ${prazo}</span>
        </div>
        <h3 class="playbook-title">${esc(p.descricao)}</h3>
      </div>
      <div>
        <div class="playbook-grid">
          <div class="playbook-col">
            <h5>1. Objetivo Estratégico</h5>
            <p style="font-size: 16px; color: #FFF; font-weight: 500">${objEstrategico}</p>
          </div>
          <div class="playbook-col">
            <h5>2. Valor Gerado ao Negócio</h5>
            <p>${valorGerado}</p>
          </div>
        </div>
        <div class="playbook-grid">
          <div class="playbook-col" style="background: var(--surface-2)">
            <h5>3. Principais Iniciativas</h5>
            <div class="playbook-iniciativa-item">
              <div class="checkbox-v2" style="border-color: ${color}"></div>
              <div class="playbook-iniciativa-text">${iniciativa1}</div>
            </div>
            <div class="playbook-iniciativa-item">
              <div class="checkbox-v2" style="border-color: ${color}"></div>
              <div class="playbook-iniciativa-text">${iniciativa2}</div>
            </div>
          </div>
          <div class="playbook-col" style="background: var(--surface-2)">
            <h5>4. Indicador de Sucesso</h5>
            <p style="color: ${color}; font-weight: 500">${resultadoEsperado}</p>
          </div>
        </div>
      </div>
    </div>`;
  });

  return h;
}

function renderPlaybook(data: ConsultingData): string {
  const p = classifyPriorities(data.agendaCEO?.prioridades || [], data.diagnostico, data.swot);
  
  let h = `
  <section class="section" id="roadmap">
    <div class="wrap">
      <div class="kicker">Jornada de Evolução</div>
      <h2>Plano de Transformação (12 Meses)</h2>
      <p class="lead">Abaixo, as capacidades organizacionais essenciais para estruturar e estabilizar o negócio, agrupadas por urgência.</p>
      
      <div class="dep-chain">
        <div class="dep-node">
          <h5>1. Sobrevivência</h5>
          <small>DRE & Caixa</small>
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>2. Estabilização</h5>
          <small>Capacidades</small> 
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>3. Crescimento</h5>
          <small>Otimização</small>
        </div>
        <div class="dep-arrow">➔</div>
        <div class="dep-node">
          <h5>4. Consolidação</h5>
          <small>Autonomia</small>
        </div>
      </div>
      <div style="margin-top:40px"></div>
      `;

  h += generateDynamicModule("Sobrevivência e Visibilidade de Gargalos", "#EF4444", "rgba(239, 68, 68, 0.1)", "Crítico", "Até 30 dias", p.critica);
  h += generateDynamicModule("Estabilização da Máquina e Capacidades", "#F97316", "rgba(249, 115, 22, 0.1)", "Alta Prioridade", "Até 3 meses", p.alta);
  h += generateDynamicModule("Otimização de Gestão e Crescimento", "#EAB308", "rgba(234, 179, 8, 0.1)", "Média Prioridade", "Até 6 meses", p.media);
  h += generateDynamicModule("Autonomia, Consolidação e Escala", "#3B82F6", "rgba(59, 130, 246, 0.1)", "Estratégica", "Até 12 meses", p.estrategica);

  h += `</div></section>`;
  return h;
}

function renderTransformacao(data: ConsultingData): string {
  const f = data.financeiro;
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const segmentLower = String(data.clienteNome).toLowerCase() + " " + String(data.icp.descricao).toLowerCase();
  const isAudiovisual = segmentLower.includes("video") || segmentLower.includes("cafe") || segmentLower.includes("produtora") || segmentLower.includes("filme");

  const finHoje = [
    "Mistura frequente de despesas pessoais e profissionais no caixa principal.",
    fat > 0 ? `Receita de ${fmtCurrency(fat)} gerida sem DRE gerencial mensal.` : "Ausência de demonstrativos financeiros estruturados de lucro real.",
    "Decisões táticas tomadas estritamente pelo saldo de conta corrente."
  ];
  const finAmanha = [
    "Contas de despesas 100% separadas e pró-labore rígido para sócios.",
    "DRE mensal gerencial preenchida e interpretada todo dia 5.",
    "Fluxo de caixa projetado para as próximas 8 semanas sem surpresas."
  ];

  const procHoje = [
    isAudiovisual ? "Conhecimento operacional retido na cabeça do proprietário." : "Processos operacionais executados de forma empírica e variável.",
    "Processos manuais e dependência do líder para resolver táticas diárias.",
    "Sem indicadores claros de erro operacional ou produtividade de entrega."
  ];
  const procAmanha = [
    "Playbooks e fluxogramas core desenhados e centralizados em nuvem.",
    "Operação de rotina executada de forma autônoma pela equipe.",
    "Indicador de qualidade (SLAs) monitorado com taxa de falha inferior a 5%."
  ];

  const pesHoje = [
    "Divisão de funções informal e organograma de papéis confuso.",
    "Falta de reuniões de alinhamento tático sistemáticas.",
    "Equipe operando sem metas claras de performance vinculadas ao caixa."
  ];
  const pesAmanha = [
    "Organograma estruturado com funções e responsabilidades assinadas.",
    "Ritual de reuniões táticas semanais ativas na agenda de rotina.",
    "Comissão e bônus da equipe atrelados diretamente ao resultado do DRE."
  ];

  const merHoje = [
    "Dependência majoritária de canais de indicação espontânea.",
    "Estratégia comercial passiva e sem funil estruturado.",
    "Precificação baseada apenas em custo ou mercado (markup simples)."
  ];
  const merAmanha = [
    "Esteira de ofertas de valor ativo com produtos recorrentes (LTV).",
    "Funis de aquisição ativa operando com métricas claras de CAC e ROI.",
    "Tabela de precificação premium ancorada no Valor Percebido."
  ];

  const renderCard = (title: string, hoje: string[], amanha: string[]) => `
  <div class="comparison-card">
    <h3>${title}</h3>
    <div style="margin-bottom: 16px;">
      <h4 style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:var(--cinza); margin-bottom:8px">Hoje</h4>
      <ul class="comparison-list">
        ${hoje.map(item => `<li class="comparison-item"><span class="icon">❌</span><span>${esc(item)}</span></li>`).join("")}
      </ul>
    </div>
    <div>
      <h4 style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:var(--verde); margin-bottom:8px">Após a Transformação</h4>
      <ul class="comparison-list">
        ${amanha.map(item => `<li class="comparison-item"><span class="icon">✅</span><span>${esc(item)}</span></li>`).join("")}
      </ul>
    </div>
  </div>`;

  return `
  <section class="section page-break">
    <div class="wrap">
      <div class="kicker">Estado Futuro</div>
      <h2>Transformação Esperada</h2>
      <p class="lead">Visão comparativa de como a empresa opera hoje e como operará após a implantação sã das capacidades do Playbook.</p>
      
      <div class="comparison-container">
        ${renderCard("Finanças", finHoje, finAmanha)}
        ${renderCard("Processos", procHoje, procAmanha)}
        ${renderCard("Pessoas", pesHoje, pesAmanha)}
        ${renderCard("Mercado", merHoje, merAmanha)}
      </div>
    </div>
  </section>`;
}

function renderDashboard(data: ConsultingData): string {
  const f = data.financeiro;
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const cols = data.organograma?.cargos?.length || 3;
  const segmentLower = String(data.clienteNome).toLowerCase() + " " + String(data.icp.descricao).toLowerCase();
  const isAudiovisual = segmentLower.includes("video") || segmentLower.includes("cafe") || segmentLower.includes("produtora") || segmentLower.includes("filme");

  const indicators = [
    {
      nome: "Margem Líquida Real",
      hoje: fat > 0 ? `${Math.round(((fat - (f.despesasFixas + f.despesasVariaveis)) / fat)*100)}%` : "Não medida",
      meta: "Mínimo 25%",
      justificativa: "Garantir saúde financeira e fluxo líquido de caixa livre após o pagamento de todas as despesas e freelas."
    },
    {
      nome: isAudiovisual ? "Ciclo de Caixa por Projeto" : "Prazo Médio de Recebimento",
      hoje: "Impreciso",
      meta: "Sincronizado (<30 dias)",
      justificativa: "Prevenir descasamento de caixa entre pagamentos a fornecedores/equipes e recebimento das parcelas das marcas."
    },
    {
      nome: "Rotina de Reuniões Táticas",
      hoje: "Nula ou Informal",
      meta: "100% de Adesão (Semanal)",
      justificativa: "Garantir governança, cobrar metas da equipe de balcão e manter o plano executivo rodando com disciplina."
    },
    {
      nome: "Playbooks de Processos Core",
      hoje: "0% Documentado",
      meta: "3 Processos Chave",
      justificativa: "Descentralizar a operação da cabeça do sócio e permitir treinamento rápido de novos colaboradores ou freelancers."
    }
  ];

  return `
  <section class="section page-break">
    <div class="wrap">
      <div class="kicker">Governança</div>
      <h2>Dashboard Executivo</h2>
      <p class="lead">Indicadores-chave que a diretoria deve monitorar mensalmente para homologar o progresso do plano de transformação.</p>
      
      <div class="dash-grid">
        ${indicators.map(ind => `
          <div class="dash-card">
            <h4>${esc(ind.nome)}</h4>
            <div class="dash-card-meta">
              <div><label>Hoje</label><div style="font-weight:700; color:#FFF; margin-top:2px">${esc(ind.hoje)}</div></div>
              <div><label>Meta 12 Meses</label><div style="font-weight:700; color:var(--verde); margin-top:2px">${esc(ind.meta)}</div></div>
            </div>
            <p>${esc(ind.justificativa)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>`;
}

function renderFinal(): string {
  return `
  <section class="fim no-print" id="proximos-passos">
    <div class="wrap">
      <div class="kicker">Acompanhamento</div>
      <h2>O Método Berry</h2>
      <p>O valor de um Playbook Executivo reside estritamente na disciplina de sua execução. O diagnóstico aponta os gargalos, mas o acompanhamento constante é o que gera a real transformação.</p>
      <p>Recomendamos reuniões de rituais semanais para atualizar as caixas de check e calibrar as metas operacionais.</p>
    </div>
  </section>
  <footer>
    <div class="berry-dots">
      <span class="dot-1" style="width:10px;height:10px"></span>
      <span class="dot-2" style="width:10px;height:10px"></span>
      <span class="dot-3" style="width:10px;height:10px;border-width:1.5px"></span>
    </div>
    <span class="berry-text" style="font-size:14px;color:#888;font-weight:600;margin-left:4px">Berry</span>
    <span style="color:#555">· Plano de Transformação · Gerado em ${fmtDate()}</span>
  </footer>`;
}

export function render(html: string): string {
  return html;
}

export function generateReportV2(data: ConsultingData, project: Project, blocks: BlockStatus[]): string {
  const m = getExecutiveMetrics(data);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano Executivo · ${esc(project.nomeEmpresa||data.clienteNome)}</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS_V2}</style></head><body>${renderToolbar()}<div class="wrap">${renderCover(data,project)}${renderResumo(m,data,blocks)}${renderPlaybook(data)}${renderTransformacao(data)}${renderDashboard(data)}${renderFinal()}</div><script>document.title = "Plano Executivo - ${esc(project.nomeEmpresa||data.clienteNome)}";</script></body></html>`;
}
