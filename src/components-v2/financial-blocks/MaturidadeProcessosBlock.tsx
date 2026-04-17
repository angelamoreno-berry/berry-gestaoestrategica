import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaturidadeProcessosData } from '@/types/financialSimulation';
import { ValueSlider } from './ValueSlider';

interface Dimension {
  key: string;
  label: string;
  desc: string;
}

const categories = [
  {
    id: 'processos',
    label: 'Processos',
    icon: '⚙️',
    dimensions: [
      { key: 'padronizacao', label: 'Padronização', desc: 'Processos financeiros documentados e seguidos consistentemente' },
      { key: 'rotinas', label: 'Rotinas Financeiras', desc: 'Conciliações, fechamentos e conferências realizados periodicamente' },
      { key: 'controles', label: 'Controles Internos', desc: 'Alçadas de aprovação, conferências e segregação de funções' },
      { key: 'previsibilidade', label: 'Previsibilidade', desc: 'Capacidade de prever receitas, despesas e fluxo de caixa' },
      { key: 'usoDeDados', label: 'Uso de Dados', desc: 'Decisões financeiras baseadas em dados e indicadores' },
    ] as Dimension[],
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    icon: '🛠️',
    dimensions: [
      { key: 'sistemaGestao', label: 'Sistema de Gestão (ERP)', desc: 'Utilização de ERP ou sistema integrado para controle financeiro' },
      { key: 'automacaoFinanceira', label: 'Automação Financeira', desc: 'Automação de cobranças, pagamentos, emissão de notas e conciliações' },
      { key: 'integracaoSistemas', label: 'Integração de Sistemas', desc: 'Integração entre banco, ERP, CRM e ferramentas de gestão' },
    ] as Dimension[],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: '📊',
    dimensions: [
      { key: 'dre', label: 'DRE (Demonstração de Resultado)', desc: 'Elaboração e análise mensal da DRE para avaliar lucro/prejuízo' },
      { key: 'fluxoCaixaRelatorio', label: 'Fluxo de Caixa', desc: 'Controle detalhado de entradas e saídas com projeções futuras' },
      { key: 'balancoPatrimonial', label: 'Balanço Patrimonial', desc: 'Elaboração e análise do balanço para entender a saúde financeira' },
      { key: 'conciliacaoBancaria', label: 'Conciliação Bancária', desc: 'Conferência periódica entre extratos bancários e controle interno' },
      { key: 'analiseIndicadores', label: 'Análise de Indicadores', desc: 'Acompanhamento regular de KPIs financeiros (margens, liquidez, etc.)' },
    ] as Dimension[],
  },
  {
    id: 'planejamento',
    label: 'Planejamento',
    icon: '📋',
    dimensions: [
      { key: 'orcamentoAnual', label: 'Orçamento Anual', desc: 'Planejamento orçamentário anual com metas e acompanhamento mensal' },
      { key: 'planejamentoTributario', label: 'Planejamento Tributário', desc: 'Estratégia tributária ativa para otimizar a carga fiscal' },
      { key: 'gestaoContratos', label: 'Gestão de Contratos', desc: 'Controle de contratos de receita e despesa com alertas de vencimento' },
      { key: 'projecaoFinanceira', label: 'Projeção Financeira', desc: 'Modelos de projeção de receita, custos e lucro para 6-12 meses' },
    ] as Dimension[],
  },
];

const allDimensions = categories.flatMap(c => c.dimensions);

const levelLabels: Record<number, string> = { 1: 'Inexistente', 2: 'Inicial', 3: 'Definido', 4: 'Gerenciado', 5: 'Otimizado' };

export function MaturidadeProcessosBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const financialData = (data as any).financialSimulation;
  const localData: MaturidadeProcessosData = financialData?.maturidadeProcessos || {};

  const [state, setState] = useState<Record<string, any>>(localData);
  const [naoSabe, setNaoSabe] = useState<Record<string, boolean>>(localData._naoSabe || {});

  useEffect(() => {
    const values = allDimensions.map(d => (state[d.key] as number) || 0);
    const naoSabeCount = allDimensions.filter(d => naoSabe[d.key]).length;
    const filled = values.filter(v => v > 0).length + naoSabeCount;
    const progress = Math.round((filled / allDimensions.length) * 100);
    updateBlockProgress('maturidadeProcessos', progress);
    if (progress === 100) markBlockComplete('maturidadeProcessos');
  }, [state, naoSabe, updateBlockProgress, markBlockComplete]);

  const handleChange = (key: string, value: number) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, maturidadeProcessos: newState });
  };

  const handleNaoSabe = (key: string, value: boolean) => {
    const newNaoSabe = { ...naoSabe, [key]: value };
    setNaoSabe(newNaoSabe);
    const newState = { ...state, _naoSabe: newNaoSabe, [key]: value ? 0 : state[key] };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, maturidadeProcessos: newState });
  };

  const handleNotes = (value: string) => {
    const newState = { ...state, notes: value };
    setState(newState);
    updateData('financialSimulation' as any, { ...financialData, maturidadeProcessos: newState });
  };

  const getCategoryScore = (dims: Dimension[]) => {
    const values = dims.map(d => (state[d.key] as number) || 0).filter(v => v > 0);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
  };

  const overallAverage = (() => {
    const values = allDimensions.map(d => (state[d.key] as number) || 0).filter(v => v > 0);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
  })();

  const getCategoryCompletion = (dims: Dimension[]) => {
    const filled = dims.filter(d => (state[d.key] as number) > 0 || naoSabe[d.key]).length;
    return `${filled}/${dims.length}`;
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Avalie o nível de maturidade dos processos financeiros da empresa em {allDimensions.length} dimensões organizadas em 4 categorias. Cada dimensão recebe uma nota de 1 a 5.
      </p>

      {/* Score Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="col-span-2 md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-[11px] text-muted-foreground mb-1">Score Geral</p>
            <p className="text-3xl font-bold text-primary">{Math.round(overallAverage)}</p>
            <p className="text-[11px] text-muted-foreground">de 5</p>
          </CardContent>
        </Card>
        {categories.map(cat => {
          const score = getCategoryScore(cat.dimensions);
          return (
            <Card key={cat.id} className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-[11px] text-muted-foreground mb-1">{cat.icon} {cat.label}</p>
                <p className="text-2xl font-bold">{score > 0 ? Math.round(score) : '—'}</p>
                <p className="text-[11px] text-muted-foreground">{getCategoryCompletion(cat.dimensions)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs by Category */}
      <Tabs defaultValue="processos" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs md:text-sm">
              <span className="hidden md:inline mr-1">{cat.icon}</span> {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-3 mt-4">
            {cat.dimensions.map((dim) => (
              <ValueSlider
                key={dim.key}
                label={dim.label}
                description={dim.desc}
                value={(state[dim.key] as number) || 1}
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
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações sobre a maturidade dos processos financeiros..."
            value={state.notes || ''}
            onChange={(e) => handleNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
