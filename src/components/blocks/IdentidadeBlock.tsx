import { useState, useEffect, useMemo } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';
import { SuggestionCard } from '@/components/SuggestionCard';
import { generateSuggestions } from '@/utils/suggestionsGenerator';

export function IdentidadeBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.identidade);
  const [newValor, setNewValor] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const suggestions = useMemo(() => {
    if (!currentProject) return null;
    return generateSuggestions(currentProject).identidade;
  }, [currentProject]);

  useEffect(() => {
    const fields = [localData.visao, localData.missao, localData.posicionamento];
    const filledFields = fields.filter(f => f.trim().length > 0).length;
    const hasValores = localData.valores.length > 0 ? 1 : 0;
    const progress = Math.round(((filledFields + hasValores) / 4) * 100);
    updateBlockProgress('identidade', progress);
    
    if (progress === 100) {
      markBlockComplete('identidade');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: keyof typeof localData, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('identidade', newData);
  };

  const addValor = () => {
    if (newValor.trim()) {
      const newValores = [...localData.valores, newValor.trim()];
      handleChange('valores', newValores);
      setNewValor('');
    }
  };

  const removeValor = (index: number) => {
    const newValores = localData.valores.filter((_, i) => i !== index);
    handleChange('valores', newValores);
  };

  const handleAcceptSuggestion = (field: 'visao' | 'missao' | 'posicionamento' | 'valores') => {
    if (suggestions) {
      handleChange(field, suggestions[field]);
    }
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: string, value: string | string[]) => {
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value.trim();
    return suggestions && isEmpty && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina ou ajuste os pilares fundamentais que guiarão todas as decisões estratégicas da empresa.
      </p>

      <div className="grid gap-6">
        {/* Visão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔭</span>
              Visão
              <HelpTooltip blockId="identidade" fieldKey="visao" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Onde a empresa quer chegar? Qual é o sonho grande a ser alcançado?
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Ser a maior referência em consultoria de gestão para pequenas empresas no Brasil até 2030..."
              value={localData.visao}
              onChange={(e) => handleChange('visao', e.target.value)}
              className="resize-none"
              rows={3}
            />
            {showSuggestion('visao', localData.visao) && (
              <SuggestionCard
                suggestion={suggestions!.visao}
                label="Sugestão de visão"
                onAccept={() => handleAcceptSuggestion('visao')}
                onDismiss={() => handleDismissSuggestion('visao')}
              />
            )}
          </CardContent>
        </Card>

        {/* Missão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Missão
              <HelpTooltip blockId="identidade" fieldKey="missao" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Qual é o propósito da empresa? Por que ela existe?
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Transformar a gestão de pequenas empresas através de metodologias práticas e resultados mensuráveis..."
              value={localData.missao}
              onChange={(e) => handleChange('missao', e.target.value)}
              className="resize-none"
              rows={3}
            />
            {showSuggestion('missao', localData.missao) && (
              <SuggestionCard
                suggestion={suggestions!.missao}
                label="Sugestão de missão"
                onAccept={() => handleAcceptSuggestion('missao')}
                onDismiss={() => handleDismissSuggestion('missao')}
              />
            )}
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              Valores
              <HelpTooltip blockId="identidade" fieldKey="valores" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quais são os princípios inegociáveis que guiam as ações da empresa?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite um valor..."
                value={newValor}
                onChange={(e) => setNewValor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addValor()}
              />
              <Button onClick={addValor} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {localData.valores.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {localData.valores.map((valor, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    {valor}
                    <button
                      onClick={() => removeValor(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {showSuggestion('valores', localData.valores) && (
              <SuggestionCard
                suggestion={suggestions!.valores}
                label="Sugestão de valores"
                onAccept={() => handleAcceptSuggestion('valores')}
                onDismiss={() => handleDismissSuggestion('valores')}
              />
            )}
          </CardContent>
        </Card>

        {/* Posicionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Posicionamento
              <HelpTooltip blockId="identidade" fieldKey="posicionamento" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Como a empresa quer ser percebida pelo mercado?
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ex: Somos a consultoria que entrega resultado real, com metodologia prática e acompanhamento próximo..."
              value={localData.posicionamento}
              onChange={(e) => handleChange('posicionamento', e.target.value)}
              className="resize-none"
              rows={3}
            />
            {showSuggestion('posicionamento', localData.posicionamento) && (
              <SuggestionCard
                suggestion={suggestions!.posicionamento}
                label="Sugestão de posicionamento"
                onAccept={() => handleAcceptSuggestion('posicionamento')}
                onDismiss={() => handleDismissSuggestion('posicionamento')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
