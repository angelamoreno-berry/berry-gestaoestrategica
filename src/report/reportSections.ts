import { ConsultingData, Project, BlockStatus } from "@/types/consulting";
import { getExecutiveMetrics } from "./executiveMetrics";

const CSS_V2 = `
:root {
  --cinza: #7A7A7A; --cinza-claro: #F0F0F0; --azul: #0D30A4; --verde: #47C97E;
  --surface-1: rgba(122,122,122,.045); --surface-2: rgba(122,122,122,.08); --surface-3: rgba(122,122,122,.13);
  --border: rgba(122,122,122,.26); --bg: #0A0A0B;
  --font-display: "IBM Plex Sans", -apple-system, sans-serif;
  --font-body: "Inter", -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}

@media print {
  :root {
    --bg: #FFFFFF; --txt: #111111; --txt-2: #444444;
    --surface-1: #F8F8F8; --surface-2: #F0F0F0; --surface-3: #E5E5E5;
    --border: #DDDDDD;
  }
  * { 
    -webkit-print-color-adjust: exact !important; 
    print-color-adjust: exact !important; 
    color: var(--txt) !important; 
  }
  body { background: #FFFFFF !important; }
  
  /* Capa no print */
  .cover { background: #050505 !important; page-break-after: always; }
  .cover *, .cover-badge { color: #FFFFFF !important; border-color: rgba(255,255,255,0.2) !important; }
  .cover-meta div { background: #111 !important; border-color: #333 !important; }
  .cover-meta label { color: #999 !important; }
  
  .section { page-break-after: always; }
  .exec-card, .faixa, .acao, .ind-item { page-break-inside: avoid; border: 1px solid #CCC !important; }
  .score-fill, .pfill { background: #47C97E !important; }
  .ind-positive { color: #15803D !important; }
  .ind-negative { color: #DC2626 !important; }
  .no-print { display: none !important; }
  .kicker { color: #15803D !important; }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); background: var(--bg); color: var(--txt-claro, #F0F0F0); line-height: 1.65; }
.wrap { max-width: 880px; margin: 0 auto; padding: 0 28px; }

/* Capa */
.cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 24px; background: radial-gradient(120% 90% at 50% 130%, rgba(13,48,164,.15), transparent 70%); }
.cover h1 { font-size: clamp(28px, 4vw, 42px); margin-bottom: 12px; font-family: var(--font-display); font-weight: 700; color: #FFF; }
.cover .sub { color: #999; margin-bottom: 56px; font-size: 16px; }
.cover .empresa { font-size: 28px; font-weight: 600; color: #FFF; margin-bottom: 40px; }
.cover-meta { display: grid; grid-template-columns: repeat(2, minmax(180px, 220px)); gap: 12px; }
.cover-meta div { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; text-align: left; }
.cover-meta label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; display: block; margin-bottom: 6px; }
.cover-badge { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #AAA; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 10px 24px; margin-bottom: 44px; }

/* Typo & Layout */
.section { padding: 80px 0 40px; }
.kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--verde); margin-bottom: 12px; font-weight: 500; }
.section h2 { font-size: 26px; color: #FFF; margin-bottom: 12px; font-family: var(--font-display); font-weight: 600; }
.section > .wrap > p.lead { color: #AAA; font-size: 15px; max-width: 600px; margin-bottom: 40px; }

/* Grid Executivo */
.exec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
.exec-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 26px; }
.exec-card.full { grid-column: 1 / -1; }
.exec-card h3 { font-size: 12px; font-family: var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; color: #888; margin-bottom: 16px; font-weight: 500; }
.score-big { font-size: 52px; font-weight: 700; color: var(--verde); font-family: var(--font-display); line-height: 1; }
.score-bar { height: 6px; background: var(--surface-3); border-radius: 999px; margin-top: 16px; overflow: hidden; }
.score-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--azul), var(--verde)); }
.combo { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 14px; line-height: 1.5; }
.combo:last-child { border-bottom: 0; padding-bottom: 0; }
.combo .n { font-family: var(--font-mono); color: #666; font-size: 12px; padding-top: 2px; }
.prioridade { font-size: 20px; font-weight: 600; color: var(--verde); line-height: 1.4; }
.exec-card p.exp { color: #999; font-size: 14px; margin-top: 12px; }

/* Progress */
.progress-line { display: flex; align-items: center; gap: 16px; margin-top: 12px; font-size: 14px; }
.progress-line .plabel { width: 140px; color: #AAA; }
.pbar { flex: 1; height: 8px; background: var(--surface-3); border-radius: 999px; overflow: hidden; }
.pfill { height: 100%; background: linear-gradient(90deg, var(--azul), var(--verde)); border-radius: 999px; }
.pval { font-family: var(--font-mono); width: 48px; text-align: right; color: #FFF; }

/* Roadmap */
.faixa { margin-bottom: 24px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface-1); }
.faixa-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: rgba(255,255,255,0.03); font-weight: 600; color: #FFF; font-size: 15px; border-bottom: 1px solid var(--border); }
.faixa-head small { margin-left: auto; font-family: var(--font-mono); font-size: 11px; color: #888; font-weight: 400; letter-spacing: 0.5px; }
.rmap-item { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-top: 1px solid var(--border); font-size: 14px; }
.rmap-item:first-of-type { border-top: none; }
.rmap-item .titulo { flex: 1; font-weight: 500; color: #EEE; }
.origem { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #999; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; white-space: nowrap; }

/* Ações e Cards */
.acao { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
.acao h4 { font-size: 17px; margin-bottom: 8px; color: #FFF; }
.acao .desc { color: #AAA; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
.acao-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 14px; }
.acao-meta > div { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; }
.acao-meta label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #888; display: block; margin-bottom: 6px; }
.acao-meta .resultado { grid-column: 1 / -1; }

.interp { border-left: 3px solid var(--azul); background: var(--surface-2); border-radius: 0 12px 12px 0; padding: 16px 20px; font-size: 14px; color: #BBB; margin: 24px 0; line-height: 1.6; }
.ind-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
.ind-item { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.ind-item label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888; display: block; margin-bottom: 8px; }
.ind-item .valor { font-size: 24px; font-weight: 700; font-family: var(--font-display); }
.ind-positive { color: var(--verde); }
.ind-negative { color: #EF4444; }
.ind-neutral { color: #EAB308; }

.fim { border-top: 1px solid var(--border); margin-top: 60px; padding: 60px 0 80px; text-align: center; }
.fim p { max-width: 600px; margin: 0 auto 16px; color: #999; font-size: 15px; }
footer { padding: 40px 0; text-align: center; color: #666; font-size: 12px; font-family: var(--font-mono); border-top: 1px solid var(--border); }

/* Floating Action Bar */
.fab-container { position: fixed; top: 24px; right: 24px; display: flex; gap: 12px; z-index: 100; }
.fab-btn { padding: 10px 18px; background: #FFF; color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: var(--font-body); font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: 0.2s; }
.fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

@media (max-width: 640px) {
  .exec-grid, .acao-meta, .ind-grid, .cover-meta { grid-template-columns: 1fr; }
  .fab-container { top: auto; bottom: 24px; right: 24px; flex-direction: column; }
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
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      Salvar PDF
    </button>
  </div>`;
}

