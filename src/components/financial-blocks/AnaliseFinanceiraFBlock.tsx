import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export function AnaliseFinanceiraFBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.analiseFinanceira || { faturamentoMensal: 0, despesasFixas: 0, despesasVariaveis: 0, lucroLiquido: 0, margemLiquida: 0, ticketMedio: 0, quantidadeClientes: 0, notes: '' };

  const [state, setState] = useState(initial);

  const lucro = state.faturamentoMensal - state.despesasFixas - state.despesasVariaveis;
  const margem = state.faturamentoMensal > 0 ? ((lucro / state.faturamentoMensal) * 100).toFixed(1) : '0';

  useEffect(() => {
    const has = [state.faturamentoMensal > 0, state.despesasFixas > 0, state.quantidadeClientes > 0, state.ticketMedio > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('analiseFinanceira', progress);
    if (progress === 100) markBlockComplete('analiseFinanceira');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, analiseFinanceira: newState });
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Leitura dos números atuais e saúde financeira da empresa.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Faturamento</span></div>
            <p className="text-lg font-bold">{formatCurrency(state.faturamentoMensal)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-500" /><span className="text-xs text-muted-foreground">Despesas Totais</span></div>
            <p className="text-lg font-bold">{formatCurrency(state.despesasFixas + state.despesasVariaveis)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Lucro Líquido</span></div>
            <p className={`text-lg font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(lucro)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Margem</span></div>
            <p className={`text-lg font-bold ${Number(margem) >= 20 ? 'text-green-600' : Number(margem) >= 10 ? 'text-orange-600' : 'text-red-600'}`}>{margem}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Receita</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Faturamento Mensal</label>
              <Input type="number" placeholder="R$ 0,00" value={state.faturamentoMensal || ''} onChange={(e) => handleChange('faturamentoMensal', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Ticket Médio</label>
              <Input type="number" placeholder="R$ 0,00" value={state.ticketMedio || ''} onChange={(e) => handleChange('ticketMedio', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Quantidade de Clientes</label>
              <Input type="number" placeholder="0" value={state.quantidadeClientes || ''} onChange={(e) => handleChange('quantidadeClientes', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Despesas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Despesas Fixas (mensal)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.despesasFixas || ''} onChange={(e) => handleChange('despesasFixas', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Despesas Variáveis (mensal)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.despesasVariaveis || ''} onChange={(e) => handleChange('despesasVariaveis', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre a análise financeira..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
