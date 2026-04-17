import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GovernancaFinanceiraData } from '@/types-v2/financialSimulation';
import { ValueSlider } from './ValueSlider';

const dimensions = [
  { key: 'separacaoCpfCnpj', label: 'Separação CPF x CNPJ', desc: 'Contas, despesas e patrimônio pessoal totalmente separados da empresa' },
  { key: 'disciplinaGestao', label: 'Disciplina de Gestão', desc: 'Rotina consistente de acompanhamento financeiro e fechamentos' },
  { key: 'tomadaDecisao', label: 'Tomada de Decisão', desc: 'Decisões financeiras baseadas em dados, não em intuição' },
  { key: 'proLabore', label: 'Pró-labore Definido', desc: 'Retirada fixa definida e respeitada pelo(s) sócio(s)' },
  { key: 'planejamentoTributario', label: 'Planejamento Tributário', desc: 'Regime tributário adequado e planejamento fiscal ativo' },
];

const levelLabels: Record<number, string> = { 1: 'Inexistente', 2: 'Inicial', 3: 'Definido', 4: 'Gerenciado', 5: 'Otimizado' };

export function GovernancaFinanceiraBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const localData: GovernancaFinanceiraData = financialData?.governancaFinanceira || { separacaoCpfCnpj: 0, disciplinaGestao: 0, tomadaDecisao: 0, proLabore: 0, planejamentoTributario: 0, notes: '' };

  const [state, setState] = useState(localData);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>((localData as any)._naoSabe || {});

  useEffect(() => {
    const values = dimensions.map(d => state[d.key as keyof GovernancaFinanceiraData] as number);
    const naoSabeCount = dimensions.filter(d => naoSabe[d.key]).length;
    const filled = values.filter(v => v > 0).length + naoSabeCount;
    const progress = Math.round((filled / dimensions.length) * 100);
    updateBlockProgress('governancaFinanceira', progress);
    if (progress === 100) markBlockComplete('governancaFinanceira');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (key: string, value: number) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, governancaFinanceira: newState });
  };

  const handleNaoSabe = (key: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [key]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [key]: value ? 0 : state[key as keyof GovernancaFinanceiraData] } as any;
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
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length).toString() : '0';
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
          <p className="text-sm text-muted-foreground mt-1">de 5</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {dimensions.map((dim) => (
          <ValueSlider
            key={dim.key}
            label={dim.label}
            description={dim.desc}
            value={(state[dim.key as keyof GovernancaFinanceiraData] as number) || 1}
            onChange={(v) => handleChange(dim.key, v)}
            min={1}
            max={5}
            step={1}
            leftLabel="Inexistente"
            rightLabel="Otimizado"
            formatValue={(v) => `${v} — ${levelLabels[v] || ''}`}
            naoSabe={naoSabe[dim.key] || false}
            onNaoSabeChange={(v) => handleNaoSabe(dim.key, v)}
          />
        ))}
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
