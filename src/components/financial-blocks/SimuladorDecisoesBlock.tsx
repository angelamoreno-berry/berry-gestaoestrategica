import { useEffect, useMemo } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, ShieldAlert, DollarSign, Target, Zap, ArrowUpRight } from 'lucide-react';

interface DecisaoCard {
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  tipo: 'oportunidade' | 'risco' | 'melhoria';
  modulo: string;
  detalhe?: string;
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const pct = (v: number) => `${v.toFixed(1)}%`;

export function SimuladorDecisoesBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const notes = financialData?.simuladorDecisoes?.notes || '';

  const decisoes = useMemo<DecisaoCard[]>(() => {
    if (!financialData) return [];
    const cards: DecisaoCard[] = [];

    const af = financialData.analiseFinanceira;
    const fc = financialData.fluxoCaixa;
    const cg = financialData.capitalGiro;
    const mr = financialData.margensRentabilidade;
    const kpi = financialData.indicadoresKPIs;
    const ri = financialData.riscoEndividamento;
    const gov = financialData.governancaFinanceira;
    const mat = financialData.maturidadeProcessos;

    // --- Análise Financeira ---
    if (af) {
      const lucro = af.faturamentoMensal - af.despesasFixas - af.despesasVariaveis;
      const margem = af.faturamentoMensal > 0 ? (lucro / af.faturamentoMensal) * 100 : 0;
      const mcPct = af.faturamentoMensal > 0 ? (af.faturamentoMensal - af.despesasVariaveis) / af.faturamentoMensal : 0;
      const pe = mcPct > 0 ? af.despesasFixas / mcPct : 0;
      const folga = af.faturamentoMensal - pe;

      if (af.faturamentoMensal > 0 && margem < 10) {
        cards.push({
          titulo: 'Margem líquida crítica',
          descricao: `Sua margem está em ${pct(margem)}. Reduza despesas ou aumente preços para ampliar a lucratividade.`,
          impacto: 'alto',
          tipo: 'risco',
          modulo: 'Análise Financeira',
          detalhe: `Lucro atual: ${fmt(lucro)} / Receita: ${fmt(af.faturamentoMensal)}`
        });
      }

      if (af.faturamentoMensal > 0 && folga < 0) {
        cards.push({
          titulo: 'Faturamento abaixo do ponto de equilíbrio',
          descricao: `Você precisa faturar pelo menos ${fmt(pe)} para cobrir seus custos. Atualmente falta ${fmt(Math.abs(folga))}.`,
          impacto: 'alto',
          tipo: 'risco',
          modulo: 'Análise Financeira'
        });
      } else if (af.faturamentoMensal > 0 && pe > 0 && folga < pe * 0.15) {
        cards.push({
          titulo: 'Folga sobre break-even muito baixa',
          descricao: `Sua folga é de apenas ${fmt(folga)} (${pct((folga / pe) * 100)}). Aumente receita ou reduza custos fixos para ganhar segurança.`,
          impacto: 'medio',
          tipo: 'risco',
          modulo: 'Análise Financeira'
        });
      }

      if (af.despesasFixas > 0 && af.faturamentoMensal > 0 && af.despesasFixas / af.faturamentoMensal > 0.5) {
        const redAlvo = af.despesasFixas * 0.1;
        cards.push({
          titulo: 'Despesas fixas comprometendo mais de 50% da receita',
          descricao: `Reduzir 10% das despesas fixas geraria economia de ${fmt(redAlvo)}/mês (${fmt(redAlvo * 12)}/ano).`,
          impacto: 'alto',
          tipo: 'oportunidade',
          modulo: 'Análise Financeira'
        });
      }

      if (af.ticketMedio > 0 && af.quantidadeClientes > 0) {
        const aumento10 = af.ticketMedio * 0.1 * af.quantidadeClientes;
        cards.push({
          titulo: 'Aumentar ticket médio em 10%',
          descricao: `Elevando de ${fmt(af.ticketMedio)} para ${fmt(af.ticketMedio * 1.1)}, geraria ${fmt(aumento10)} a mais por mês.`,
          impacto: aumento10 > af.faturamentoMensal * 0.05 ? 'alto' : 'medio',
          tipo: 'oportunidade',
          modulo: 'Análise Financeira'
        });
      }
    }

    // --- Fluxo de Caixa ---
    if (fc) {
      const saldo30 = fc.saldoAtual + fc.entradasPrevistas30d - fc.saidasPrevistas30d;
      const saldo60 = saldo30 + fc.entradasPrevistas60d - fc.saidasPrevistas60d;
      const saldo90 = saldo60 + fc.entradasPrevistas90d - fc.saidasPrevistas90d;

      if (fc.saldoAtual > 0 && saldo30 < 0) {
        cards.push({
          titulo: 'Fluxo de caixa negativo nos próximos 30 dias',
          descricao: `Saldo projetado: ${fmt(saldo30)}. Antecipe recebíveis ou renegocie pagamentos para evitar descoberto.`,
          impacto: 'alto',
          tipo: 'risco',
          modulo: 'Fluxo de Caixa'
        });
      } else if (saldo60 < 0) {
        cards.push({
          titulo: 'Risco de caixa negativo em 60 dias',
          descricao: `Saldo projetado para 60 dias: ${fmt(saldo60)}. Planeje-se para evitar dificuldades de liquidez.`,
          impacto: 'medio',
          tipo: 'risco',
          modulo: 'Fluxo de Caixa'
        });
      } else if (saldo90 < 0) {
        cards.push({
          titulo: 'Atenção ao caixa em 90 dias',
          descricao: `Projeção de 90 dias indica saldo de ${fmt(saldo90)}. Monitore entradas e saídas cuidadosamente.`,
          impacto: 'baixo',
          tipo: 'risco',
          modulo: 'Fluxo de Caixa'
        });
      }
    }

    // --- Capital de Giro ---
    if (cg) {
      if (cg.cicloFinanceiro > 0 && cg.cicloFinanceiro > 60) {
        cards.push({
          titulo: 'Ciclo financeiro longo demais',
          descricao: `${cg.cicloFinanceiro} dias. Negocie prazos de pagamento mais longos com fornecedores ou reduza prazo de recebimento.`,
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Capital de Giro'
        });
      }

      if (cg.prazoMedioRecebimento > 0 && cg.prazoMedioPagamento > 0 && cg.prazoMedioRecebimento > cg.prazoMedioPagamento * 1.5) {
        cards.push({
          titulo: 'Descasamento de prazos recebimento vs pagamento',
          descricao: `Você recebe em ${cg.prazoMedioRecebimento} dias mas paga em ${cg.prazoMedioPagamento} dias. Reduza o prazo de recebimento para melhorar o fluxo.`,
          impacto: 'alto',
          tipo: 'melhoria',
          modulo: 'Capital de Giro'
        });
      }

      if (cg.necessidadeCapitalGiro > 0 && cg.capitalGiroDisponivel > 0 && cg.capitalGiroDisponivel < cg.necessidadeCapitalGiro) {
        const gap = cg.necessidadeCapitalGiro - cg.capitalGiroDisponivel;
        cards.push({
          titulo: 'Capital de giro insuficiente',
          descricao: `Faltam ${fmt(gap)} para cobrir a necessidade de giro. Considere linhas de crédito ou melhore a gestão de recebíveis.`,
          impacto: 'alto',
          tipo: 'risco',
          modulo: 'Capital de Giro'
        });
      }
    }

    // --- Margens ---
    if (mr) {
      if (mr.margemBruta > 0 && mr.margemLiquida > 0 && (mr.margemBruta - mr.margemLiquida) > 30) {
        cards.push({
          titulo: 'Grande diferença entre margem bruta e líquida',
          descricao: `Bruta: ${pct(mr.margemBruta)} vs Líquida: ${pct(mr.margemLiquida)}. Despesas operacionais estão consumindo ${pct(mr.margemBruta - mr.margemLiquida)} da margem.`,
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Margens & Rentabilidade'
        });
      }

      if (mr.roe > 0 && mr.roe < 10) {
        cards.push({
          titulo: 'Retorno sobre patrimônio abaixo da referência',
          descricao: `ROE de ${pct(mr.roe)} está abaixo dos 10% de referência. Avalie se o capital investido está sendo bem aproveitado.`,
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Margens & Rentabilidade'
        });
      }
    }

    // --- KPIs ---
    if (kpi) {
      if (kpi.ltv > 0 && kpi.cac > 0) {
        const ratio = kpi.ltv / kpi.cac;
        if (ratio < 3) {
          cards.push({
            titulo: 'LTV/CAC abaixo do ideal',
            descricao: `Razão de ${ratio.toFixed(1)}x (ideal: acima de 3x). Reduza o custo de aquisição ou aumente o valor do ciclo de vida do cliente.`,
            impacto: ratio < 1 ? 'alto' : 'medio',
            tipo: ratio < 1 ? 'risco' : 'melhoria',
            modulo: 'KPIs'
          });
        }
      }

      if (kpi.ebitdaMargin > 0 && kpi.ebitdaMargin < 10) {
        cards.push({
          titulo: 'Margem EBITDA baixa',
          descricao: `EBITDA margin de ${pct(kpi.ebitdaMargin)}. Foque em eficiência operacional e redução de despesas não essenciais.`,
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'KPIs'
        });
      }
    }

    // --- Risco & Endividamento ---
    if (ri) {
      if (ri.comprometimentoReceita > 0 && ri.comprometimentoReceita > 30) {
        cards.push({
          titulo: 'Endividamento comprometendo a receita',
          descricao: `${pct(ri.comprometimentoReceita)} da receita está comprometida com dívidas. Renegocie ou consolide para liberar fluxo.`,
          impacto: ri.comprometimentoReceita > 50 ? 'alto' : 'medio',
          tipo: 'risco',
          modulo: 'Risco & Endividamento'
        });
      }

      if (ri.mesesReserva > 0 && ri.mesesReserva < 3) {
        cards.push({
          titulo: 'Reserva de emergência insuficiente',
          descricao: `Apenas ${ri.mesesReserva} meses de reserva. O ideal é manter pelo menos 3-6 meses de despesas como colchão de segurança.`,
          impacto: ri.mesesReserva < 1 ? 'alto' : 'medio',
          tipo: 'risco',
          modulo: 'Risco & Endividamento'
        });
      }
    }

    // --- Governança ---
    if (gov) {
      if (gov.separacaoCpfCnpj > 0 && gov.separacaoCpfCnpj <= 2) {
        cards.push({
          titulo: 'Separação PF/PJ deficiente',
          descricao: 'A mistura de finanças pessoais e empresariais dificulta a análise real. Separe contas e controles para ter clareza nos números.',
          impacto: 'alto',
          tipo: 'melhoria',
          modulo: 'Governança Financeira'
        });
      }

      if (gov.proLabore > 0 && gov.proLabore <= 2) {
        cards.push({
          titulo: 'Pró-labore não definido adequadamente',
          descricao: 'Definir um pró-labore fixo melhora a previsibilidade financeira e separa remuneração do sócio dos lucros da empresa.',
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Governança Financeira'
        });
      }
    }

    // --- Maturidade de Processos ---
    if (mat) {
      const processFields = ['padronizacao', 'rotinas', 'controles', 'previsibilidade', 'usoDeDados'];
      const ferramentaFields = ['sistemaGestao', 'automacaoFinanceira', 'integracaoSistemas'];
      const relatorioFields = ['dre', 'fluxoCaixaRelatorio', 'balancoPatrimonial', 'conciliacaoBancaria', 'analiseIndicadores'];

      const avg = (fields: string[]) => {
        const vals = fields.map(f => mat[f] || 0).filter(v => v > 0);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      };

      const avgProcessos = avg(processFields);
      const avgFerramentas = avg(ferramentaFields);
      const avgRelatorios = avg(relatorioFields);

      if (avgFerramentas > 0 && avgFerramentas <= 2) {
        cards.push({
          titulo: 'Ferramentas financeiras subutilizadas',
          descricao: 'Investir em ERP ou automação financeira pode reduzir retrabalho e erros, liberando tempo para análise estratégica.',
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Maturidade de Processos'
        });
      }

      if (avgRelatorios > 0 && avgRelatorios <= 2) {
        cards.push({
          titulo: 'Relatórios financeiros insuficientes',
          descricao: 'Sem DRE, Balanço e Fluxo de Caixa estruturados, decisões são tomadas no escuro. Priorize a implantação desses relatórios.',
          impacto: 'alto',
          tipo: 'melhoria',
          modulo: 'Maturidade de Processos'
        });
      }

      if (avgProcessos > 0 && avgProcessos <= 2) {
        cards.push({
          titulo: 'Processos financeiros imaturos',
          descricao: 'Padronização e controles fracos geram riscos operacionais. Documente rotinas e implemente checklists de verificação.',
          impacto: 'medio',
          tipo: 'melhoria',
          modulo: 'Maturidade de Processos'
        });
      }
    }

    // Sort: alto > medio > baixo, risco > oportunidade > melhoria
    const impactoOrder = { alto: 0, medio: 1, baixo: 2 };
    const tipoOrder = { risco: 0, oportunidade: 1, melhoria: 2 };
    cards.sort((a, b) => impactoOrder[a.impacto] - impactoOrder[b.impacto] || tipoOrder[a.tipo] - tipoOrder[b.tipo]);

    return cards;
  }, [financialData]);

