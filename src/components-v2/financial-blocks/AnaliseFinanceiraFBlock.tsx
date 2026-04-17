import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export function AnaliseFinanceiraFBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.analiseFinanceira || { faturamentoMensal: 0, despesasFixas: 0, despesasVariaveis: 0, lucroLiquido: 0, margemLiquida: 0, ticketMedio: 0, quantidadeClientes: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  const lucro = state.faturamentoMensal - state.despesasFixas - state.despesasVariaveis;
  const margem = state.faturamentoMensal > 0 ? Math.round((lucro / state.faturamentoMensal) * 100).toString() : '0';

  // Ponto de Equilíbrio calculation
  const margemContribuicaoPct = state.faturamentoMensal > 0
    ? ((state.faturamentoMensal - state.despesasVariaveis) / state.faturamentoMensal)
    : 0;
  const pontoEquilibrio = margemContribuicaoPct > 0
    ? state.despesasFixas / margemContribuicaoPct
    : 0;
  const folga = state.faturamentoMensal - pontoEquilibrio;
  const folgaPct = pontoEquilibrio > 0 ? Math.round((folga / pontoEquilibrio) * 100).toString() : '0';

  useEffect(() => {
    const fields = ['faturamentoMensal', 'despesasFixas', 'quantidadeClientes', 'ticketMedio'];
    const filled = fields.filter(f => state[f] > 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('analiseFinanceira', progress);
    if (progress === 100) markBlockComplete('analiseFinanceira');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, analiseFinanceira: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, analiseFinanceira: newState });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Leitura dos números atuais e saúde financeira da empresa.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Faturamento</span></div>
            <p className="text-lg font-bold">{fmt(state.faturamentoMensal)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-500" /><span className="text-xs text-muted-foreground">Despesas Totais</span></div>
            <p className="text-lg font-bold">{fmt(state.despesasFixas + state.despesasVariaveis)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Lucro Líquido</span></div>
            <p className={`text-lg font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(lucro)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Margem</span></div>
            <p className={`text-lg font-bold ${Number(margem) >= 20 ? 'text-green-600' : Number(margem) >= 10 ? 'text-orange-600' : 'text-red-600'}`}>{margem}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Ponto de Equilíbrio */}
      {(state.faturamentoMensal > 0 || state.despesasFixas > 0) && (
        <Card className="border-dashed border-2 border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-foreground">Ponto de Equilíbrio (Break-even)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Faturamento mínimo necessário</p>
                <p className="text-xl font-bold text-foreground">{fmt(pontoEquilibrio)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Margem de contribuição</p>
                <p className="text-xl font-bold text-foreground">{Math.round(margemContribuicaoPct * 100)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Folga sobre o break-even</p>
                <p className={`text-xl font-bold ${folga >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {fmt(folga)} <span className="text-sm font-normal">({folgaPct}%)</span>
                </p>
              </div>
            </div>
            {folga < 0 && (
              <p className="text-sm text-red-500 mt-3">⚠️ O faturamento atual está abaixo do ponto de equilíbrio. A empresa está operando no prejuízo.</p>
            )}
            {folga >= 0 && folga < pontoEquilibrio * 0.1 && (
              <p className="text-sm text-orange-500 mt-3">⚠️ A folga é muito pequena. Qualquer queda de receita pode levar ao prejuízo.</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <ValueSlider label="Faturamento Mensal" value={state.faturamentoMensal} onChange={(v) => handleChange('faturamentoMensal', v)} min={0} max={2000000} step={5000} leftLabel="Sem receita" rightLabel="Alto faturamento" formatValue={fmt} naoSabe={naoSabe.faturamentoMensal} onNaoSabeChange={(v) => handleNaoSabe('faturamentoMensal', v)} />
        <ValueSlider label="Ticket Médio" value={state.ticketMedio} onChange={(v) => handleChange('ticketMedio', v)} min={0} max={50000} step={100} leftLabel="Baixo" rightLabel="Alto ticket" formatValue={fmt} naoSabe={naoSabe.ticketMedio} onNaoSabeChange={(v) => handleNaoSabe('ticketMedio', v)} />
        <ValueSlider label="Quantidade de Clientes" value={state.quantidadeClientes} onChange={(v) => handleChange('quantidadeClientes', v)} min={0} max={5000} step={10} leftLabel="Poucos clientes" rightLabel="Muitos clientes" formatValue={(v) => `${v} clientes`} naoSabe={naoSabe.quantidadeClientes} onNaoSabeChange={(v) => handleNaoSabe('quantidadeClientes', v)} />
        <ValueSlider label="Despesas Fixas (mensal)" value={state.despesasFixas} onChange={(v) => handleChange('despesasFixas', v)} min={0} max={1000000} step={5000} leftLabel="Despesas baixas" rightLabel="Despesas altas" invertColors formatValue={fmt} naoSabe={naoSabe.despesasFixas} onNaoSabeChange={(v) => handleNaoSabe('despesasFixas', v)} />
        <ValueSlider label="Despesas Variáveis (mensal)" value={state.despesasVariaveis} onChange={(v) => handleChange('despesasVariaveis', v)} min={0} max={1000000} step={5000} leftLabel="Despesas baixas" rightLabel="Despesas altas" invertColors formatValue={fmt} naoSabe={naoSabe.despesasVariaveis} onNaoSabeChange={(v) => handleNaoSabe('despesasVariaveis', v)} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre a análise financeira..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value as any)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
