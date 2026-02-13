import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, FlaskConical, TrendingUp, TrendingDown } from 'lucide-react';
import { CenarioSimulacao } from '@/types/financialSimulation';
import { ValueSlider } from './ValueSlider';

export function SimuladorDecisoesBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const initial = financialData?.simuladorDecisoes || { cenarios: [], notes: '' };

  const [state, setState] = useState(initial);
  const [newCenario, setNewCenario] = useState<Partial<CenarioSimulacao>>({
    nome: '', tipo: 'preco', descricao: '', impactoReceita: 0, impactoCusto: 0, impactoLucro: 0
  });

  useEffect(() => {
    const progress = state.cenarios.length >= 2 ? 100 : state.cenarios.length === 1 ? 50 : 0;
    updateBlockProgress('simuladorDecisoes', progress);
    if (progress === 100) markBlockComplete('simuladorDecisoes');
  }, [state, updateBlockProgress, markBlockComplete]);

  const save = (newState: any) => {
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, simuladorDecisoes: newState });
  };

  const addCenario = () => {
    if (newCenario.nome && newCenario.descricao) {
      const lucro = (newCenario.impactoReceita || 0) - (newCenario.impactoCusto || 0);
      save({ ...state, cenarios: [...state.cenarios, { ...newCenario, impactoLucro: lucro }] });
      setNewCenario({ nome: '', tipo: 'preco', descricao: '', impactoReceita: 0, impactoCusto: 0, impactoLucro: 0 });
    }
  };

  const removeCenario = (index: number) => {
    save({ ...state, cenarios: state.cenarios.filter((_: any, i: number) => i !== index) });
  };

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const tipoLabels: Record<string, string> = { preco: 'Preço', custo: 'Custo', equipe: 'Equipe', investimento: 'Investimento' };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Simule decisões estratégicas: "e se" para preço, custos, equipe e investimentos.</p>

      {state.cenarios.length > 0 && (
        <div className="space-y-4">
          {state.cenarios.map((c: CenarioSimulacao, i: number) => (
            <Card key={i} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold">{c.nome}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tipoLabels[c.tipo]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.descricao}</p>
                  </div>
                  <button onClick={() => removeCenario(i)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Impacto Receita</p>
                    <p className={`text-sm font-bold flex items-center justify-center gap-1 ${c.impactoReceita >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {c.impactoReceita >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {fmt(c.impactoReceita)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Impacto Custo</p>
                    <p className={`text-sm font-bold ${c.impactoCusto > 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(c.impactoCusto)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Impacto Lucro</p>
                    <p className={`text-sm font-bold ${c.impactoLucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(c.impactoLucro)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="w-5 h-5" /> Novo Cenário</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nome do Cenário</label>
              <Input placeholder="Ex: Aumento de 15% no preço" value={newCenario.nome} onChange={(e) => setNewCenario({ ...newCenario, nome: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
              <Select value={newCenario.tipo} onValueChange={(v) => setNewCenario({ ...newCenario, tipo: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="preco">Preço</SelectItem>
                  <SelectItem value="custo">Custo</SelectItem>
                  <SelectItem value="equipe">Equipe</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
            <Textarea placeholder="Descreva o cenário..." value={newCenario.descricao} onChange={(e) => setNewCenario({ ...newCenario, descricao: e.target.value })} rows={2} />
          </div>
          <div className="space-y-3">
            <ValueSlider
              label="Impacto na Receita (R$/mês)"
              value={newCenario.impactoReceita || 0}
              onChange={(v) => setNewCenario({ ...newCenario, impactoReceita: v })}
              min={-500000}
              max={500000}
              step={5000}
              leftLabel="Redução de receita"
              rightLabel="Aumento de receita"
              formatValue={fmt}
            />
            <ValueSlider
              label="Impacto no Custo (R$/mês)"
              value={newCenario.impactoCusto || 0}
              onChange={(v) => setNewCenario({ ...newCenario, impactoCusto: v })}
              min={-500000}
              max={500000}
              step={5000}
              leftLabel="Redução de custo"
              rightLabel="Aumento de custo"
              invertColors
              formatValue={fmt}
            />
          </div>
          <Button onClick={addCenario} disabled={!newCenario.nome || !newCenario.descricao} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Cenário
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Textarea placeholder="Observações sobre os cenários simulados..." value={state.notes} onChange={(e) => save({ ...state, notes: e.target.value })} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