function renderCover(data: ConsultingData, project: Project): string {
  const nome = project.nomeEmpresa || data.clienteNome || "Empresa";
  const fat = data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal || 0;
  return `
  <div class="cover">
    <div class="cover-badge">Documento Estratégico Confidencial</div>
    <h1>Plano de Estruturação<br>em Gestão</h1>
    <p class="sub">Guia estratégico e roadmap executivo para os próximos 12 meses</p>
    <div class="empresa">${esc(nome)}</div>
    <div class="cover-meta">
      <div><label>Responsável</label><span style="color:#FFF;font-weight:500">${esc(project.responsavel || data.consultorNome || "-")}</span></div>
      <div><label>Emissão</label><span style="color:#FFF;font-weight:500">${fmtDate()}</span></div>
      ${fat > 0 ? `<div><label>Faturamento</label><span style="color:#FFF;font-weight:500">${fmtCurrency(fat)}/mês</span></div>` : ""}
      ${project.quantidadeColaboradores > 0 ? `<div><label>Colaboradores</label><span style="color:#FFF;font-weight:500">${project.quantidadeColaboradores} pessoas</span></div>` : ""}
    </div>
  </div>`;
}

function renderResumo(m: any, blocks: BlockStatus[]): string {
  const pct = blocks.length > 0 ? Math.round(blocks.reduce((s, b) => s + b.progress, 0) / blocks.length) : 0;
  const riscos = m.risksDetailed && m.risksDetailed.length > 0
    ? m.risksDetailed.slice(0, 3).map((r: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(r.split('×')[0] || r)}</b> ${r.includes('×') ? '×' + esc(r.split('×')[1] || '') : ''}</span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhum risco crítico identificado.</span></div>`;
  const oport = m.opportunitiesDetailed && m.opportunitiesDetailed.length > 0
    ? m.opportunitiesDetailed.slice(0, 3).map((o: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(o.split('×')[0] || o)}</b> ${o.includes('×') ? '×' + esc(o.split('×')[1] || '') : ''}</span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhuma oportunidade mapeada.</span></div>`;
    
  return `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Resumo Executivo</div>
      <h2>O cenário atual em 2 minutos</h2>
      <p class="lead">Síntese do diagnóstico para a tomada de decisão rápida.</p>
      <div class="exec-grid">
        <div class="exec-card">
          <h3>Nota Geral · Berry Score</h3>
          <div class="score-big">${m.berryScore}</div>
          <div class="score-bar"><div class="score-fill" style="width:${m.berryScore}%"></div></div>
          <p class="exp">${esc(m.berryScoreInterpretation)}</p>
        </div>
        <div class="exec-card">
          <h3>Maturidade Média</h3>
          <div class="score-big">${Math.round(m.avgMaturity*10)/10}</div>
          <p class="exp" style="color:#FFF;font-weight:500;margin-bottom:4px;">${esc(m.maturityLabel)}</p>
          <p class="exp" style="margin-top:0">${esc(m.maturityBreakdown)}</p>
        </div>
        <div class="exec-card">
          <h3>3 Maiores Riscos <span style="text-transform:none;opacity:0.6">(Fraqueza × Ameaça)</span></h3>
          ${riscos}
        </div>
        <div class="exec-card">
          <h3>3 Maiores Oportunidades <span style="text-transform:none;opacity:0.6">(Força × Oportunidade)</span></h3>
          ${oport}
        </div>
        <div class="exec-card">
          <h3>Prioridade Estratégica</h3>
          <div class="prioridade">${esc(m.strategicPriority)}</div>
          <p class="exp">Derivada da dimensão de menor maturidade operacional.</p>
        </div>
        <div class="exec-card">
          <h3>Objetivo · Próximos 12 meses</h3>
          <p style="font-weight:500;font-size:16px;color:#FFF;line-height:1.5">${esc(m.objective12Months) || "Estruturar as bases da gestão para permitir crescimento sustentável."}</p>
        </div>
        <div class="exec-card full">
          <h3>Avanço do Projeto</h3>
          <div class="progress-line"><span class="plabel">Diagnóstico</span><div class="pbar"><div class="pfill" style="width:${pct}%"></div></div><span class="pval">${pct}%</span></div>
          <div class="progress-line"><span class="plabel">Implementação</span><div class="pbar"><div class="pfill" style="width:0%"></div></div><span class="pval">0%</span></div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderRoadmap(data: ConsultingData): string {
  const d = data.diagnostico; const swot = data.swot;
  let h = `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Plano de Voo</div>
      <h2>Roadmap de Execução</h2>
      <p class="lead">Iniciativas estratégicas priorizadas por urgência. O foco dos próximos 30 dias é estancar sangramentos e garantir previsibilidade.</p>`;
      
  if ((d.financas.level||0) <= 3) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #EF4444">CRÍTICA — até 30 dias<small>visibilidade financeira e caixa</small></div>
        <div class="rmap-item"><span class="titulo">Implantar DRE gerencial mensal para apuração real de lucro</span><span class="origem">FINANÇAS</span></div>
        <div class="rmap-item"><span class="titulo">Estruturar fluxo de caixa semanal de 8 semanas</span><span class="origem">FINANÇAS</span></div>
      </div>`;
  }
  if ((d.mercado.level||0) <= 3 || (d.processos.level||0) <= 2) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #F97316">ALTA — até 3 meses<small>vendas e operações</small></div>
        <div class="rmap-item"><span class="titulo">Mapear e documentar os 3 processos mais críticos</span><span class="origem">PROCESSOS</span></div>
        <div class="rmap-item"><span class="titulo">Revisar precificação com base em valor percebido</span><span class="origem">MERCADO</span></div>
      </div>`;
  }
  h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #EAB308">MÉDIA — até 6 meses<small>gestão e pessoas</small></div>
        <div class="rmap-item"><span class="titulo">Implementar rotina semanal de acompanhamento de KPIs</span><span class="origem">GESTÃO</span></div>
        <div class="rmap-item"><span class="titulo">Definição formal de organograma e metas por cargo</span><span class="origem">PESSOAS</span></div>
      </div>`;
      
  if (swot?.horizontes?.medio || swot?.horizontes?.longo) {
    h += `
      <div class="faixa">
        <div class="faixa-head" style="border-left:4px solid #3B82F6">ESTRATÉGICA — até 12 meses<small>expansão estruturada</small></div>
        <div class="rmap-item"><span class="titulo">${esc(swot.horizontes.medio || swot.horizontes.longo)}</span><span class="origem">ESTRATÉGIA</span></div>
      </div>`;
  }
  h += `</div></section>`; return h;
}

