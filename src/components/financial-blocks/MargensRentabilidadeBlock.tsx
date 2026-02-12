import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function MargensRentabilidadeBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.margensRentabilidade || { margemBruta: 0, margemContribuicao: 0, margemLiquida: 0, roe: 0, roiMedio: 0, notes: '' };

  const [state, setState] = useState(initial);

  useEffect(() => {
    const has = [state.margemBruta > 0, state.margemContribuicao > 0, state.margemLiquida > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('margensRentabilidade', progress);
    if (progress === 100) markBlockComplete('margensRentabilidade');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, margensRentabilidade: newState });
  };

  const getColor = (v: number, good: number, warn: number) =>
    v >= good ? 'text-green-600' : v >= warn ? 'text-orange-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Analise as margens do negócio: bruta, de contribuição e líquida, além de indicadores de rentabilidade.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Margem Bruta', value: state.margemBruta, good: 40, warn: 25 },
          { label: 'Margem Contribuição', value: state.margemContribuicao, good: 30, warn: 15 },
          { label: 'Margem Líquida', value: state.margemLiquida, good: 15, warn: 5 },
        ].map((item) => (
          <Card key={item.label} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${getColor(item.value, item.good, item.warn)}`}>{item.value}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Margens (%)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Margem Bruta (%)</label>
            <Input type="number" placeholder="0" value={state.margemBruta || ''} onChange={(e) => handleChange('margemBruta', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Margem de Contribuição (%)</label>
            <Input type="number" placeholder="0" value={state.margemContribuicao || ''} onChange={(e) => handleChange('margemContribuicao', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Margem Líquida (%)</label>
            <Input type="number" placeholder="0" value={state.margemLiquida || ''} onChange={(e) => handleChange('margemLiquida', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Rentabilidade</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">ROE - Retorno sobre Patrimônio (%)</label>
            <Input type="number" placeholder="0" value={state.roe || ''} onChange={(e) => handleChange('roe', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">ROI Médio (%)</label>
            <Input type="number" placeholder="0" value={state.roiMedio || ''} onChange={(e) => handleChange('roiMedio', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre margens e rentabilidade..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
