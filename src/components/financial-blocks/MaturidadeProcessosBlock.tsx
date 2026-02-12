import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MaturidadeProcessosData } from '@/types/financialSimulation';

const dimensions = [
  { key: 'padronizacao', label: 'Padronização', desc: 'Processos financeiros documentados e seguidos consistentemente' },
  { key: 'rotinas', label: 'Rotinas Financeiras', desc: 'Conciliações, fechamentos e conferências realizados periodicamente' },
  { key: 'controles', label: 'Controles Internos', desc: 'Alçadas de aprovação, conferências e segregação de funções' },
  { key: 'previsibilidade', label: 'Previsibilidade', desc: 'Capacidade de prever receitas, despesas e fluxo de caixa' },
  { key: 'usoDeDados', label: 'Uso de Dados', desc: 'Decisões financeiras baseadas em dados e indicadores' },
];

const levelLabels = ['', 'Inexistente', 'Inicial', 'Definido', 'Gerenciado', 'Otimizado'];

export function MaturidadeProcessosBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const localData: MaturidadeProcessosData = financialData?.maturidadeProcessos || { padronizacao: 0, rotinas: 0, controles: 0, previsibilidade: 0, usoDeDados: 0, notes: '' };

  const [state, setState] = useState(localData);

  useEffect(() => {
    const values = dimensions.map(d => state[d.key as keyof MaturidadeProcessosData] as number);
    const filled = values.filter(v => v > 0).length;
    const progress = Math.round((filled / dimensions.length) * 100);
    updateBlockProgress('maturidadeProcessos', progress);
    if (progress === 100) markBlockComplete('maturidadeProcessos');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (key: string, value: number) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, maturidadeProcessos: newState });
  };

  const handleNotes = (value: string) => {
    const newState = { ...state, notes: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, maturidadeProcessos: newState });
  };

  const average = (() => {
    const values = dimensions.map(d => state[d.key as keyof MaturidadeProcessosData] as number).filter(v => v > 0);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0';
  })();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Avalie o nível de maturidade dos processos financeiros da empresa em 5 dimensões. Cada dimensão recebe uma nota de 1 a 5.
      </p>

      {/* Score Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Score Médio de Maturidade</p>
          <p className="text-4xl font-bold text-primary">{average}</p>
          <p className="text-sm text-muted-foreground mt-1">de 5.0</p>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <div className="space-y-4">
        {dimensions.map((dim) => {
          const value = state[dim.key as keyof MaturidadeProcessosData] as number;
          return (
            <Card key={dim.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{dim.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{dim.desc}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleChange(dim.key, level)}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                        value === level
                          ? 'bg-primary text-primary-foreground shadow-md scale-105'
                          : 'bg-muted hover:bg-muted-foreground/10 text-muted-foreground'
                      }`}
                    >
                      <div className="text-lg font-bold">{level}</div>
                      <div className="text-[10px] mt-0.5">{levelLabels[level]}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações sobre a maturidade dos processos financeiros..."
            value={state.notes}
            onChange={(e) => handleNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
