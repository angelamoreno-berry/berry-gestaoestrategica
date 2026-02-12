import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function CapitalGiroBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.capitalGiro || { prazoMedioRecebimento: 0, prazoMedioPagamento: 0, prazoMedioEstoque: 0, cicloOperacional: 0, cicloFinanceiro: 0, necessidadeCapitalGiro: 0, capitalGiroDisponivel: 0, notes: '' };

  const [state, setState] = useState(initial);

  const cicloOp = state.prazoMedioRecebimento + state.prazoMedioEstoque;
  const cicloFin = cicloOp - state.prazoMedioPagamento;
  const gap = state.necessidadeCapitalGiro - state.capitalGiroDisponivel;

  useEffect(() => {
    const has = [state.prazoMedioRecebimento > 0, state.prazoMedioPagamento > 0, state.necessidadeCapitalGiro > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('capitalGiro', progress);
    if (progress === 100) markBlockComplete('capitalGiro');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, capitalGiro: newState });
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Analise os prazos médios, ciclo financeiro e necessidade de capital de giro.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ciclo Operacional</p>
            <p className="text-2xl font-bold">{cicloOp} dias</p>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${cicloFin > 0 ? 'from-orange-500/10 to-orange-500/5 border-orange-500/20' : 'from-green-500/10 to-green-500/5 border-green-500/20'}`}>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ciclo Financeiro</p>
            <p className="text-2xl font-bold">{cicloFin} dias</p>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${gap > 0 ? 'from-red-500/10 to-red-500/5 border-red-500/20' : 'from-green-500/10 to-green-500/5 border-green-500/20'}`}>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Gap de Capital</p>
            <p className={`text-2xl font-bold ${gap > 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(gap)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Prazos Médios (em dias)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Prazo Médio Recebimento</label>
            <Input type="number" placeholder="0" value={state.prazoMedioRecebimento || ''} onChange={(e) => handleChange('prazoMedioRecebimento', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Prazo Médio Pagamento</label>
            <Input type="number" placeholder="0" value={state.prazoMedioPagamento || ''} onChange={(e) => handleChange('prazoMedioPagamento', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Prazo Médio Estoque</label>
            <Input type="number" placeholder="0" value={state.prazoMedioEstoque || ''} onChange={(e) => handleChange('prazoMedioEstoque', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Capital de Giro</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Necessidade de Capital de Giro</label>
            <Input type="number" placeholder="R$ 0,00" value={state.necessidadeCapitalGiro || ''} onChange={(e) => handleChange('necessidadeCapitalGiro', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Capital de Giro Disponível</label>
            <Input type="number" placeholder="R$ 0,00" value={state.capitalGiroDisponivel || ''} onChange={(e) => handleChange('capitalGiroDisponivel', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre capital de giro..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
