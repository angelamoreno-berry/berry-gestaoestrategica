import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function AnaliseFinanceiraFBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.analiseFinanceira || { faturamentoMensal: 0, despesasFixas: 0, despesasVariaveis: 0, lucroLiquido: 0, margemLiquida: 0, ticketMedio: 0, quantidadeClientes: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  const lucro = state.faturamentoMensal - state.despesasFixas - state.despesasVariaveis;
  const margem = state.faturamentoMensal > 0 ? ((lucro / state.faturamentoMensal) * 100).toFixed(1) : '0';

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
