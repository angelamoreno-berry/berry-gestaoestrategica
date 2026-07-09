import { ConsultingData, Project, BlockStatus } from "@/types/consulting";
import { getExecutiveMetrics } from "./executiveMetrics";

const CSS_V2 = \`:root{--cinza:#7A7A7A;--cinza-claro:#F0F0F0;--azul:#0D30A4;--verde:#47C97E;--surface-1:rgba(122,122,122,.045);--surface-2:rgba(122,122,122,.08);--surface-3:rgba(122,122,122,.13);--border:rgba(122,122,122,.26);--bg:#000;--font-display:"IBM Plex Sans",-apple-system,sans-serif;--font-body:"Inter",-apple-system,sans-serif;--font-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media print{:root{--txt:#111;--txt-2:#555;--bg:#FFF;--surface-1:rgba(0,0,0,.03)}body{background:#fff}.cover{page-break-after:always}}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font-body);background:var(--bg);color:var(--txt);line-height:1.65}.wrap{max-width:880px;margin:0 auto;padding:0 28px}
.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px 24px}
.cover h1{font-size:clamp(26px,3.5vw,36px);margin-bottom:12px}
.cover-meta{display:grid;grid-template-columns:repeat(2,minmax(180px,220px));gap:12px}
.cover-meta div{background:var(--surface-1);border:1px solid var(--border);padding:14px 18px;text-align:left}
.section{padding:72px 0 40px}.kicker{text-transform:uppercase;letter-spacing:3px;font-size:11px;margin-bottom:10px}
.exec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:14px}
.exec-card{background:var(--surface-1);border:1px solid var(--border);padding:22px}.exec-card.full{grid-column:1/-1}
.score-big{font-size:46px;font-weight:700}.score-bar{height:8px;background:#333;margin-top:14px;overflow:hidden}
.score-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#0D30A4,#47C97E)}
.combo{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px}
.faixa{margin-bottom:26px;border:1px solid var(--border);overflow:hidden}
.faixa-head{display:flex;align-items:center;gap:10px;padding:14px 20px;background:var(--surface-1);font-weight:600}
.rmap-item{display:flex;align-items:center;gap:12px;padding:12px 20px;border-top:1px solid var(--border);font-size:13px}
.rmap-item .titulo{flex:1;font-weight:500}
.origem{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#999;padding:3px 10px;border:1px solid #333;border-radius:999px}
.acao{background:var(--surface-1);border:1px solid var(--border);padding:22px;margin-bottom:14px}
.acao-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:13px}
.acao-meta>div{background:var(--surface-1);border:1px solid var(--border);padding:10px 14px}
.acao-meta .resultado{grid-column:1/-1}
.ind-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:18px 0}
.ind-item{background:var(--surface-1);border:1px solid var(--border);padding:14px}
.ind-item label{text-transform:uppercase;font-size:10px;letter-spacing:1.5px;color:#999;display:block;margin-bottom:4px}
.ind-item .valor{font-size:20px;font-weight:700}.ind-positive{color:#47C97E}.ind-negative{color:#EF4444}.ind-neutral{color:#EAB308}
.fim{padding:56px 0 80px;text-align:center}footer{padding:34px 0;text-align:center;font-size:11px;border-top:1px solid var(--border)}
@media(max-width:640px){.exec-grid,.acao-meta,.ind-grid{grid-template-columns:1fr}.cover-meta{grid-template-columns:1fr}}
\`;

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

function renderCover(data: ConsultingData, project: Project): string {
  const nome = project.nomeEmpresa || data.clienteNome || "Empresa";
  const fat = data.financeiro.faturamentoAtual || data.financeiro.faturamentoMensal || 0;
  return \`<div class="cover"><div class="cover-badge">Documento Estratégico Confidencial</div><h1>Plano de Estruturação em Gestão</h1><p class="sub">Direção estratégica para os próximos 12 meses</p><div class="empresa">\${esc(nome)}</div><div class="cover-meta"><div><label>Responsável</label>\${esc(project.responsavel || data.consultorNome || "-")}</div><div><label>Emissão</label>\${fmtDate()}</div>\${fat > 0 ? \`<div><label>Faturamento</label>\${fmtCurrency(fat)}/mês</div>\` : ""}\${project.quantidadeColaboradores > 0 ? \`<div><label>Colaboradores</label>\${project.quantidadeColaboradores} pessoas</div>\` : ""}</div></div>\`;
}

function renderResumo(m: any, blocks: BlockStatus[]): string {
  const pct = blocks.length > 0 ? Math.round(blocks.reduce((s, b) => s + b.progress, 0) / blocks.length) : 0;
  const riscos = m.risksDetailed && m.risksDetailed.length > 0
    ? m.risksDetailed.slice(0, 3).map((r: string, i: number) => \`<div class="combo"><span class="n">\${String(i+1).padStart(2,"0")}</span><span>\${esc(r)}</span></div>\`).join("")
    : \`<div class="combo"><span class="n">-</span><span>Nenhum risco identificado.</span></div>\`;
  const oport = m.opportunitiesDetailed && m.opportunitiesDetailed.length > 0
    ? m.opportunitiesDetailed.slice(0, 3).map((o: string, i: number) => \`<div class="combo"><span class="n">\${String(i+1).padStart(2,"0")}</span><span>\${esc(o)}</span></div>\`).join("")
    : \`<div class="combo"><span class="n">-</span><span>Nenhuma oportunidade identificada.</span></div>\`;
  return \`<section><div class="wrap"><div class="kicker">Resumo Executivo</div><h2>A situação da empresa em 2 minutos</h2><div class="exec-grid"><div class="exec-card"><h3>Berry Score</h3><div class="score-big">\${m.berryScore}</div><div class="score-bar"><div class="score-fill" style="width:\${m.berryScore}%"></div></div><p>\${esc(m.berryScoreInterpretation)}</p></div><div class="exec-card"><h3>Maturidade</h3><div class="score-big">\${Math.round(m.avgMaturity*10)/10}</div><p>\${esc(m.maturityLabel)} - \${esc(m.maturityBreakdown)}</p></div><div class="exec-card"><h3>3 Riscos</h3>\${riscos}</div><div class="exec-card"><h3>3 Oportunidades</h3>\${oport}</div><div class="exec-card"><h3>Prioridade</h3><p style="font-weight:600">\${esc(m.strategicPriority)}</p></div><div class="exec-card"><h3>Objetivo 12 meses</h3><p>\${esc(m.objective12Months) || "Definir direção estratégica."}</p></div><div class="exec-card full"><h3>Progresso</h3><div>Diagnóstico: \${pct}%</div><div>Implementação: 0%</div></div></div></div></section>\`;
}

function renderRoadmap(data: ConsultingData): string {
  const d = data.diagnostico;
  const swot = data.swot;
  let html = \`<section><div class="wrap"><div class="kicker">Roadmap</div><h2>12 meses em 5 horizontes</h2>\`;
  if (d.financas.level <= 2) {
    html += \`<div class="faixa"><div class="faixa-head">CRÍTICA - até 30 dias</div>\`;
    html += \`<div class="rmap-item"><span class="titulo">Implantar DRE gerencial</span><span class="origem">Financeiro</span></div>\`;
    html += \`<div class="rmap-item"><span class="titulo">Fluxo de caixa semanal</span><span class="origem">Financeiro</span></div>\`;
    html += \`</div>\`;
  }
  if (d.processos.level <= 2) {
    html += \`<div class="faixa"><div class="faixa-head">ALTA - até 3 meses</div>\`;
    html += \`<div class="rmap-item"><span class="titulo">Documentar processos críticos</span><span class="origem">Processos</span></div>\`;
    html += \`</div>\`;
  }
  html += \`<div class="faixa"><div class="faixa-head">MÉDIA - até 6 meses</div>\`;
  html += \`<div class="rmap-item"><span class="titulo">Dashboard de indicadores</span><span class="origem">Gestão</span></div>\`;
  html += \`</div>\`;
  if (swot?.horizontes?.longo) {
    html += \`<div class="faixa"><div class="faixa-head">ESTRATÉGICA - até 12 meses</div>\`;
    html += \`<div class="rmap-item"><span class="titulo">\${esc(swot.horizontes.longo)}</span><span class="origem">Estratégico</span></div>\`;
    html += \`</div>\`;
  }
  html += \`</div></section>\`;
  return html;
}

function renderFinanceiro(data: ConsultingData): string {
  const f = data.financeiro;
  if (!f.faturamentoAtual && !f.faturamentoMensal) return "";
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const desp = (f.despesasFixas || 0) + (f.despesasVariaveis || 0);
  const lucro = fat - desp;
  return \`<section><div class="wrap"><div class="kicker">Capítulo - Finanças</div><h2>Análise Financeira</h2><p class="lead">Faturamento de \${fmtCurrency(fat)}/mês</p>\${lucro > 0 ? \`<div class="ind-grid"><div class="ind-item"><label>Faturamento</label><div class="valor ind-positive">\${fmtCurrency(fat)}</div></div><div class="ind-item"><label>Despesas</label><div class="valor ind-negative">\${fmtCurrency(desp)}</div></div><div class="ind-item"><label>Lucro</label><div class="valor ind-positive">\${fmtCurrency(lucro)}</div></div>\${f.metaFaturamento > 0 ? \`<div class="ind-item"><label>Meta</label><div class="valor ind-neutral">\${fmtCurrency(f.metaFaturamento)}</div></div>\` : ""}</div>\` : ""}<div class="acao"><h4>Implantar DRE gerencial</h4><p>Organizar receitas e despesas em DRE mensal.</p><div class="acao-meta"><div><label>Urgência</label>Crítica</div><div><label>Prazo</label>30 dias</div><div class="resultado"><label>Resultado esperado</label>Conhecer o lucro real do negócio.</div></div></div><div class="acao"><h4>Fluxo de caixa semanal</h4><p>Mapear entradas e saídas com 8 semanas de visão.</p><div class="acao-meta"><div><label>Urgência</label>Crítica</div><div><label>Prazo</label>30 dias</div><div class="resultado"><label>Resultado esperado</label>Previsibilidade financeira.</div></div></div></div></section>\`;
}

function renderFinal(): string {
  return \`<section class="fim"><div class="wrap"><h2>Próximos Passos</h2><p>O diagnóstico identifica oportunidades e define a direção estratégica.</p><p>A implementação disciplinada é o que transforma diagnóstico em resultado.</p></div></section><footer>Berry - Plano de Estruturação - \${fmtDate()}</footer>\`;
}

export function render(html: string): string {
  return html;
}

export function generateReportV2(data: ConsultingData, project: Project, blocks: BlockStatus[]): string {
  const m = getExecutiveMetrics(data);
  return \`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano de Estruturação - \${esc(project.nomeEmpresa || data.clienteNome)}</title><style>\${CSS_V2}</style></head><body><div class="wrap">\${renderCover(data, project)}\${renderResumo(m, blocks)}\${renderRoadmap(data)}\${renderFinanceiro(data)}\${renderFinal()}</div></body></html>\`;
}