function renderCapitulos(data: ConsultingData): string {
  // Finanças
  const f = data.financeiro; 
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const desp = (f.despesasFixas||0)+(f.despesasVariaveis||0); const lucro=fat-desp;
  
  // Mercado
  const motores = data.motoresCrescimento.motoresPrincipais.slice(0,2).join(" e ") || "canais orgânicos";
  const publico = data.icp.descricao || "não definido claramente";

  let h = "";
  
  // CAPÍTULO 1: FINANÇAS
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Capítulo 1</div>
      <h2>Finanças & Rentabilidade</h2>
      <p class="lead">Análise da saúde financeira e da capacidade de geração de caixa operacional.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> A maturidade financeira de nível ${data.diagnostico.financas.level}/5 indica que ${data.diagnostico.financas.level <= 2 ? "o negócio opera sem visibilidade exata do lucro líquido, tomando decisões de caixa baseadas no saldo bancário." : "a gestão já possui indicadores estruturados, mas precisa otimizar margens."}
      </div>
      
      ${fat > 0 ? `
      <div class="ind-grid">
        <div class="ind-item"><label>Receita Mensal</label><div class="valor">${fmtCurrency(fat)}</div></div>
        <div class="ind-item"><label>Custo Operacional Estimado</label><div class="valor ${desp > fat ? 'ind-negative' : ''}">${fmtCurrency(desp)}</div></div>
        <div class="ind-item"><label>Margem Líquida</label><div class="valor ${lucro > 0 ? 'ind-positive' : 'ind-negative'}">${fat > 0 ? Math.round((lucro/fat)*100) : 0}%</div></div>
        ${f.metaFaturamento > 0 ? `<div class="ind-item"><label>Meta de Receita</label><div class="valor ind-neutral">${fmtCurrency(f.metaFaturamento)}</div></div>` : ""}
      </div>` : ""}
      
      <div class="acao">
        <h4>Implantar DRE Gerencial</h4>
        <p class="desc">Adoção imediata de um Demonstrativo de Resultados do Exercício para separar custos fixos, variáveis e apurar a margem de contribuição real de cada venda.</p>
        <div class="acao-meta">
          <div><label>Urgência</label><span style="color:var(--u-critica);font-weight:600">Crítica</span></div>
          <div><label>Prazo</label>30 dias</div>
          <div class="resultado"><label>Resultado esperado</label>Fim das decisões financeiras "no escuro" e previsibilidade para investimentos.</div>
        </div>
      </div>
    </div>
  </section>`;

  // CAPÍTULO 2: MERCADO E COMERCIAL
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Capítulo 2</div>
      <h2>Mercado & Crescimento</h2>
      <p class="lead">Estratégia de aquisição de clientes, precificação e posicionamento competitivo.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> A empresa foca atualmente em ${esc(motores)}, atingindo um público que é ${esc(publico)}. O foco tático deve ser no aumento de LTV (Life Time Value) e ticket médio na base atual.
      </div>
      
      <div class="acao">
        <h4>Revisão Estratégica de Precificação</h4>
        <p class="desc">Auditar a margem de todos os produtos/serviços ativos e ancorar preços no "Valor Percebido" em vez de apenas "Custo + Markup".</p>
        <div class="acao-meta">
          <div><label>Urgência</label><span style="color:var(--u-alta);font-weight:600">Alta</span></div>
          <div><label>Prazo</label>60 dias</div>
          <div class="resultado"><label>Resultado esperado</label>Aumento imediato de margem líquida sem necessidade de aumentar volume de vendas.</div>
        </div>
      </div>
    </div>
  </section>`;
  
  // CAPÍTULO 3: OPERAÇÕES E PESSOAS
  h += `
  <section class="section">
    <div class="wrap">
      <div class="kicker">Capítulo 3</div>
      <h2>Operações & Equipe</h2>
      <p class="lead">Eficiência dos processos internos, estrutura de pessoal e produtividade.</p>
      
      <div class="interp">
        <b>Leitura Executiva:</b> Com ${data.diagnostico.processos.level}/5 em processos e ${data.diagnostico.pessoas.level}/5 em pessoas, o negócio depende excessivamente do envolvimento diário do fundador (Gargalo de Liderança).
      </div>
      
      <div class="acao">
        <h4>Mapeamento de Processos Core</h4>
        <p class="desc">Documentar o passo a passo das 3 atividades que mais consomem tempo ou geram retrabalho na operação diária.</p>
        <div class="acao-meta">
          <div><label>Urgência</label><span style="color:var(--u-alta);font-weight:600">Alta</span></div>
          <div><label>Prazo</label>90 dias</div>
          <div class="resultado"><label>Resultado esperado</label>Descentralização da operação, redução de falhas e liberação de tempo do proprietário para estratégia.</div>
        </div>
      </div>
    </div>
  </section>`;

  return h;
}

function renderFinal(): string {
  return `
  <section class="fim no-print" id="proximos-passos">
    <div class="wrap">
      <div class="kicker">Próximos Passos</div>
      <h2>Execução Estratégica</h2>
      <p>O diagnóstico revela oportunidades profundas, mas apenas a implementação disciplinada transformará estes insights em resultados financeiros reais na sua conta.</p>
      <p>Utilize o Roadmap da página 2 como seu guia principal para os próximos meses.</p>
    </div>
  </section>
  <footer>Documento Confidencial · Berry Gestão Estratégica · ${fmtDate()}</footer>`;
}

export function render(html: string): string {
  return html;
}

export function generateReportV2(data: ConsultingData, project: Project, blocks: BlockStatus[]): string {
  const m = getExecutiveMetrics(data);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano Executivo · ${esc(project.nomeEmpresa||data.clienteNome)}</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS_V2}</style></head><body>${renderToolbar()}<div class="wrap">${renderCover(data,project)}${renderResumo(m,blocks)}${renderRoadmap(data)}${renderCapitulos(data)}${renderFinal()}</div><script>document.title = "Plano Executivo - ${esc(project.nomeEmpresa||data.clienteNome)}";</script></body></html>`;
}
