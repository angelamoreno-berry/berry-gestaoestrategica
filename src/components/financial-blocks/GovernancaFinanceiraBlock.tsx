import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GovernancaFinanceiraData } from '@/types/financialSimulation';

const dimensions = [
  { key: 'separacaoCpfCnpj', label: 'Separação CPF x CNPJ', desc: 'Contas, despesas e patrimônio pessoal totalmente separados da empresa' },
  { key: 'disciplinaGestao', label: 'Disciplina de Gestão', desc: 'Rotina consistente de acompanhamento financeiro e fechamentos' },
  { key: 'tomadaDecisao', label: 'Tomada de Decisão', desc: 'Decisões financeiras baseadas em dados, não em intuição' },
  { key: 'proLabore', label: 'Pró-labore Definido', desc: 'Retirada fixa definida e respeitada pelo(s) sócio(s)' },
  { key: 'planejamentoTributario', label: 'Planejamento Tributário', desc: 'Regime tributário adequado e planejamento fiscal ativo' },
];

const levelLabels = ['', 'Inexistente', 'Inicial', 'Definido', 'Gerenciado', 'Otimizado'];

export function GovernancaFinanceiraBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const localData: GovernancaFinanceiraData = financialData?.governancaFinanceira || { separacaoCpfCnpj: 0, disciplinaGestao: 0, tomadaDecisao: 0, proLabore: 0, planejamentoTributario: 0, notes: '' };

  const [state, setState] = useState(localData);

  useEffect(() => {
    const values = dimensions.map(d => state[d.key as keyof GovernancaFinanceiraData] as number);
    const filled = values.filter(v => v > 0).length;
    const progress = Math.round((filled / dimensions.length) * 100);
    updateBlockProgress('governancaFinanceira', progress);
    if (progress === 100) markBlockComplete('governancaFinanceira');
  }, [state, updateBlockProgress, markBlockComplete]);

  const handleChange = (key: string, value: number) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, governancaFinanceira: newState });
  };

  const handleNotes = (value: string) => {
    const newState = { ...state, notes: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, governancaFinanceira: newState });
  };

  const average = (() => {
    const values = dimensions.map(d => state[d.key as keyof GovernancaFinanceiraData] as number).filter(v => v > 0);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0';
  })();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Avalie o nível de governança financeira: separação patrimonial, disciplina e qualidade da gestão financeira.
      </p>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Score de Governança</p>
          <p className="text-4xl font-bold text-primary">{average}</p>
          <p className="text-sm text-muted-foreground mt-1">de 5.0</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {dimensions.map((dim) => {
          const value = state[dim.key as keyof GovernancaFinanceiraData] as number;
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

      <Card>
        <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Observações sobre governança financeira..." value={state.notes} onChange={(e) => handleNotes(e.target.value)} rows={3} />
        </CardContent>
      </Card>
    </div>
  );
}
