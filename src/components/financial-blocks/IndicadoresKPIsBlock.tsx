import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function IndicadoresKPIsBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.indicadoresKPIs || { ebitda: 0, ebitdaMargin: 0, geracaoCaixa: 0, eficienciaOperacional: 0, cac: 0, ltv: 0, ltvCacRatio: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});
  const ltvCacRatio = state.cac > 0 ? (state.ltv / state.cac).toFixed(1) : '0';

  useEffect(() => {
    const fields = ['ebitda', 'cac', 'ltv'];
    const filled = fields.filter(f => state[f] > 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('indicadoresKPIs', progress);
    if (progress === 100) markBlockComplete('indicadoresKPIs');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, indicadoresKPIs: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, indicadoresKPIs: newState });
  };

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

      <div className="space-y-3">
        <ValueSlider label="EBITDA" description="Lucro antes de juros, impostos, depreciação e amortização" value={state.ebitda} onChange={(v) => handleChange('ebitda', v)} min={0} max={2000000} step={5000} leftLabel="EBITDA baixo" rightLabel="EBITDA alto" formatValue={fmt} naoSabe={naoSabe.ebitda} onNaoSabeChange={(v) => handleNaoSabe('ebitda', v)} />
        <ValueSlider label="Margem EBITDA" description="Percentual do EBITDA sobre a receita" value={state.ebitdaMargin} onChange={(v) => handleChange('ebitdaMargin', v)} min={0} max={100} step={1} leftLabel="Margem baixa" rightLabel="Margem alta" formatValue={(v) => `${v}%`} naoSabe={naoSabe.ebitdaMargin} onNaoSabeChange={(v) => handleNaoSabe('ebitdaMargin', v)} />
        <ValueSlider label="Geração de Caixa (mensal)" description="Caixa gerado pelas operações mensalmente" value={state.geracaoCaixa} onChange={(v) => handleChange('geracaoCaixa', v)} min={0} max={1000000} step={5000} leftLabel="Caixa baixo" rightLabel="Caixa alto" formatValue={fmt} naoSabe={naoSabe.geracaoCaixa} onNaoSabeChange={(v) => handleNaoSabe('geracaoCaixa', v)} />
        <ValueSlider label="Eficiência Operacional" description="Percentual de eficiência nas operações" value={state.eficienciaOperacional} onChange={(v) => handleChange('eficienciaOperacional', v)} min={0} max={100} step={1} leftLabel="Ineficiente" rightLabel="Altamente eficiente" formatValue={(v) => `${v}%`} naoSabe={naoSabe.eficienciaOperacional} onNaoSabeChange={(v) => handleNaoSabe('eficienciaOperacional', v)} />
        <ValueSlider label="CAC — Custo de Aquisição de Cliente" description="Quanto custa adquirir um novo cliente" value={state.cac} onChange={(v) => handleChange('cac', v)} min={0} max={50000} step={100} leftLabel="CAC baixo" rightLabel="CAC alto" invertColors formatValue={fmt} naoSabe={naoSabe.cac} onNaoSabeChange={(v) => handleNaoSabe('cac', v)} />
        <ValueSlider label="LTV — Lifetime Value" description="Valor total que um cliente gera ao longo do tempo" value={state.ltv} onChange={(v) => handleChange('ltv', v)} min={0} max={200000} step={500} leftLabel="LTV baixo" rightLabel="LTV alto" formatValue={fmt} naoSabe={naoSabe.ltv} onNaoSabeChange={(v) => handleNaoSabe('ltv', v)} />
      </div>

      {!naoSabe.cac && !naoSabe.ltv && state.cac > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <span className="text-sm text-muted-foreground">LTV/CAC Ratio: </span>
            <span className={`font-bold ${Number(ltvCacRatio) >= 3 ? 'text-green-600' : 'text-orange-600'}`}>{ltvCacRatio}x</span>
            <span className="text-xs text-muted-foreground ml-2">(ideal: ≥ 3x)</span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre KPIs financeiros..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value as any)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
