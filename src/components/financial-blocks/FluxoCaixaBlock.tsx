import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export function FluxoCaixaBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.fluxoCaixa || { saldoAtual: 0, entradasPrevistas30d: 0, saidasPrevistas30d: 0, entradasPrevistas60d: 0, saidasPrevistas60d: 0, entradasPrevistas90d: 0, saidasPrevistas90d: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  const saldo30 = state.saldoAtual + state.entradasPrevistas30d - state.saidasPrevistas30d;
  const saldo60 = saldo30 + state.entradasPrevistas60d - state.saidasPrevistas60d;
  const saldo90 = saldo60 + state.entradasPrevistas90d - state.saidasPrevistas90d;

  useEffect(() => {
    const fields = ['saldoAtual', 'entradasPrevistas30d', 'saidasPrevistas30d'];
    const filled = fields.filter(f => state[f] !== 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('fluxoCaixa', progress);
    if (progress === 100) markBlockComplete('fluxoCaixa');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, fluxoCaixa: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, fluxoCaixa: newState });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Visualize o caixa atual e projete os próximos 30, 60 e 90 dias.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Saldo Atual', value: state.saldoAtual },
          { label: 'Projeção 30d', value: saldo30 },
          { label: 'Projeção 60d', value: saldo60 },
          { label: 'Projeção 90d', value: saldo90 },
        ].map((item) => (
          <Card key={item.label} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <ValueSlider label="Saldo Atual em Caixa" value={state.saldoAtual} onChange={(v) => handleChange('saldoAtual', v)} min={0} max={2000000} step={5000} leftLabel="Caixa zerado" rightLabel="Caixa confortável" formatValue={fmt} naoSabe={naoSabe.saldoAtual} onNaoSabeChange={(v) => handleNaoSabe('saldoAtual', v)} />

        {[
          { period: '30 dias', entKey: 'entradasPrevistas30d', saiKey: 'saidasPrevistas30d' },
          { period: '60 dias', entKey: 'entradasPrevistas60d', saiKey: 'saidasPrevistas60d' },
          { period: '90 dias', entKey: 'entradasPrevistas90d', saiKey: 'saidasPrevistas90d' },
        ].map(({ period, entKey, saiKey }) => (
          <div key={period} className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground pt-2">Projeção — {period}</p>
            <ValueSlider label={`Entradas previstas (${period})`} value={state[entKey]} onChange={(v) => handleChange(entKey, v)} min={0} max={2000000} step={5000} leftLabel="Sem entradas" rightLabel="Entradas altas" formatValue={fmt} naoSabe={naoSabe[entKey]} onNaoSabeChange={(v) => handleNaoSabe(entKey, v)} />
            <ValueSlider label={`Saídas previstas (${period})`} value={state[saiKey]} onChange={(v) => handleChange(saiKey, v)} min={0} max={2000000} step={5000} leftLabel="Saídas baixas" rightLabel="Saídas altas" invertColors formatValue={fmt} naoSabe={naoSabe[saiKey]} onNaoSabeChange={(v) => handleNaoSabe(saiKey, v)} />
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre fluxo de caixa..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value as any)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
