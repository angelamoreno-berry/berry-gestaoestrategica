import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export function CapitalGiroBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.capitalGiro || { prazoMedioRecebimento: 0, prazoMedioPagamento: 0, prazoMedioEstoque: 0, cicloOperacional: 0, cicloFinanceiro: 0, necessidadeCapitalGiro: 0, capitalGiroDisponivel: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  const cicloOp = state.prazoMedioRecebimento + state.prazoMedioEstoque;
  const cicloFin = cicloOp - state.prazoMedioPagamento;
  const gap = state.necessidadeCapitalGiro - state.capitalGiroDisponivel;

  useEffect(() => {
    const fields = ['prazoMedioRecebimento', 'prazoMedioPagamento', 'necessidadeCapitalGiro'];
    const filled = fields.filter(f => state[f] > 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('capitalGiro', progress);
    if (progress === 100) markBlockComplete('capitalGiro');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, capitalGiro: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, capitalGiro: newState });
  };

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

      <div className="space-y-3">
        <ValueSlider label="Prazo Médio de Recebimento" value={state.prazoMedioRecebimento} onChange={(v) => handleChange('prazoMedioRecebimento', v)} min={0} max={180} step={1} leftLabel="À vista" rightLabel="Prazo longo" invertColors formatValue={(v) => `${v} dias`} naoSabe={naoSabe.prazoMedioRecebimento} onNaoSabeChange={(v) => handleNaoSabe('prazoMedioRecebimento', v)} />
        <ValueSlider label="Prazo Médio de Pagamento" value={state.prazoMedioPagamento} onChange={(v) => handleChange('prazoMedioPagamento', v)} min={0} max={180} step={1} leftLabel="À vista" rightLabel="Prazo longo" formatValue={(v) => `${v} dias`} naoSabe={naoSabe.prazoMedioPagamento} onNaoSabeChange={(v) => handleNaoSabe('prazoMedioPagamento', v)} />
        <ValueSlider label="Prazo Médio de Estoque" value={state.prazoMedioEstoque} onChange={(v) => handleChange('prazoMedioEstoque', v)} min={0} max={180} step={1} leftLabel="Giro rápido" rightLabel="Estoque parado" invertColors formatValue={(v) => `${v} dias`} naoSabe={naoSabe.prazoMedioEstoque} onNaoSabeChange={(v) => handleNaoSabe('prazoMedioEstoque', v)} />
        <ValueSlider label="Necessidade de Capital de Giro" value={state.necessidadeCapitalGiro} onChange={(v) => handleChange('necessidadeCapitalGiro', v)} min={0} max={2000000} step={5000} leftLabel="Baixa necessidade" rightLabel="Alta necessidade" invertColors formatValue={fmt} naoSabe={naoSabe.necessidadeCapitalGiro} onNaoSabeChange={(v) => handleNaoSabe('necessidadeCapitalGiro', v)} />
        <ValueSlider label="Capital de Giro Disponível" value={state.capitalGiroDisponivel} onChange={(v) => handleChange('capitalGiroDisponivel', v)} min={0} max={2000000} step={5000} leftLabel="Sem capital" rightLabel="Capital saudável" formatValue={fmt} naoSabe={naoSabe.capitalGiroDisponivel} onNaoSabeChange={(v) => handleNaoSabe('capitalGiroDisponivel', v)} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre capital de giro..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value as any)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
