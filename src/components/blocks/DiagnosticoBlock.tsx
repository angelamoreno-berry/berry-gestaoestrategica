import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { value: number; label: string }[];
}

interface AreaConfig {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  questions: Question[];
}

const areasConfig: AreaConfig[] = [
  {
    key: 'pessoas',
    label: 'Pessoas',
    color: 'border-l-[hsl(var(--brand-blue))]',
    bgColor: 'bg-[hsl(var(--brand-blue))]',
    icon: '👥',
    description: 'Gestão de equipe, cultura, talentos e desenvolvimento',
    questions: [
      {
        id: 'p1',
        question: 'A empresa possui uma estrutura de cargos e funções bem definida?',
        options: [
          { value: 1, label: 'Não existe estrutura definida' },
          { value: 2, label: 'Existe informalmente, sem documentação' },
          { value: 3, label: 'Existe documentação básica de cargos' },
          { value: 4, label: 'Estrutura clara com descrições de cargo' },
          { value: 5, label: 'Estrutura completa com plano de carreira' },
        ],
      },
      {
        id: 'p2',
        question: 'Como é feito o processo de contratação de novos colaboradores?',
        options: [
          { value: 1, label: 'Contratações por indicação sem processo' },
          { value: 2, label: 'Processo informal de entrevistas' },
          { value: 3, label: 'Processo estruturado básico' },
          { value: 4, label: 'Processo com etapas definidas e critérios' },
          { value: 5, label: 'Processo completo com onboarding estruturado' },
        ],
      },
      {
        id: 'p3',
        question: 'Existe um programa de treinamento e desenvolvimento?',
        options: [
          { value: 1, label: 'Não existe treinamento' },
          { value: 2, label: 'Treinamentos pontuais quando necessário' },
          { value: 3, label: 'Alguns treinamentos planejados' },
          { value: 4, label: 'Programa de desenvolvimento estruturado' },
          { value: 5, label: 'Universidade corporativa ou PDI individual' },
        ],
      },
      {
        id: 'p4',
        question: 'Como é a comunicação interna na empresa?',
        options: [
          { value: 1, label: 'Comunicação caótica e informal' },
          { value: 2, label: 'Comunicação básica por WhatsApp/email' },
          { value: 3, label: 'Reuniões periódicas de alinhamento' },
          { value: 4, label: 'Canais definidos e rituais de comunicação' },
          { value: 5, label: 'Comunicação integrada com ferramentas e rituais' },
        ],
      },
      {
        id: 'p5',
        question: 'Existe avaliação de desempenho dos colaboradores?',
        options: [
          { value: 1, label: 'Não existe avaliação' },
          { value: 2, label: 'Feedback informal ocasional' },
          { value: 3, label: 'Avaliação anual básica' },
          { value: 4, label: 'Avaliação periódica com metas' },
          { value: 5, label: 'Sistema completo com OKRs e feedback contínuo' },
        ],
      },
    ],
  },
  {
    key: 'processos',
    label: 'Processos',
    color: 'border-l-[hsl(var(--brand-teal))]',
    bgColor: 'bg-[hsl(var(--brand-teal))]',
    icon: '⚙️',
    description: 'Fluxos de trabalho, automações e eficiência operacional',
    questions: [
      {
        id: 'pr1',
        question: 'Os processos principais da empresa estão documentados?',
        options: [
          { value: 1, label: 'Nenhum processo documentado' },
          { value: 2, label: 'Alguns processos conhecidos informalmente' },
          { value: 3, label: 'Processos principais descritos' },
          { value: 4, label: 'Processos documentados com responsáveis' },
          { value: 5, label: 'Mapeamento completo com melhorias contínuas' },
        ],
      },
      {
        id: 'pr2',
        question: 'Qual o nível de automação dos processos?',
        options: [
          { value: 1, label: 'Tudo manual, sem ferramentas' },
          { value: 2, label: 'Uso básico de planilhas' },
          { value: 3, label: 'Algumas ferramentas específicas' },
          { value: 4, label: 'Sistemas integrados parcialmente' },
          { value: 5, label: 'Automação avançada e integrações completas' },
        ],
      },
      {
        id: 'pr3',
        question: 'Como é feito o controle de qualidade?',
        options: [
          { value: 1, label: 'Não existe controle de qualidade' },
          { value: 2, label: 'Verificação informal pelo responsável' },
          { value: 3, label: 'Checklists básicos' },
          { value: 4, label: 'Padrões de qualidade definidos' },
          { value: 5, label: 'Sistema de gestão da qualidade implementado' },
        ],
      },
      {
        id: 'pr4',
        question: 'Existe padronização nos serviços/produtos entregues?',
        options: [
          { value: 1, label: 'Cada entrega é diferente' },
          { value: 2, label: 'Tentativa de padronização informal' },
          { value: 3, label: 'Templates e modelos básicos' },
          { value: 4, label: 'Processos padronizados documentados' },
          { value: 5, label: 'Metodologia própria consolidada' },
        ],
      },
      {
        id: 'pr5',
        question: 'Como é a gestão de projetos/demandas?',
        options: [
          { value: 1, label: 'Sem gestão, demandas soltas' },
          { value: 2, label: 'Lista de tarefas básica' },
          { value: 3, label: 'Ferramenta de gestão simples' },
          { value: 4, label: 'Metodologia de gestão aplicada' },
          { value: 5, label: 'PMO ou gestão profissional de portfólio' },
        ],
      },
    ],
  },
  {
    key: 'financas',
    label: 'Finanças',
    color: 'border-l-[hsl(var(--brand-green))]',
    bgColor: 'bg-[hsl(var(--brand-green))]',
    icon: '💰',
    description: 'Controle financeiro, fluxo de caixa e indicadores',
    questions: [
      {
        id: 'f1',
        question: 'Como é o controle do fluxo de caixa?',
        options: [
          { value: 1, label: 'Não existe controle' },
          { value: 2, label: 'Controle básico em planilha' },
          { value: 3, label: 'Fluxo de caixa atualizado semanalmente' },
          { value: 4, label: 'Sistema financeiro com projeções' },
          { value: 5, label: 'Gestão financeira completa com cenários' },
        ],
      },
      {
        id: 'f2',
        question: 'Existe separação entre finanças pessoais e da empresa?',
        options: [
          { value: 1, label: 'Totalmente misturado' },
          { value: 2, label: 'Parcialmente separado' },
          { value: 3, label: 'Contas separadas, mas uso misto' },
          { value: 4, label: 'Separação clara com pró-labore' },
          { value: 5, label: 'Governança financeira completa' },
        ],
      },
      {
        id: 'f3',
        question: 'A empresa conhece seus custos e margem de lucro?',
        options: [
          { value: 1, label: 'Não conhece os custos reais' },
          { value: 2, label: 'Conhece custos básicos' },
          { value: 3, label: 'Custos mapeados por categoria' },
          { value: 4, label: 'Custeio por produto/serviço' },
          { value: 5, label: 'Análise de rentabilidade por cliente/projeto' },
        ],
      },
      {
        id: 'f4',
        question: 'Como é feito o planejamento financeiro?',
        options: [
          { value: 1, label: 'Não existe planejamento' },
          { value: 2, label: 'Projeções informais' },
          { value: 3, label: 'Orçamento anual básico' },
          { value: 4, label: 'Orçamento com acompanhamento mensal' },
          { value: 5, label: 'Planejamento estratégico financeiro integrado' },
        ],
      },
      {
        id: 'f5',
        question: 'Existe análise de indicadores financeiros (KPIs)?',
        options: [
          { value: 1, label: 'Não acompanha indicadores' },
          { value: 2, label: 'Apenas faturamento' },
          { value: 3, label: 'Alguns indicadores básicos' },
          { value: 4, label: 'Dashboard com KPIs principais' },
          { value: 5, label: 'BI financeiro com análises avançadas' },
        ],
      },
    ],
  },
  {
    key: 'mercado',
    label: 'Mercado',
    color: 'border-l-[hsl(var(--brand-purple))]',
    bgColor: 'bg-[hsl(var(--brand-purple))]',
    icon: '🎯',
    description: 'Posicionamento, vendas e relacionamento com cliente',
    questions: [
      {
        id: 'm1',
        question: 'A empresa tem clareza sobre seu público-alvo (ICP)?',
        options: [
          { value: 1, label: 'Atende qualquer cliente' },
          { value: 2, label: 'Ideia geral do público' },
          { value: 3, label: 'Público definido informalmente' },
          { value: 4, label: 'ICP documentado com personas' },
          { value: 5, label: 'Segmentação avançada com dados' },
        ],
      },
      {
        id: 'm2',
        question: 'Como é o processo comercial/vendas?',
        options: [
          { value: 1, label: 'Vendas reativas, sem processo' },
          { value: 2, label: 'Processo informal de vendas' },
          { value: 3, label: 'Funil de vendas básico' },
          { value: 4, label: 'CRM implementado com pipeline' },
          { value: 5, label: 'Processo comercial otimizado com métricas' },
        ],
      },
      {
        id: 'm3',
        question: 'Existe estratégia de marketing definida?',
        options: [
          { value: 1, label: 'Não faz marketing' },
          { value: 2, label: 'Ações pontuais sem estratégia' },
          { value: 3, label: 'Presença básica em redes sociais' },
          { value: 4, label: 'Plano de marketing estruturado' },
          { value: 5, label: 'Marketing integrado com métricas de ROI' },
        ],
      },
      {
        id: 'm4',
        question: 'Como é o relacionamento pós-venda com clientes?',
        options: [
          { value: 1, label: 'Não existe pós-venda' },
          { value: 2, label: 'Contato apenas quando há problemas' },
          { value: 3, label: 'Follow-up básico' },
          { value: 4, label: 'Programa de relacionamento estruturado' },
          { value: 5, label: 'Customer Success implementado' },
        ],
      },
      {
        id: 'm5',
        question: 'A empresa monitora a satisfação dos clientes?',
        options: [
          { value: 1, label: 'Não monitora' },
          { value: 2, label: 'Feedback informal ocasional' },
          { value: 3, label: 'Pesquisas pontuais' },
          { value: 4, label: 'NPS ou pesquisa regular' },
          { value: 5, label: 'Sistema completo de voz do cliente' },
        ],
      },
    ],
  },
];

