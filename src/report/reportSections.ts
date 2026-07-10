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

/* Cabecalho Berry */
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

/* Progress */
.progress-line { display: flex; align-items: center; gap: 16px; margin-top: 12px; font-size: 14px; }
.progress-line .plabel { width: 140px; color: #AAA; }
.pbar { flex: 1; height: 8px; background: var(--surface-3); border-radius: 999px; overflow: hidden; }
.pfill { height: 100%; background: linear-gradient(90deg, #0D30A4, var(--verde)); border-radius: 999px; }
.pval { font-family: var(--font-mono); width: 48px; text-align: right; color: var(--txt-claro); }

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

/* Rodapé */
.fim { border-top: 1px solid var(--border); margin-top: 60px; padding: 60px 0 80px; text-align: center; }
.fim p { max-width: 600px; margin: 0 auto 16px; color: #999; font-size: 15px; }
footer { padding: 40px 0; text-align: center; color: #666; font-size: 12px; font-family: var(--font-mono); border-top: 1px solid var(--border); display: flex; justify-content: center; align-items: center; gap: 8px; }

/* Barra de Ferramentas */
.fab-container { position: fixed; top: 24px; right: 24px; display: flex; gap: 12px; z-index: 100; }
.fab-btn { padding: 10px 18px; background: #FFF; color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: var(--font-body); font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: 0.2s; }
.fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

@media (max-width: 640px) {
  .exec-grid, .playbook-grid { grid-template-columns: 1fr; }
  .playbook-col { border-right: none; border-bottom: 1px solid var(--border); }
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
    <h1>Plano de Transformação<br>e Roadmap Executivo</h1>
    <p class="sub">Direcionamento tático-estratégico baseado na Agenda do CEO para os próximos 12 Meses</p>
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
        <h4>Veredito</h4>
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
          <p class="exp" style="color:#FFF;font-weight:500;margin-bottom:4px;">Estágio: ${esc(m.maturityLabel)}</p>
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

  // Se critica ficar vazio mas tiver 'alta', redistribui
  if (critica.length === 0 && alta.length > 0) {
    critica.push(alta.shift());
  }

  // Garantir a visão de 12 meses do SWOT na estratégica
  if (swot?.horizontes?.longo) {
    estrategica.push({ descricao: swot.horizontes.longo, importancia: 'baixa' });
  }

  return { critica, alta, media, estrategica };
}

function generateDynamicModule(title: string, color: string, bgHead: string, horizonte: string, prazo: string, prioridades: any[], idx: number) {
  if (!prioridades || prioridades.length === 0) return "";
  
  let h = `
  <div class="playbook-module">
    <div class="playbook-header" style="background: ${bgHead}">
      <div class="playbook-header-top">
        <span class="playbook-horizonte" style="background: ${color}; color: #FFF;">${horizonte}</span>
        <span class="playbook-urgencia" style="color: ${color}">Prazo: ${prazo}</span>
      </div>
      <h3 class="playbook-title">${esc(title)}</h3>
    </div>`;

  prioridades.forEach((p) => {
    // Gerar valores e resultados sintéticos baseados no contexto do prompt "Valor Gerado" e "Resultado Esperado"
    const valorGerado = p.descricao.toLowerCase().includes("finan") || p.descricao.toLowerCase().includes("caixa") || p.descricao.toLowerCase().includes("fatura") 
      ? "Aumento imediato de previsibilidade de caixa, proteção de margem líquida e redução de sangria financeira."
      : p.descricao.toLowerCase().includes("vendas") || p.descricao.toLowerCase().includes("cliente") || p.descricao.toLowerCase().includes("market")
      ? "Alavancagem de receita previsível, aumento de LTV (Life Time Value) e blindagem contra flutuações de mercado."
      : "Descentralização operacional, ganho de autonomia da equipe e escalabilidade orgânica sem dependência do sócio.";

    const resultadoEsperado = p.descricao.toLowerCase().includes("finan") || p.descricao.toLowerCase().includes("caixa")
      ? "Demonstrativos consolidados em tempo real permitindo decisões estratégicas em vez de decisões reativas de saldo bancário."
      : p.descricao.toLowerCase().includes("vendas") || p.descricao.toLowerCase().includes("cliente") || p.descricao.toLowerCase().includes("market")
      ? "Funil de aquisição ou retenção operando com métricas claras de conversão (CAC e ROI estabelecidos)."
      : "Processos documentados e equipe executando a operação primária com taxa de falha inferior a 5%.";

    h += `
    <div style="border-top: 4px solid #111">
      <div class="playbook-grid">
        <div class="playbook-col">
          <h5>1. Objetivo Estratégico</h5>
          <p style="font-size: 16px; color: #FFF; font-weight: 500">${esc(p.descricao)}</p>
        </div>
        <div class="playbook-col">
          <h5>2. Valor Gerado ao Negócio</h5>
          <p>${valorGerado}</p>
        </div>
      </div>
      <div class="playbook-grid">
        <div class="playbook-col" style="background: var(--surface-2)">
          <h5>3. Iniciativas Recomendadas</h5>
          <div class="playbook-iniciativa-item">
            <div class="checkbox-v2" style="border-color: ${color}"></div>
            <div class="playbook-iniciativa-text">Estruturar e homologar os frameworks necessários para atender o objetivo.</div>
          </div>
          <div class="playbook-iniciativa-item">
            <div class="checkbox-v2" style="border-color: ${color}"></div>
            <div class="playbook-iniciativa-text">Treinar a equipe diretamente envolvida e designar um dono (owner) para a meta.</div>
          </div>
        </div>
        <div class="playbook-col" style="background: var(--surface-2)">
          <h5>4. Resultado Esperado & Indicador</h5>
          <p style="color: ${color}; font-weight: 500">${resultadoEsperado}</p>
        </div>
      </div>
    </div>`;
  });

  h += `</div>`;
  return h;
}

function renderPlaybook(data: ConsultingData): string {
  const p = classifyPriorities(data.agendaCEO?.prioridades || [], data.diagnostico, data.swot);
  
  let h = `
  <section class="section" id="roadmap">
    <div class="wrap">
      <div class="kicker">Plano de Transformação</div>
      <h2>Roadmap Estratégico de 12 Meses</h2>
      <p class="lead">Plano de execução originado diretamente da Agenda Estratégica do CEO e das análises transversais de diagnóstico. Cada horizonte não é uma lista de tarefas, mas um salto de capacidade organizacional estruturado em 4 etapas (Objetivo, Valor, Iniciativa, Resultado).</p>
      `;

  h += generateDynamicModule("Sobrevivência e Visibilidade de Gargalos", "#EF4444", "rgba(239, 68, 68, 0.1)", "Prioridade Crítica", "Até 30 dias", p.critica, 1);
  h += generateDynamicModule("Estruturação de Processos e Estabilidade", "#F97316", "rgba(249, 115, 22, 0.1)", "Prioridade Alta", "Até 3 meses", p.alta, 2);
  h += generateDynamicModule("Otimização e Aceleração de Crescimento", "#EAB308", "rgba(234, 179, 8, 0.1)", "Prioridade Média", "Até 6 meses", p.media, 3);
  h += generateDynamicModule("Consolidação, Expansão e Perpetuidade", "#3B82F6", "rgba(59, 130, 246, 0.1)", "Visão Estratégica", "Até 12 meses", p.estrategica, 4);

  h += `</div></section>`;
  return h;
}

function renderFinal(): string {
  return `
  <section class="fim no-print" id="proximos-passos">
    <div class="wrap">
      <div class="kicker">Próximos Passos</div>
      <h2>A Execução Faz o Estrategista</h2>
      <p>Este diagnóstico agrupou inteligentemente 14 áreas da sua empresa com base na sua Agenda Estratégica. Os dados revelam as oportunidades, mas apenas a implementação implacável transformará estes insights em caixa na conta e eficiência no piso de fábrica.</p>
      <p>Utilize os checkboxes físicos das iniciativas para cobrar avanço real nas próximas reuniões de diretoria.</p>
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
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano Executivo · ${esc(project.nomeEmpresa||data.clienteNome)}</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS_V2}</style></head><body>${renderToolbar()}<div class="wrap">${renderCover(data,project)}${renderResumo(m,data,blocks)}${renderPlaybook(data)}${renderFinal()}</div><script>document.title = "Plano Executivo - ${esc(project.nomeEmpresa||data.clienteNome)}";</script></body></html>`;
}
