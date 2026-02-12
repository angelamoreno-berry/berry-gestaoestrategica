import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wallet } from 'lucide-react';

export function FluxoCaixaBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.fluxoCaixa || { saldoAtual: 0, entradasPrevistas30d: 0, saidasPrevistas30d: 0, entradasPrevistas60d: 0, saidasPrevistas60d: 0, entradasPrevistas90d: 0, saidasPrevistas90d: 0, notes: '' };

  const [state, setState] = useState(initial);

  const saldo30 = state.saldoAtual + state.entradasPrevistas30d - state.saidasPrevistas30d;
  const saldo60 = saldo30 + state.entradasPrevistas60d - state.saidasPrevistas60d;
  const saldo90 = saldo60 + state.entradasPrevistas90d - state.saidasPrevistas90d;

  useEffect(() => {
    const has = [state.saldoAtual !== 0, state.entradasPrevistas30d > 0, state.saidasPrevistas30d > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('fluxoCaixa', progress);
    if (progress === 100) markBlockComplete('fluxoCaixa');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, fluxoCaixa: newState });
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Visualize o caixa atual e projete os próximos 30, 60 e 90 dias.</p>

      {/* Projection Cards */}
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

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wallet className="w-5 h-5" /> Saldo Atual</CardTitle></CardHeader>
        <CardContent>
          <Input type="number" placeholder="R$ 0,00" value={state.saldoAtual || ''} onChange={(e) => handleChange('saldoAtual', Number(e.target.value))} />
        </CardContent>
      </Card>

      {[
        { period: '30 dias', entKey: 'entradasPrevistas30d', saiKey: 'saidasPrevistas30d' },
        { period: '60 dias', entKey: 'entradasPrevistas60d', saiKey: 'saidasPrevistas60d' },
        { period: '90 dias', entKey: 'entradasPrevistas90d', saiKey: 'saidasPrevistas90d' },
      ].map(({ period, entKey, saiKey }) => (
        <Card key={period}>
          <CardHeader><CardTitle className="text-lg">Projeção — {period}</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Entradas previstas</label>
              <Input type="number" placeholder="R$ 0,00" value={state[entKey] || ''} onChange={(e) => handleChange(entKey, Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Saídas previstas</label>
              <Input type="number" placeholder="R$ 0,00" value={state[saiKey] || ''} onChange={(e) => handleChange(saiKey, Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre fluxo de caixa..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
