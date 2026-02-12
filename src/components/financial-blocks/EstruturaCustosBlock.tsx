import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

export function EstruturaCustosBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.estruturaCustos || { custosFixos: [], custosVariaveis: [], pontoEquilibrio: 0, margemContribuicao: 0, notes: '' };

  const [state, setState] = useState(initial);
  const [newFixo, setNewFixo] = useState({ descricao: '', valor: '' });
  const [newVar, setNewVar] = useState({ descricao: '', percentual: '' });

  const totalFixos = state.custosFixos.reduce((a: number, c: any) => a + c.valor, 0);
  const totalVarPerc = state.custosVariaveis.reduce((a: number, c: any) => a + c.percentual, 0);

  useEffect(() => {
    const has = [state.custosFixos.length > 0, state.custosVariaveis.length > 0];
    const progress = Math.round((has.filter(Boolean).length / has.length) * 100);
    updateBlockProgress('estruturaCustos', progress);
    if (progress === 100) markBlockComplete('estruturaCustos');
  }, [state, updateBlockProgress, markBlockComplete]);

  const save = (newState: any) => {
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, estruturaCustos: newState });
  };

  const addFixo = () => {
    if (newFixo.descricao && newFixo.valor) {
      save({ ...state, custosFixos: [...state.custosFixos, { descricao: newFixo.descricao, valor: Number(newFixo.valor) }] });
      setNewFixo({ descricao: '', valor: '' });
    }
  };

  const addVar = () => {
    if (newVar.descricao && newVar.percentual) {
      save({ ...state, custosVariaveis: [...state.custosVariaveis, { descricao: newVar.descricao, percentual: Number(newVar.percentual) }] });
      setNewVar({ descricao: '', percentual: '' });
    }
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Mapeie custos fixos e variáveis para calcular o ponto de equilíbrio.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Custos Fixos</p>
            <p className="text-2xl font-bold">{fmt(totalFixos)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Custos Variáveis (%)</p>
            <p className="text-2xl font-bold">{totalVarPerc.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Custos Fixos */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Custos Fixos Mensais</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {state.custosFixos.map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <span className="flex-1 text-sm">{c.descricao}</span>
              <span className="font-medium text-sm">{fmt(c.valor)}</span>
              <button onClick={() => save({ ...state, custosFixos: state.custosFixos.filter((_: any, idx: number) => idx !== i) })} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Descrição" value={newFixo.descricao} onChange={(e) => setNewFixo({ ...newFixo, descricao: e.target.value })} />
            <Input type="number" placeholder="Valor" className="w-32" value={newFixo.valor} onChange={(e) => setNewFixo({ ...newFixo, valor: e.target.value })} />
            <Button size="icon" onClick={addFixo}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Custos Variáveis */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Custos Variáveis (% da receita)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {state.custosVariaveis.map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <span className="flex-1 text-sm">{c.descricao}</span>
              <span className="font-medium text-sm">{c.percentual}%</span>
              <button onClick={() => save({ ...state, custosVariaveis: state.custosVariaveis.filter((_: any, idx: number) => idx !== i) })} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Descrição" value={newVar.descricao} onChange={(e) => setNewVar({ ...newVar, descricao: e.target.value })} />
            <Input type="number" placeholder="%" className="w-24" value={newVar.percentual} onChange={(e) => setNewVar({ ...newVar, percentual: e.target.value })} />
            <Button size="icon" onClick={addVar}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre estrutura de custos..." value={state.notes} onChange={(e) => save({ ...state, notes: e.target.value })} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
