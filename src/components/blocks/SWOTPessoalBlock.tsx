import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelpTooltip } from '@/components/HelpTooltip';
import { AISuggestionLoader } from '@/components/AISuggestionLoader';
import { useAISuggestions } from '@/hooks/useAISuggestions';

const swotConfig = [
  { key: 'forcas', label: 'Forças Pessoais', icon: '💪', color: 'bg-green-500', description: 'Suas habilidades naturais, conhecimentos e talentos.', examples: 'Ex: Visão estratégica, Networking, Comunicação, Resiliência, Conhecimento técnico' },
  { key: 'fraquezas', label: 'Pontos de Melhoria', icon: '🎯', color: 'bg-red-500', description: 'Áreas que você precisa desenvolver ou buscar apoio.', examples: 'Ex: Delegação, Gestão financeira, Paciência, Organização, Gestão de conflitos' },
  { key: 'oportunidades', label: 'Oportunidades', icon: '🚀', color: 'bg-blue-500', description: 'Formas de se desenvolver e crescer profissionalmente.', examples: 'Ex: Mentoria, MBA, Networking em eventos, Coaching, Novos projetos' },
  { key: 'ameacas', label: 'Desafios', icon: '⚠️', color: 'bg-orange-500', description: 'Obstáculos que podem atrapalhar seu desenvolvimento.', examples: 'Ex: Burnout, Síndrome do impostor, Falta de tempo, Isolamento' },
] as const;

type SwotPessoalKey = 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas';

interface SwotPessoalSuggestions {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

export function SWOTPessoalBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.swotPessoal);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { 
    suggestions: aiSuggestions, 
    isLoading, 
    error, 
    refresh 
  } = useAISuggestions('swotPessoal', currentProject);

  const suggestions = aiSuggestions as unknown as SwotPessoalSuggestions | null;

  useEffect(() => {
    const hasForcas = localData.forcas.length > 0 ? 1 : 0;
    const hasFraquezas = localData.fraquezas.length > 0 ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const hasAmeacas = localData.ameacas.length > 0 ? 1 : 0;
    const progress = Math.round(((hasForcas + hasFraquezas + hasOportunidades + hasAmeacas) / 4) * 100);
    updateBlockProgress('swotPessoal', progress);
    
    if (progress === 100) {
      markBlockComplete('swotPessoal');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addItem = (key: string) => {
    const item = newItems[key];
    if (item?.trim()) {
      const newData = { ...localData, [key]: [...localData[key as SwotPessoalKey], item.trim()] };
      setLocalData(newData);
      updateData('swotPessoal', newData);
      setNewItems({ ...newItems, [key]: '' });
    }
  };

  const removeItem = (key: string, index: number) => {
    const newData = { 
      ...localData, 
      [key]: localData[key as SwotPessoalKey].filter((_, i) => i !== index) 
    };
    setLocalData(newData);
    updateData('swotPessoal', newData);
  };

  const handleAcceptSuggestion = (key: SwotPessoalKey, value: string | string[]) => {
    const newData = { ...localData, [key]: value as string[] };
    setLocalData(newData);
    updateData('swotPessoal', newData);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: SwotPessoalKey) => {
    return localData[field].length === 0 && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Realize uma análise SWOT pessoal do líder/CEO para identificar pontos de desenvolvimento e fortalecimento.
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

      {/* Personal Profile Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Análise Pessoal do Líder</h3>
              <p className="text-sm text-muted-foreground">
                Autoconhecimento é a base para o desenvolvimento de uma liderança eficaz
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SWOT Matrix */}
      <div className="grid md:grid-cols-2 gap-4">
        {swotConfig.map((item) => (
          <Card key={item.key} className="overflow-hidden">
            <div className={cn("h-1", item.color)} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
                <HelpTooltip fieldKey={item.key} blockId="swotPessoal" />
              </CardTitle>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground/70 italic">{item.examples}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder={`Adicionar ${item.label.toLowerCase()}...`}
                  value={newItems[item.key] || ''}
                  onChange={(e) => setNewItems({ ...newItems, [item.key]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(item.key)}
                  className="text-sm"
                />
                <Button onClick={() => addItem(item.key)} size="icon" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {localData[item.key as SwotPessoalKey].length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {localData[item.key as SwotPessoalKey].map((swotItem, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                      {swotItem}
                      <button onClick={() => removeItem(item.key, index)} className="ml-1.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {showSuggestion(item.key as SwotPessoalKey) && (
                <AISuggestionLoader
                  isLoading={isLoading}
                  error={error}
                  suggestion={suggestions?.[item.key as SwotPessoalKey]}
                  fieldKey={item.key}
                  label={`Sugestão de ${item.label.toLowerCase()}`}
                  onAccept={(value) => handleAcceptSuggestion(item.key as SwotPessoalKey, value)}
                  onDismiss={() => handleDismissSuggestion(item.key)}
                  onRetry={refresh}
                  currentValue={localData[item.key as SwotPessoalKey]}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      {(localData.forcas.length > 0 || localData.fraquezas.length > 0) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Insights de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {localData.forcas.length > 0 && localData.oportunidades.length > 0 && (
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm font-medium text-green-600 mb-1">Alavancagem (Forças + Oportunidades)</p>
                <p className="text-sm text-muted-foreground">
                  Use suas forças ({localData.forcas.slice(0, 2).join(', ')}) para aproveitar as oportunidades identificadas.
                </p>
              </div>
            )}
            {localData.fraquezas.length > 0 && (
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <p className="text-sm font-medium text-orange-600 mb-1">Foco de Desenvolvimento</p>
                <p className="text-sm text-muted-foreground">
                  Priorize o desenvolvimento em: {localData.fraquezas.slice(0, 2).join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
