import { useEffect, useMemo } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components-v2/ProgressRing';

function getClassificacao(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excelência', color: 'text-green-600' };
  if (score >= 60) return { label: 'Otimizado', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Estruturado', color: 'text-primary' };
  if (score >= 20) return { label: 'Em Desenvolvimento', color: 'text-orange-600' };
  return { label: 'Crítico', color: 'text-red-600' };
}

function getRecomendacoes(financialData: any): string[] {
  const recs: string[] = [];
  const mp = financialData?.maturidadeProcessos;
  const gf = financialData?.governancaFinanceira;
  const af = financialData?.analiseFinanceira;
  const re = financialData?.riscoEndividamento;

  if (mp) {
    const avg = [mp.padronizacao, mp.rotinas, mp.controles, mp.previsibilidade, mp.usoDeDados].filter((v: number) => v > 0);
    const mean = avg.length > 0 ? avg.reduce((a: number, b: number) => a + b, 0) / avg.length : 0;
    if (mean < 3) recs.push('Priorize a padronização e documentação dos processos financeiros');
    if (mp.usoDeDados < 3) recs.push('Invista em ferramentas de gestão financeira e análise de dados');
  }

  if (gf) {
    if (gf.separacaoCpfCnpj < 3) recs.push('URGENTE: Separe completamente as finanças pessoais das empresariais');
    if (gf.proLabore < 3) recs.push('Defina e respeite um pró-labore fixo para os sócios');
  }

  if (af) {
    const margem = af.faturamentoMensal > 0 ? ((af.faturamentoMensal - af.despesasFixas - af.despesasVariaveis) / af.faturamentoMensal * 100) : 0;
    if (margem < 10) recs.push('Margem crítica: revise estrutura de custos e estratégia de preços');
    if (margem >= 10 && margem < 20) recs.push('Busque aumentar a margem para pelo menos 20%');
  }

  if (re) {
    if (re.comprometimentoReceita > 30) recs.push('Renegociar dívidas para reduzir comprometimento da receita');
    if (re.mesesReserva < 3) recs.push('Construir reserva de emergência de pelo menos 6 meses de custos fixos');
  }

  if (recs.length === 0) recs.push('Continue monitorando os indicadores e busque otimizações contínuas');
  return recs;
}

export function ScoreGeralBlock() {
  const { blocks, updateBlockProgress, markBlockComplete, data } = useConsulting();
  const financialData = (data as any).financialSimulation;

  const { scoreProcessos, scoreFinanceiro, scoreGeral, classificacao, recomendacoes } = useMemo(() => {
    // Score de Processos: average of maturidadeProcessos + governancaFinanceira (1-5 → 0-100)
    const mp = financialData?.maturidadeProcessos;
    const gf = financialData?.governancaFinanceira;

    const mpValues = mp ? [mp.padronizacao, mp.rotinas, mp.controles, mp.previsibilidade, mp.usoDeDados].filter((v: number) => v > 0) : [];
    const gfValues = gf ? [gf.separacaoCpfCnpj, gf.disciplinaGestao, gf.tomadaDecisao, gf.proLabore, gf.planejamentoTributario].filter((v: number) => v > 0) : [];
    const allProcessValues = [...mpValues, ...gfValues];
    const scoreP = allProcessValues.length > 0 ? Math.round((allProcessValues.reduce((a, b) => a + b, 0) / allProcessValues.length / 5) * 100) : 0;

    // Score Financeiro: average of all other block progresses
    const finBlocks = blocks.filter(b => !['maturidadeProcessos', 'governancaFinanceira', 'scoreGeral'].includes(b.id));
    const scoreF = finBlocks.length > 0 ? Math.round(finBlocks.reduce((a, b) => a + b.progress, 0) / finBlocks.length) : 0;

    const scoreG = Math.round((scoreP * 0.4 + scoreF * 0.6));
    const classif = getClassificacao(scoreG);
    const recs = getRecomendacoes(financialData);

    return { scoreProcessos: scoreP, scoreFinanceiro: scoreF, scoreGeral: scoreG, classificacao: classif, recomendacoes: recs };
  }, [financialData, blocks]);

  useEffect(() => {
    const progress = scoreGeral > 0 ? 100 : 0;
    updateBlockProgress('scoreGeral', progress);
    if (progress === 100) markBlockComplete('scoreGeral');
  }, [scoreGeral, updateBlockProgress, markBlockComplete]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Pontuação consolidada de maturidade financeira com classificação do estágio e recomendações.</p>

      {/* Main Score */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-8 flex flex-col items-center">
          <ProgressRing progress={scoreGeral} size={120} strokeWidth={8} />
          <h3 className={`text-2xl font-bold mt-4 ${classificacao.color}`}>{classificacao.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">Score Geral de Maturidade Financeira</p>
        </CardContent>
      </Card>

      {/* Sub-scores */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <ProgressRing progress={scoreProcessos} size={64} strokeWidth={5} />
            <div>
              <p className="text-sm text-muted-foreground">Score de Processos</p>
              <p className="text-xl font-bold">{scoreProcessos}/100</p>
              <p className="text-xs text-muted-foreground">Maturidade + Governança</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <ProgressRing progress={scoreFinanceiro} size={64} strokeWidth={5} />
            <div>
              <p className="text-sm text-muted-foreground">Score Financeiro</p>
              <p className="text-xl font-bold">{scoreFinanceiro}/100</p>
              <p className="text-xs text-muted-foreground">Análise + Indicadores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Block Progress */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Progresso por Módulo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {blocks.filter(b => b.id !== 'scoreGeral').map((block) => (
            <div key={block.id} className="flex items-center gap-3">
              <span className="text-lg">{block.icon}</span>
              <span className="flex-1 text-sm">{block.name}</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${block.progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{block.progress}%</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader><CardTitle className="text-lg">Recomendações Práticas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recomendacoes.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Badge variant="outline" className="mt-0.5 text-xs shrink-0">{i + 1}</Badge>
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
