import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Shield } from 'lucide-react';
import { ValueSlider } from './ValueSlider';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export function RiscoEndividamentoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.riscoEndividamento || { totalDividas: 0, parcelasMensais: 0, comprometimentoReceita: 0, reservaEmergencia: 0, mesesReserva: 0, sensibilidadeQueda10: '', sensibilidadeQueda20: '', capacidadePagamento: '', notes: '' };

  const [state, setState] = useState(initial);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(initial._naoSabe || {});

  useEffect(() => {
    const fields = ['totalDividas', 'reservaEmergencia', 'comprometimentoReceita'];
    const filled = fields.filter(f => state[f] > 0 || naoSabe[f]).length;
    const progress = Math.round((filled / fields.length) * 100);
    updateBlockProgress('riscoEndividamento', progress);
    if (progress === 100) markBlockComplete('riscoEndividamento');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, riscoEndividamento: newState });
  };

  const handleNaoSabe = (field: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [field]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [field]: value ? 0 : state[field] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, riscoEndividamento: newState });
  };

  const riskLevel = state.comprometimentoReceita > 30 ? 'Alto' : state.comprometimentoReceita > 15 ? 'Moderado' : 'Baixo';
  const riskColor = riskLevel === 'Alto' ? 'text-red-600' : riskLevel === 'Moderado' ? 'text-orange-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Avalie o nível de risco, sensibilidade a quedas de receita e capacidade de pagamento.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className={`bg-gradient-to-br ${riskLevel === 'Alto' ? 'from-red-500/10 border-red-500/20' : riskLevel === 'Moderado' ? 'from-orange-500/10 border-orange-500/20' : 'from-green-500/10 border-green-500/20'}`}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className={`w-6 h-6 mx-auto mb-1 ${riskColor}`} />
            <p className="text-xs text-muted-foreground mb-1">Nível de Risco</p>
            <p className={`text-xl font-bold ${riskColor}`}>{riskLevel}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Comprometimento</p>
            <p className="text-2xl font-bold">{state.comprometimentoReceita}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-xs text-muted-foreground mb-1">Reserva</p>
            <p className="text-xl font-bold">{state.mesesReserva} meses</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <ValueSlider label="Total de Dívidas" description="Soma de todas as dívidas da empresa" value={state.totalDividas} onChange={(v) => handleChange('totalDividas', v)} min={0} max={5000000} step={10000} leftLabel="Sem dívidas" rightLabel="Altamente endividada" invertColors formatValue={fmt} naoSabe={naoSabe.totalDividas} onNaoSabeChange={(v) => handleNaoSabe('totalDividas', v)} />
        <ValueSlider label="Parcelas Mensais" description="Total de parcelas mensais a pagar" value={state.parcelasMensais} onChange={(v) => handleChange('parcelasMensais', v)} min={0} max={500000} step={1000} leftLabel="Parcelas baixas" rightLabel="Parcelas altas" invertColors formatValue={fmt} naoSabe={naoSabe.parcelasMensais} onNaoSabeChange={(v) => handleNaoSabe('parcelasMensais', v)} />
        <ValueSlider label="% da Receita Comprometida" description="Percentual da receita comprometido com dívidas" value={state.comprometimentoReceita} onChange={(v) => handleChange('comprometimentoReceita', v)} min={0} max={100} step={1} leftLabel="Livre" rightLabel="Totalmente comprometida" invertColors formatValue={(v) => `${v}%`} naoSabe={naoSabe.comprometimentoReceita} onNaoSabeChange={(v) => handleNaoSabe('comprometimentoReceita', v)} />
        <ValueSlider label="Reserva de Emergência" description="Valor disponível para emergências" value={state.reservaEmergencia} onChange={(v) => handleChange('reservaEmergencia', v)} min={0} max={2000000} step={5000} leftLabel="Sem reserva" rightLabel="Reserva sólida" formatValue={fmt} naoSabe={naoSabe.reservaEmergencia} onNaoSabeChange={(v) => handleNaoSabe('reservaEmergencia', v)} />
        <ValueSlider label="Meses de Cobertura" description="Quantos meses a reserva cobre os custos fixos" value={state.mesesReserva} onChange={(v) => handleChange('mesesReserva', v)} min={0} max={24} step={1} leftLabel="0 meses" rightLabel="24+ meses" formatValue={(v) => `${v} meses`} naoSabe={naoSabe.mesesReserva} onNaoSabeChange={(v) => handleNaoSabe('mesesReserva', v)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Análise de Sensibilidade</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Se a receita cair 10%, o que acontece?</label>
            <Textarea placeholder="Descreva o impacto..." value={state.sensibilidadeQueda10} onChange={(e) => handleChange('sensibilidadeQueda10', e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Se a receita cair 20%, o que acontece?</label>
            <Textarea placeholder="Descreva o impacto..." value={state.sensibilidadeQueda20} onChange={(e) => handleChange('sensibilidadeQueda20', e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Capacidade de Pagamento</label>
            <Textarea placeholder="Avalie a capacidade de honrar compromissos..." value={state.capacidadePagamento} onChange={(e) => handleChange('capacidadePagamento', e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre risco e endividamento..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
