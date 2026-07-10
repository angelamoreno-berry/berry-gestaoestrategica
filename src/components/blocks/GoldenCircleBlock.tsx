import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { HelpTooltip } from '@/components/HelpTooltip';
import { AISuggestionLoader } from '@/components/AISuggestionLoader';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GoldenCircleSuggestions {
  why: string;
  how: string;
  what: string;
}

export function GoldenCircleBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.goldenCircle);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { 
    suggestions: aiSuggestions, 
    isLoading, 
    error, 
    refresh 
  } = useAISuggestions('goldenCircle', currentProject);

  const suggestions = aiSuggestions as unknown as GoldenCircleSuggestions | null;

  useEffect(() => {
    const hasWhy = String(localData.why ?? '').trim().length > 0 ? 1 : 0;
    const hasHow = String(localData.how ?? '').trim().length > 0 ? 1 : 0;
    const hasWhat = String(localData.what ?? '').trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasWhy + hasHow + hasWhat) / 3) * 100);
    updateBlockProgress('goldenCircle', progress);
    
    if (progress === 100) {
      markBlockComplete('goldenCircle');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('goldenCircle', newData);
  };

  const handleAcceptSuggestion = (field: 'why' | 'how' | 'what', value: string | string[]) => {
    handleChange(field, value as string);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: string, value: string) => {
    return !String(value ?? '').trim() && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Baseado no conceito de Simon Sinek, defina o propósito profundo da empresa começando pelo "porquê".
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Gerar novas sugestões
        </Button>
      </div>

      {/* Golden Circle Visualization */}
      <div className="flex justify-center py-8">
        <div className="relative">
          {/* Por Quê - Círculo Interno */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary flex items-center justify-center z-30 shadow-strong">
            <span className="text-xl font-bold text-primary-foreground">POR QUÊ</span>
          </div>
          
          {/* Como - Círculo do Meio */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-primary/30 flex items-start justify-center pt-4 z-20">
            <span className="text-lg font-semibold text-foreground">COMO</span>
          </div>
          
          {/* O Quê - Círculo Externo */}
          <div className="w-80 h-80 rounded-full bg-primary/10 flex items-start justify-center pt-4 z-10">
            <span className="text-lg font-semibold text-foreground">O QUÊ</span>
          </div>
        </div>
      </div>

      {/* Input Cards */}
      <div className="space-y-4">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              POR QUÊ - Por que existimos?
              <HelpTooltip fieldKey="why" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Seu propósito vai além do lucro. O que te fez começar? Que impacto quer causar? Ex: Apple = "Desafiar o status quo"
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Acreditamos que toda pequena empresa merece acesso a ferramentas de gestão profissionais. Existimos para democratizar a gestão de qualidade e ajudar empreendedores a realizarem seu potencial..."
              value={localData.why}
              onChange={(e) => handleChange('why', e.target.value)}
              className="resize-none"
              rows={4}
            />
            {showSuggestion('why', localData.why) && (
              <AISuggestionLoader
                isLoading={isLoading}
                error={error}
                suggestion={suggestions?.why}
                fieldKey="why"
                label="Sugestão de propósito"
                onAccept={(value) => handleAcceptSuggestion('why', value)}
                onDismiss={() => handleDismissSuggestion('why')}
                onRetry={refresh}
                currentValue={localData.why}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold">
                2
              </div>
              COMO - Como fazemos?
              <HelpTooltip fieldKey="how" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sua forma única de entregar valor. Metodologia, processos ou valores que te diferenciam.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Através de uma metodologia prática de 90 dias com sprints semanais, ferramentas exclusivas, mentoria personalizada e foco obsessivo em resultados mensuráveis..."
              value={localData.how}
              onChange={(e) => handleChange('how', e.target.value)}
              className="resize-none"
              rows={4}
            />
            {showSuggestion('how', localData.how) && (
              <AISuggestionLoader
                isLoading={isLoading}
                error={error}
                suggestion={suggestions?.how}
                fieldKey="how"
                label="Sugestão de metodologia"
                onAccept={(value) => handleAcceptSuggestion('how', value)}
                onDismiss={() => handleDismissSuggestion('how')}
                onRetry={refresh}
                currentValue={localData.how}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                3
              </div>
              O QUÊ - O que entregamos?
              <HelpTooltip fieldKey="what" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Produtos e serviços concretos. O que o cliente leva para casa?
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Consultoria em gestão empresarial, treinamentos para líderes, diagnósticos de maturidade, ferramentas de planejamento estratégico e acompanhamento mensal de resultados..."
              value={localData.what}
              onChange={(e) => handleChange('what', e.target.value)}
              className="resize-none"
              rows={4}
            />
            {showSuggestion('what', localData.what) && (
              <AISuggestionLoader
                isLoading={isLoading}
                error={error}
                suggestion={suggestions?.what}
                fieldKey="what"
                label="Sugestão de entregas"
                onAccept={(value) => handleAcceptSuggestion('what', value)}
                onDismiss={() => handleDismissSuggestion('what')}
                onRetry={refresh}
                currentValue={localData.what}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Preview */}
      {(localData.why || localData.how || localData.what) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Golden Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {localData.why && (
              <div>
                <p className="text-xs font-medium text-primary mb-1">POR QUÊ</p>
                <p className="text-sm">{localData.why}</p>
              </div>
            )}
            {localData.how && (
              <div>
                <p className="text-xs font-medium text-primary/70 mb-1">COMO</p>
                <p className="text-sm">{localData.how}</p>
              </div>
            )}
            {localData.what && (
              <div>
                <p className="text-xs font-medium text-primary/50 mb-1">O QUÊ</p>
                <p className="text-sm">{localData.what}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
