import { ConsultingData, Project, BlockStatus } from "@/types/consulting";
import { getExecutiveMetrics } from "./executiveMetrics";

const CSS_V2 = `:root{--cinza:#7A7A7A;--cinza-claro:#F0F0F0;--azul:#0D30A4;--verde:#47C97E;--surface-1:rgba(122,122,122,.045);--surface-2:rgba(122,122,122,.08);--surface-3:rgba(122,122,122,.13);--border:rgba(122,122,122,.26);--bg:#000;--font-display:"IBM Plex Sans",-apple-system,sans-serif;--font-body:"Inter",-apple-system,sans-serif;--font-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media print{:root{--txt:#111;--txt-2:#555;--bg:#FFF;--surface-1:rgba(0,0,0,.03)}body{background:#fff}.cover{page-break-after:always}}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font-body);background:var(--bg);color:var(--txt);line-height:1.65}.wrap{max-width:880px;margin:0 auto;padding:0 28px}
.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px 24px;background:radial-gradient(120% 90% at 50% 130%,rgba(13,48,164,.16),transparent 70%)}
.cover h1{font-size:clamp(26px,3.5vw,36px);margin-bottom:12px;color:#F0F0F0}
.cover .sub{color:#7A7A7A;margin-bottom:56px}
.cover .empresa{font-size:26px;font-weight:600;color:#F0F0F0}
.cover-meta{display:grid;grid-template-columns:repeat(2,minmax(180px,220px));gap:12px}
.cover-meta div{background:var(--surface-1);border:1px solid var(--border);border-radius:12px;padding:14px 18px;text-align:left;color:#F0F0F0}
.cover-meta label{font-family:var(--font-mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7A7A7A;display:block;margin-bottom:4px}
.cover-badge{font-family:var(--font-mono);font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7A7A7A;border:1px solid rgba(122,122,122,.26);border-radius:999px;padding:10px 24px;margin-bottom:44px}
.section{padding:72px 0 40px}.kicker{font-family:var(--font-mono);font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#47C97E;margin-bottom:10px}
.section h2{font-size:22px;color:#F0F0F0;margin-bottom:8px}.section>.wrap>p.lead{color:#7A7A7A;font-size:13px;max-width:560px;margin-bottom:32px}
.exec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:14px}
.exec-card{background:var(--surface-1);border:1px solid var(--border);border-radius:16px;padding:22px;color:#F0F0F0}
.exec-card.full{grid-column:1/-1}.exec-card h3{font-size:13px;font-family:var(--font-mono);letter-spacing:1.5px;text-transform:uppercase;color:#7A7A7A;margin-bottom:14px;font-weight:500}
.score-big{font-size:46px;font-weight:700;color:#47C97E}.score-bar{height:8px;background:var(--surface-3);border-radius:999px;margin-top:14px;overflow:hidden}
.score-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#0D30A4,#47C97E)}
.combo{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:#F0F0F0}.combo:last-child{border-bottom:0}.combo .n{font-family:var(--font-mono);color:#7A7A7A}
.prioridade{font-size:18px;font-weight:600;color:#47C97E}.exec-card p.exp{color:#7A7A7A;font-size:13px;margin-top:8px}
.progress-line{display:flex;align-items:center;gap:14px;margin-top:8px;font-size:13px}.progress-line .plabel{width:130px;color:#7A7A7A}
.pbar{flex:1;height:10px;background:var(--surface-3);border-radius:999px;overflow:hidden}.pfill{height:100%;background:linear-gradient(90deg,#0D30A4,#47C97E)}
.faixa{margin-bottom:26px;border:1px solid var(--border);border-radius:16px;overflow:hidden}
.faixa-head{display:flex;align-items:center;gap:10px;padding:14px 20px;background:var(--surface-2);font-weight:600;color:#F0F0F0}
.faixa-head small{margin-left:auto;font-family:var(--font-mono);font-size:11px;color:#7A7A7A;font-weight:400}
.rmap-item{display:flex;align-items:center;gap:12px;padding:12px 20px;border-top:1px solid var(--border);font-size:13px;color:#F0F0F0}
.rmap-item .titulo{flex:1;font-weight:500}
.origem{font-family:var(--font-mono);font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#7A7A7A;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:3px 10px;white-space:nowrap}
.acao{background:var(--surface-1);border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:14px;color:#F0F0F0}
.acao h4{font-size:16px;margin-bottom:6px}.acao .desc{color:#7A7A7A;font-size:13px;margin-bottom:14px}
.acao-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:13px}
.acao-meta>div{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px}
.acao-meta label{font-family:var(--font-mono);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#7A7A7A;display:block;margin-bottom:3px}
.acao-meta .resultado{grid-column:1/-1}
.interp{border-left:3px solid #0D30A4;background:var(--surface-1);border-radius:0 12px 12px 0;padding:14px 18px;font-size:13px;color:#7A7A7A;margin:18px 0}
.ind-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:18px 0}
.ind-item{background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;color:#F0F0F0}
.ind-item label{font-family:var(--font-mono);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#7A7A7A;display:block;margin-bottom:4px}
.ind-item .valor{font-size:20px;font-weight:700}.ind-positive{color:#47C97E}.ind-negative{color:#EF4444}.ind-neutral{color:#EAB308}
.fim{border-top:1px solid var(--border);margin-top:40px;padding:56px 0 80px;text-align:center;color:#F0F0F0}.fim p{max-width:600px;margin:0 auto 14px;color:#7A7A7A}
footer{padding:34px 0;text-align:center;color:#7A7A7A;font-size:11px;font-family:var(--font-mono);border-top:1px solid var(--border)}
@media(max-width:640px){.exec-grid,.acao-meta,.ind-grid{grid-template-columns:1fr}.cover-meta{grid-template-columns:1fr}}`;

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
  return `<div class="cover"><div class="cover-badge">Documento Estratégico Confidencial</div><h1>Plano de Estruturação<br>em Gestão</h1><p class="sub">Diagnóstico completo e direção estratégica para os próximos 12 meses</p><div class="empresa">${esc(nome)}</div><div class="cover-meta"><div><label>Responsável</label>${esc(project.responsavel || data.consultorNome || "-")}</div><div><label>Emissão</label>${fmtDate()}</div>${fat > 0 ? `<div><label>Faturamento</label>${fmtCurrency(fat)}/mês</div>` : ""}${project.quantidadeColaboradores > 0 ? `<div><label>Colaboradores</label>${project.quantidadeColaboradores} pessoas</div>` : ""}</div></div>`;
}

