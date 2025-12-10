import { useState, useEffect, useMemo } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelpTooltip } from '@/components/HelpTooltip';
import { SuggestionCard } from '@/components/SuggestionCard';
import { generateSuggestions } from '@/utils/suggestionsGenerator';

const swotConfig = [
  { key: 'forcas', label: 'Forças', icon: '💪', color: 'bg-green-500', description: 'Vantagens internas: equipe, produto, marca, localização, tecnologia, processos.', examples: 'Ex: Equipe experiente, Produto único, Boa reputação' },
  { key: 'fraquezas', label: 'Fraquezas', icon: '⚠️', color: 'bg-red-500', description: 'Limitações internas: falta de recursos, dependências, gaps de conhecimento.', examples: 'Ex: Caixa limitado, Marca desconhecida, Processos manuais' },
  { key: 'oportunidades', label: 'Oportunidades', icon: '🚀', color: 'bg-blue-500', description: 'Fatores externos favoráveis: tendências, mercados novos, regulação.', examples: 'Ex: Digitalização do setor, Expansão regional, Novos nichos' },
  { key: 'ameacas', label: 'Ameaças', icon: '⛈️', color: 'bg-orange-500', description: 'Fatores externos negativos: concorrência, crise, regulação, mudanças.', examples: 'Ex: Novos concorrentes, Recessão, Mudança de hábitos' },
] as const;

type SwotKey = 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas';

export function SWOTBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.swot);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const suggestions = useMemo(() => {
    if (!currentProject) return null;
    return generateSuggestions(currentProject).swot;
  }, [currentProject]);

  useEffect(() => {
    const hasForcas = localData.forcas.length > 0 ? 1 : 0;
    const hasFraquezas = localData.fraquezas.length > 0 ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const hasAmeacas = localData.ameacas.length > 0 ? 1 : 0;
    const hasHorizontes = (localData.horizontes.curto || localData.horizontes.medio || localData.horizontes.longo) ? 1 : 0;
    const progress = Math.round(((hasForcas + hasFraquezas + hasOportunidades + hasAmeacas + hasHorizontes) / 5) * 100);
    updateBlockProgress('swot', progress);
    
    if (progress === 100) {
      markBlockComplete('swot');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addItem = (key: string) => {
    const item = newItems[key];
    if (item?.trim()) {
      const newData = { ...localData, [key]: [...localData[key as SwotKey], item.trim()] };
      setLocalData(newData);
      updateData('swot', newData);
      setNewItems({ ...newItems, [key]: '' });
    }
  };

  const removeItem = (key: string, index: number) => {
    const newData = { 
      ...localData, 
      [key]: (localData[key as SwotKey] as string[]).filter((_, i) => i !== index) 
    };
    setLocalData(newData);
    updateData('swot', newData);
  };

  const handleHorizonteChange = (key: string, value: string) => {
    const newData = { ...localData, horizontes: { ...localData.horizontes, [key]: value } };
    setLocalData(newData);
    updateData('swot', newData);
  };

  const handleAcceptSuggestion = (key: SwotKey, value: string | string[]) => {
    const newData = { ...localData, [key]: value as string[] };
    setLocalData(newData);
    updateData('swot', newData);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: SwotKey) => {
    return suggestions && localData[field].length === 0 && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Realize uma análise SWOT completa e defina os horizontes de planejamento estratégico.
      </p>

      {/* SWOT Matrix */}
      <div className="grid md:grid-cols-2 gap-4">
        {swotConfig.map((item) => (
          <Card key={item.key} className="overflow-hidden">
            <div className={cn("h-1", item.color)} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
                <HelpTooltip fieldKey={item.key} blockId="swot" />
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
              
              {(localData[item.key as SwotKey] as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(localData[item.key as SwotKey] as string[]).map((swotItem, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                      {swotItem}
                      <button onClick={() => removeItem(item.key, index)} className="ml-1.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {showSuggestion(item.key as SwotKey) && (
                <SuggestionCard
                  suggestion={suggestions![item.key as SwotKey]}
                  label={`Sugestão de ${item.label.toLowerCase()}`}
                  onAccept={(value) => handleAcceptSuggestion(item.key as SwotKey, value)}
                  onDismiss={() => handleDismissSuggestion(item.key)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Horizontes de Planejamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🗓️</span>
            Horizontes de Planejamento
            <HelpTooltip fieldKey="horizontes" blockId="swot" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Defina metas SMART para cada horizonte. Use a matriz SWOT para informar suas prioridades.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Curto Prazo (3-6 meses)
              </label>
              <Textarea
                placeholder="Ex: Validar novo canal de vendas, contratar 2 pessoas, aumentar ticket médio em 20%..."
                value={localData.horizontes.curto}
                onChange={(e) => handleHorizonteChange('curto', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                Médio Prazo (6-12 meses)
              </label>
              <Textarea
                placeholder="Ex: Lançar novo produto, expandir para nova região, atingir break-even, dobrar faturamento..."
                value={localData.horizontes.medio}
                onChange={(e) => handleHorizonteChange('medio', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Longo Prazo (1-3 anos)
              </label>
              <Textarea
                placeholder="Ex: Ser líder regional, faturar R$X milhões, abrir franquias, captar investimento..."
                value={localData.horizontes.longo}
                onChange={(e) => handleHorizonteChange('longo', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