  useEffect(() => {
    const progress = decisoes.length > 0 ? 100 : 0;
    updateBlockProgress('simuladorDecisoes', progress);
    if (progress === 100) markBlockComplete('simuladorDecisoes');
  }, [decisoes, updateBlockProgress, markBlockComplete]);

  const saveNotes = (value: string) => {
    updateData('financialSimulation' as any, { ...financialData, simuladorDecisoes: { ...financialData?.simuladorDecisoes, notes: value } });
  };

  const tipoConfig = {
    risco: { icon: ShieldAlert, color: 'text-red-500', bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/30', label: 'Risco' },
    oportunidade: { icon: TrendingUp, color: 'text-green-500', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/30', label: 'Oportunidade' },
    melhoria: { icon: Lightbulb, color: 'text-amber-500', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/30', label: 'Melhoria' }
  };

  const impactoConfig = {
    alto: { color: 'bg-red-500/15 text-red-600 border-red-500/20', label: '⚡ Alto Impacto' },
    medio: { color: 'bg-amber-500/15 text-amber-600 border-amber-500/20', label: '● Médio Impacto' },
    baixo: { color: 'bg-blue-500/15 text-blue-600 border-blue-500/20', label: '○ Baixo Impacto' }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Decisões estratégicas geradas automaticamente com base nos dados preenchidos nos outros módulos.
      </p>

      {decisoes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground mb-1">Nenhuma decisão identificada</h3>
            <p className="text-sm text-muted-foreground">Preencha os outros módulos financeiros para que decisões e oportunidades apareçam aqui automaticamente.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{decisoes.length} decisões identificadas</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-500" /> {decisoes.filter(d => d.tipo === 'risco').length} riscos</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500" /> {decisoes.filter(d => d.tipo === 'oportunidade').length} oportunidades</span>
            <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3 text-amber-500" /> {decisoes.filter(d => d.tipo === 'melhoria').length} melhorias</span>
          </div>

          <div className="grid gap-4">
            {decisoes.map((d, i) => {
              const tc = tipoConfig[d.tipo];
              const ic = impactoConfig[d.impacto];
              const Icon = tc.icon;

              return (
                <Card key={i} className={`bg-gradient-to-br ${tc.bg} ${tc.border} border`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${tc.color}`} />
                        <h4 className="font-semibold text-foreground">{d.titulo}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${ic.color}`}>{ic.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{d.descricao}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> {d.modulo}
                      </span>
                      {d.detalhe && (
                        <span className="text-[11px] text-muted-foreground/60">{d.detalhe}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Observações sobre as decisões estratégicas..."
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
