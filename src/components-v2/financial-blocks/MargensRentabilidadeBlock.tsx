import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ValueSlider } from './ValueSlider';

export function MargensRentabilidadeBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.margensRentabilidade || { margemBruta: 0, margemContribuicao: 0, margemLiquida: 0, roe: 0, roiMedio: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  useEffect(() => {
    const fields = ['margemBruta', 'margemContribuicao', 'margemLiquida'];
    const filled = fields.filter(f => state[f] > 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('margensRentabilidade', progress);
    if (progress === 100) markBlockComplete('margensRentabilidade');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, margensRentabilidade: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
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

      <div className="space-y-3">
        <ValueSlider label="Margem Bruta" description="Receita menos custo direto dos produtos/serviços" value={state.margemBruta} onChange={(v) => handleChange('margemBruta', v)} min={0} max={100} step={1} leftLabel="Margem crítica" rightLabel="Margem excelente" formatValue={(v) => `${v}%`} naoSabe={naoSabe.margemBruta} onNaoSabeChange={(v) => handleNaoSabe('margemBruta', v)} />
        <ValueSlider label="Margem de Contribuição" description="Lucro após custos variáveis para cobrir custos fixos" value={state.margemContribuicao} onChange={(v) => handleChange('margemContribuicao', v)} min={0} max={100} step={1} leftLabel="Margem crítica" rightLabel="Margem excelente" formatValue={(v) => `${v}%`} naoSabe={naoSabe.margemContribuicao} onNaoSabeChange={(v) => handleNaoSabe('margemContribuicao', v)} />
        <ValueSlider label="Margem Líquida" description="Lucro final após todas as despesas e impostos" value={state.margemLiquida} onChange={(v) => handleChange('margemLiquida', v)} min={0} max={100} step={1} leftLabel="Prejuízo" rightLabel="Lucro saudável" formatValue={(v) => `${v}%`} naoSabe={naoSabe.margemLiquida} onNaoSabeChange={(v) => handleNaoSabe('margemLiquida', v)} />
        <ValueSlider label="ROE — Retorno sobre Patrimônio" description="Retorno gerado sobre o capital investido pelos sócios" value={state.roe} onChange={(v) => handleChange('roe', v)} min={0} max={100} step={1} leftLabel="Retorno baixo" rightLabel="Retorno alto" formatValue={(v) => `${v}%`} naoSabe={naoSabe.roe} onNaoSabeChange={(v) => handleNaoSabe('roe', v)} />
        <ValueSlider label="ROI Médio" description="Retorno sobre investimentos realizados" value={state.roiMedio} onChange={(v) => handleChange('roiMedio', v)} min={0} max={200} step={1} leftLabel="ROI baixo" rightLabel="ROI alto" formatValue={(v) => `${v}%`} naoSabe={naoSabe.roiMedio} onNaoSabeChange={(v) => handleNaoSabe('roiMedio', v)} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre margens e rentabilidade..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value as any)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