interface AreaAnswers {
  [questionId: string]: number;
}

interface DiagnosticoState {
  [areaKey: string]: {
    answers: AreaAnswers;
    notes: string;
  };
}

export function DiagnosticoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [expandedAreas, setExpandedAreas] = useState<string[]>(['pessoas']);
  const [localState, setLocalState] = useState<DiagnosticoState>(() => {
    const initial: DiagnosticoState = {};
    areasConfig.forEach(area => {
      initial[area.key] = {
        answers: {},
        notes: data.diagnostico[area.key as keyof typeof data.diagnostico]?.notes || '',
      };
    });
    return initial;
  });

  useEffect(() => {
    // Calculate progress based on answered questions
    let totalQuestions = 0;
    let answeredQuestions = 0;

    areasConfig.forEach(area => {
      totalQuestions += area.questions.length;
      answeredQuestions += Object.keys(localState[area.key]?.answers || {}).length;
    });

    const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    updateBlockProgress('diagnostico', progress);

    if (progress === 100) {
      markBlockComplete('diagnostico');
    }

    // Update context data with calculated averages
    const newDiagnostico = { ...data.diagnostico };
    areasConfig.forEach(area => {
      const answers = Object.values(localState[area.key]?.answers || {});
      const avgLevel = answers.length > 0 
        ? Math.round(answers.reduce((a, b) => a + b, 0) / answers.length) 
        : 0;
      newDiagnostico[area.key as keyof typeof newDiagnostico] = {
        area: area.label,
        level: avgLevel,
        notes: localState[area.key]?.notes || '',
      };
    });
    updateData('diagnostico', newDiagnostico);
  }, [localState]);

  const toggleArea = (areaKey: string) => {
    setExpandedAreas(prev => 
      prev.includes(areaKey) 
        ? prev.filter(k => k !== areaKey)
        : [...prev, areaKey]
    );
  };

  const handleAnswerChange = (areaKey: string, questionId: string, value: number) => {
    setLocalState(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        answers: {
          ...prev[areaKey].answers,
          [questionId]: value,
        },
      },
    }));
  };

  const handleNotesChange = (areaKey: string, notes: string) => {
    setLocalState(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        notes,
      },
    }));
  };

  const getAreaAverage = (areaKey: string): string => {
    const answers = Object.values(localState[areaKey]?.answers || {});
    if (answers.length === 0) return '0';
    return (answers.reduce((a, b) => a + b, 0) / answers.length).toFixed(1);
  };

  const getAreaProgress = (areaKey: string) => {
    const area = areasConfig.find(a => a.key === areaKey);
    if (!area) return 0;
    const answered = Object.keys(localState[areaKey]?.answers || {}).length;
    return Math.round((answered / area.questions.length) * 100);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Avalie o nível de maturidade atual da empresa em cada área fundamental de gestão.
        Responda todas as perguntas para obter um diagnóstico completo.
      </p>

      {/* Legend */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Escala de Maturidade</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div>
              <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center mx-auto mb-1 text-sm font-bold">1</div>
              <p className="text-xs">Inicial</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center mx-auto mb-1 text-sm font-bold">2</div>
              <p className="text-xs">Básico</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center mx-auto mb-1 text-sm font-bold">3</div>
              <p className="text-xs">Definido</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center mx-auto mb-1 text-sm font-bold">4</div>
              <p className="text-xs">Gerenciado</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mx-auto mb-1 text-sm font-bold">5</div>
              <p className="text-xs">Otimizado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Areas */}
      <div className="space-y-4">
        {areasConfig.map((area) => {
          const isExpanded = expandedAreas.includes(area.key);
          const progress = getAreaProgress(area.key);
          const average = getAreaAverage(area.key);

          return (
            <Card key={area.key} className={cn("overflow-hidden border-l-4", area.color)}>
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleArea(area.key)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{area.icon}</span>
                    <div>
                      <span>{area.label}</span>
                      <p className="text-sm font-normal text-muted-foreground">{area.description}</p>
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    {progress > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{average}</div>
                        <div className="text-xs text-muted-foreground">{progress}% respondido</div>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-300", area.bgColor)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 space-y-6">
                  {area.questions.map((question, qIndex) => (
                    <div key={question.id} className="space-y-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <p className="font-medium text-sm">
                        {qIndex + 1}. {question.question}
                      </p>
                      <RadioGroup
                        value={localState[area.key]?.answers[question.id]?.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(area.key, question.id, parseInt(value))}
                        className="space-y-2"
                      >
                        {question.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <RadioGroupItem 
                              value={option.value.toString()} 
                              id={`${question.id}-${option.value}`}
                              className="border-muted-foreground"
                            />
                            <Label 
                              htmlFor={`${question.id}-${option.value}`}
                              className="text-sm cursor-pointer flex items-center gap-2"
                            >
                              <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                option.value === 1 && "bg-red-500/20 text-red-600",
                                option.value === 2 && "bg-orange-500/20 text-orange-600",
                                option.value === 3 && "bg-yellow-500/20 text-yellow-600",
                                option.value === 4 && "bg-blue-500/20 text-blue-600",
                                option.value === 5 && "bg-green-500/20 text-green-600",
                              )}>
                                {option.value}
                              </span>
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  {/* Notes */}
                  <div className="pt-2">
                    <Label className="text-sm mb-2 block">Observações sobre {area.label}</Label>
                    <Textarea
                      placeholder={`Adicione observações gerais sobre ${area.label.toLowerCase()}...`}
                      value={localState[area.key]?.notes || ''}
                      onChange={(e) => handleNotesChange(area.key, e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {areasConfig.some(area => getAreaProgress(area.key) > 0) && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Resumo do Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {areasConfig.map((area) => {
                const average = parseFloat(getAreaAverage(area.key));
                const progress = getAreaProgress(area.key);
                return (
                  <div key={area.key} className="text-center p-4 rounded-lg bg-card">
                    <div className="text-2xl mb-2">{area.icon}</div>
                    <div className="text-2xl font-bold text-primary">
                      {average > 0 ? average.toFixed(1) : '-'}
                    </div>
                    <div className="text-sm font-medium">{area.label}</div>
                    <div className="text-xs text-muted-foreground">{progress}% respondido</div>
                  </div>
                );
              })}
            </div>

            {/* Overall Average */}
            {areasConfig.every(area => getAreaProgress(area.key) === 100) && (
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">Média Geral de Maturidade</p>
                <div className="text-4xl font-bold text-gradient">
                  {(areasConfig.reduce((acc, area) => acc + parseFloat(getAreaAverage(area.key)), 0) / areasConfig.length).toFixed(1)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