function renderResumo(m: any, blocks: BlockStatus[]): string {
  const pct = blocks.length > 0 ? Math.round(blocks.reduce((s, b) => s + b.progress, 0) / blocks.length) : 0;
  const riscos = m.risksDetailed && m.risksDetailed.length > 0
    ? m.risksDetailed.slice(0, 3).map((r: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(r)}</b></span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhum risco identificado.</span></div>`;
  const oport = m.opportunitiesDetailed && m.opportunitiesDetailed.length > 0
    ? m.opportunitiesDetailed.slice(0, 3).map((o: string, i: number) => `<div class="combo"><span class="n">${String(i+1).padStart(2,"0")}</span><span><b>${esc(o)}</b></span></div>`).join("")
    : `<div class="combo"><span class="n">-</span><span>Nenhuma oportunidade identificada.</span></div>`;
  return `<section class="section"><div class="wrap"><div class="kicker">Resumo Executivo</div><h2>A situação da empresa em 2 minutos</h2><p class="lead">Síntese do diagnóstico completo. Cada ponto é detalhado nos capítulos seguintes.</p><div class="exec-grid"><div class="exec-card"><h3>Nota Geral · Berry Score</h3><div class="score-big">${m.berryScore}</div><div class="score-bar"><div class="score-fill" style="width:${m.berryScore}%"></div></div><p class="exp">${esc(m.berryScoreInterpretation)}</p></div><div class="exec-card"><h3>Maturidade Média</h3><div class="score-big">${Math.round(m.avgMaturity*10)/10}</div><p class="exp">${esc(m.maturityLabel)} — ${esc(m.maturityBreakdown)}</p><div class="score-bar"><div class="score-fill" style="width:${(m.avgMaturity/5)*100}%"></div></div></div><div class="exec-card"><h3>3 Maiores Riscos</h3>${riscos}</div><div class="exec-card"><h3>3 Maiores Oportunidades</h3>${oport}</div><div class="exec-card"><h3>Prioridade Estratégica</h3><div class="prioridade">${esc(m.strategicPriority)}</div><p class="exp">Derivada do diagnóstico: a dimensão de menor maturidade.</p></div><div class="exec-card"><h3>Objetivo · 12 meses</h3><p style="font-weight:600">${esc(m.objective12Months) || "Definir direção estratégica."}</p></div><div class="exec-card full"><h3>Progresso do Projeto</h3><div class="progress-line"><span class="plabel">Diagnóstico</span><div class="pbar"><div class="pfill" style="width:${pct}%"></div></div><span class="pval">${pct}%</span></div><div class="progress-line"><span class="plabel">Implementação</span><div class="pbar"><div class="pfill" style="width:0%"></div></div><span class="pval">0%</span></div></div></div></div></section>`;
}

function renderRoadmap(data: ConsultingData): string {
  const d = data.diagnostico; const swot = data.swot;
  let h = `<section class="section"><div class="wrap"><div class="kicker">Roadmap de Implementação</div><h2>12 meses em 5 horizontes</h2><p class="lead">Ações consolidadas do diagnóstico, ordenadas por urgência e esforço.</p>`;
  if ((d.financas.level||0) <= 2) {
    h += `<div class="faixa"><div class="faixa-head" style="border-left:4px solid #EF4444">CRÍTICA — até 30 dias<small>visibilidade financeira</small></div><div class="rmap-item"><span class="titulo">Implantar DRE gerencial mensal</span><span class="origem">Financeiro</span></div><div class="rmap-item"><span class="titulo">Estruturar fluxo de caixa semanal</span><span class="origem">Financeiro</span></div></div>`;
  }
  if ((d.processos.level||0) <= 2) {
    h += `<div class="faixa"><div class="faixa-head" style="border-left:4px solid #F97316">ALTA — até 3 meses<small>estrutura operacional</small></div><div class="rmap-item"><span class="titulo">Documentar processos críticos</span><span class="origem">Processos</span></div></div>`;
  }
  if ((d.mercado.level||0) <= 2) {
    h += `<div class="faixa"><div class="faixa-head" style="border-left:4px solid #EAB308">MÉDIA — até 6 meses<small>gestão</small></div><div class="rmap-item"><span class="titulo">Marketing orgânico com mensuração</span><span class="origem">Marketing</span></div></div>`;
  }
  if ((d.pessoas.level||0) <= 2) {
    h += `<div class="faixa"><div class="faixa-head" style="border-left:4px solid #47C97E">EVOLUÇÃO — até 9 meses<small>pessoas</small></div><div class="rmap-item"><span class="titulo">Treinar equipe em vendas consultivas</span><span class="origem">Pessoas</span></div></div>`;
  }
  if (swot?.horizontes?.longo || swot?.horizontes?.medio) {
    h += `<div class="faixa"><div class="faixa-head" style="border-left:4px solid #3B82F6">ESTRATÉGICA — até 12 meses<small>expansão</small></div><div class="rmap-item"><span class="titulo">${esc(swot.horizontes.longo || swot.horizontes.medio)}</span><span class="origem">Estratégico</span></div></div>`;
  }
  h += `</div></section>`; return h;
}

function renderCapituloFinanceiro(data: ConsultingData): string {
  const f = data.financeiro; if (!f.faturamentoAtual && !f.faturamentoMensal) return "";
  const fat = f.faturamentoAtual || f.faturamentoMensal || 0;
  const desp = (f.despesasFixas||0)+(f.despesasVariaveis||0); const lucro=fat-desp;
  const nivel=data.diagnostico.financas.level||0;
  return `<section class="section"><div class="wrap"><div class="kicker">Capítulo · Finanças</div><h2>Análise Financeira</h2><p class="lead">Faturamento de ${fmtCurrency(fat)}/mês${f.metaFaturamento>0?` com meta de ${fmtCurrency(f.metaFaturamento)}`:""}.</p><div class="interp"><b>Como interpretar:</b> maturidade Finanças nível ${nivel}/5 significa que${nivel<=2?" existem controles básicos, mas nenhuma análise estratégica — o negócio opera sem conhecer o próprio lucro.":" a gestão financeira está em desenvolvimento."}</div>${lucro>0?`<div class="ind-grid"><div class="ind-item"><label>Faturamento Mensal</label><div class="valor ind-positive">${fmtCurrency(fat)}</div></div><div class="ind-item"><label>Despesas Totais</label><div class="valor ind-negative">${fmtCurrency(desp)}</div></div><div class="ind-item"><label>Lucro Líquido</label><div class="valor ind-positive">${fmtCurrency(lucro)}</div></div>${f.metaFaturamento>0?`<div class="ind-item"><label>Meta</label><div class="valor ind-neutral">${fmtCurrency(f.metaFaturamento)}</div></div>`:""}</div>`:""}<div class="acao"><h4>Implantar DRE gerencial</h4><p class="desc">Organizar receitas e despesas em DRE mensal para conhecer a lucratividade real do negócio.</p><div class="acao-meta"><div><label>Urgência</label>Crítica</div><div><label>Prazo</label>30 dias</div><div><label>Esforço</label>Médio</div><div class="resultado"><label>Resultado esperado</label>Conhecer o lucro real e tomar decisões baseadas em dados.</div></div></div><div class="acao"><h4>Estruturar fluxo de caixa semanal</h4><p class="desc">Mapear entradas e saídas com visão de 8 semanas à frente.</p><div class="acao-meta"><div><label>Urgência</label>Crítica</div><div><label>Prazo</label>30 dias</div><div><label>Esforço</label>Médio</div><div class="resultado"><label>Resultado esperado</label>Eliminar surpresas de caixa e ter previsibilidade financeira.</div></div></div></div></section>`;
}

function renderFinal(): string {
  return `<section class="fim" id="proximos-passos"><div class="wrap"><div class="kicker">Encerramento</div><h2>Próximos Passos</h2><p>O diagnóstico identifica oportunidades e define uma direção estratégica para a empresa.</p><p>Os melhores resultados são obtidos quando as ações são implementadas de forma disciplinada e acompanhadas periodicamente.</p><p>Este relatório deve ser usado como referência para orientar as decisões dos próximos 12 meses.</p></div></section><footer>Berry · Plano de Estruturação em Gestão · ${fmtDate()}</footer>`;
}

export function render(html: string): string {
  return html;
}

export function generateReportV2(data: ConsultingData, project: Project, blocks: BlockStatus[]): string {
  const m = getExecutiveMetrics(data);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Plano de Estruturação · ${esc(project.nomeEmpresa||data.clienteNome)} · Berry</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS_V2}</style></head><body><div class="wrap">${renderCover(data,project)}${renderResumo(m,blocks)}${renderRoadmap(data)}${renderCapituloFinanceiro(data)}${renderFinal()}</div></body></html>`;
}
