import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function IndicadoresKPIsBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.indicadoresKPIs || { ebitda: 0, ebitdaMargin: 0, geracaoCaixa: 0, eficienciaOperacional: 0, cac: 0, ltv: 0, ltvCacRatio: 0, notes: '' };

  const [state, setState] = useState(initial);
  const ltvCacRatio = state.cac > 0 ? (state.ltv / state.cac).toFixed(1) : '0';

  useEffect(() => {
    const has = [state.ebitda > 0, state.cac > 0, state.ltv > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('indicadoresKPIs', progress);
    if (progress === 100) markBlockComplete('indicadoresKPIs');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, indicadoresKPIs: newState });
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Indicadores-chave de performance financeira: EBITDA, geração de caixa e eficiência.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">EBITDA</p>
            <p className="text-lg font-bold">{fmt(state.ebitda)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Margem EBITDA</p>
            <p className="text-lg font-bold">{state.ebitdaMargin}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">LTV/CAC</p>
            <p className={`text-lg font-bold ${Number(ltvCacRatio) >= 3 ? 'text-green-600' : 'text-orange-600'}`}>{ltvCacRatio}x</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Eficiência</p>
            <p className="text-lg font-bold">{state.eficienciaOperacional}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">EBITDA & Geração de Caixa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">EBITDA (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.ebitda || ''} onChange={(e) => handleChange('ebitda', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Margem EBITDA (%)</label>
              <Input type="number" placeholder="0" value={state.ebitdaMargin || ''} onChange={(e) => handleChange('ebitdaMargin', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Geração de Caixa (R$/mês)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.geracaoCaixa || ''} onChange={(e) => handleChange('geracaoCaixa', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Eficiência Operacional (%)</label>
              <Input type="number" placeholder="0" value={state.eficienciaOperacional || ''} onChange={(e) => handleChange('eficienciaOperacional', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">CAC & LTV</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">CAC - Custo de Aquisição (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.cac || ''} onChange={(e) => handleChange('cac', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">LTV - Lifetime Value (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.ltv || ''} onChange={(e) => handleChange('ltv', Number(e.target.value))} />
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <span className="text-sm text-muted-foreground">LTV/CAC Ratio: </span>
              <span className={`font-bold ${Number(ltvCacRatio) >= 3 ? 'text-green-600' : 'text-orange-600'}`}>{ltvCacRatio}x</span>
              <span className="text-xs text-muted-foreground ml-2">(ideal: ≥ 3x)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre KPIs financeiros..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
