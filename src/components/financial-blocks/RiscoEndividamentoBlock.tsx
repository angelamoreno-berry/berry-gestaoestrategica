import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Shield } from 'lucide-react';

export function RiscoEndividamentoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.riscoEndividamento || { totalDividas: 0, parcelasMensais: 0, comprometimentoReceita: 0, reservaEmergencia: 0, mesesReserva: 0, sensibilidadeQueda10: '', sensibilidadeQueda20: '', capacidadePagamento: '', notes: '' };

  const [state, setState] = useState(initial);

  useEffect(() => {
    const has = [state.totalDividas > 0 || state.comprometimentoReceita > 0, state.reservaEmergencia > 0, state.sensibilidadeQueda10.length > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('riscoEndividamento', progress);
    if (progress === 100) markBlockComplete('riscoEndividamento');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string) => {
    const newState = { ...state, [field]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, riscoEndividamento: newState });
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

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

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Endividamento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Total de Dívidas (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.totalDividas || ''} onChange={(e) => handleChange('totalDividas', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Parcelas Mensais (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.parcelasMensais || ''} onChange={(e) => handleChange('parcelasMensais', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">% da Receita Comprometida</label>
              <Input type="number" placeholder="0" value={state.comprometimentoReceita || ''} onChange={(e) => handleChange('comprometimentoReceita', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Reserva de Emergência</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Reserva Disponível (R$)</label>
              <Input type="number" placeholder="R$ 0,00" value={state.reservaEmergencia || ''} onChange={(e) => handleChange('reservaEmergencia', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Meses de Cobertura</label>
              <Input type="number" placeholder="0" value={state.mesesReserva || ''} onChange={(e) => handleChange('mesesReserva', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
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
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre risco e endividamento..." value={state.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
