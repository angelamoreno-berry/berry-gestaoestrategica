import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, RefreshCw } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';
import { AISuggestionLoader } from '@/components/AISuggestionLoader';
import { useAISuggestions } from '@/hooks/useAISuggestions';

interface ConcorrentesSuggestions {
  concorrentes: Array<{ nome: string; pontoForte: string; pontoFraco: string }>;
  diferenciais: string[];
  publicoAlvo: string;
  propostaValor: string;
}

export function ConcorrentesBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.concorrentes);
  const [newDiferencial, setNewDiferencial] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { 
    suggestions: aiSuggestions, 
    isLoading, 
    error, 
    refresh 
  } = useAISuggestions('concorrentes', currentProject);

  const suggestions = aiSuggestions as unknown as ConcorrentesSuggestions | null;

  useEffect(() => {
    const hasConcorrentes = localData.concorrentes.length > 0 ? 1 : 0;
    const hasDiferenciais = localData.diferenciais.length > 0 ? 1 : 0;
    const hasPublico = localData.publicoAlvo.trim().length > 0 ? 1 : 0;
    const hasProposta = localData.propostaValor.trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasConcorrentes + hasDiferenciais + hasPublico + hasProposta) / 4) * 100);
    updateBlockProgress('concorrentes', progress);
    
    if (progress === 100) {
      markBlockComplete('concorrentes');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addConcorrente = () => {
    const newConcorrente = { nome: '', pontoForte: '', pontoFraco: '' };
    const newData = { ...localData, concorrentes: [...localData.concorrentes, newConcorrente] };
    setLocalData(newData);
    updateData('concorrentes', newData);
  };

  const updateConcorrente = (index: number, field: string, value: string) => {
    const newConcorrentes = [...localData.concorrentes];
    newConcorrentes[index] = { ...newConcorrentes[index], [field]: value };
    const newData = { ...localData, concorrentes: newConcorrentes };
    setLocalData(newData);
    updateData('concorrentes', newData);
  };

  const removeConcorrente = (index: number) => {
    const newConcorrentes = localData.concorrentes.filter((_, i) => i !== index);
    const newData = { ...localData, concorrentes: newConcorrentes };
    setLocalData(newData);
    updateData('concorrentes', newData);
  };

  const addDiferencial = () => {
    if (newDiferencial.trim()) {
      const newData = { ...localData, diferenciais: [...localData.diferenciais, newDiferencial.trim()] };
      setLocalData(newData);
      updateData('concorrentes', newData);
      setNewDiferencial('');
    }
  };

  const removeDiferencial = (index: number) => {
    const newDiferenciais = localData.diferenciais.filter((_, i) => i !== index);
    const newData = { ...localData, diferenciais: newDiferenciais };
    setLocalData(newData);
    updateData('concorrentes', newData);
  };

  const handleChange = (field: string, value: string | string[] | Array<{ nome: string; pontoForte: string; pontoFraco: string }>) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('concorrentes', newData);
  };

  const handleAcceptSuggestion = (field: keyof ConcorrentesSuggestions, value: string | string[] | Array<{ nome: string; pontoForte: string; pontoFraco: string }>) => {
    handleChange(field, value);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: string, value: string | string[] | Array<{ nome: string; pontoForte: string; pontoFraco: string }>) => {
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value.trim();
    return isEmpty && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Mapeie o cenário competitivo, identifique seus diferenciais e defina claramente seu público e proposta de valor.
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

      {/* Concorrentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              Principais Concorrentes
              <HelpTooltip blockId="concorrentes" fieldKey="concorrentes" />
            </span>
            <Button onClick={addConcorrente} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.concorrentes.map((concorrente, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Nome do concorrente"
                  value={concorrente.nome}
                  onChange={(e) => updateConcorrente(index, 'nome', e.target.value)}
                  className="font-medium"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeConcorrente(index)}
                  className="ml-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ponto Forte</label>
                  <Input
                    placeholder="O que fazem bem?"
                    value={concorrente.pontoForte}
                    onChange={(e) => updateConcorrente(index, 'pontoForte', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ponto Fraco</label>
                  <Input
                    placeholder="Onde falham?"
                    value={concorrente.pontoFraco}
                    onChange={(e) => updateConcorrente(index, 'pontoFraco', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          {localData.concorrentes.length === 0 && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground py-4">
                Clique em "Adicionar" para mapear seus concorrentes
              </p>
              {showSuggestion('concorrentes', localData.concorrentes) && suggestions?.concorrentes && (
                <AISuggestionLoader
                  isLoading={isLoading}
                  error={error}
                  suggestion={suggestions.concorrentes.map(c => `${c.nome} (Forte: ${c.pontoForte}, Fraco: ${c.pontoFraco})`)}
                  fieldKey="concorrentes"
                  label="Sugestão de concorrentes"
                  onAccept={() => handleAcceptSuggestion('concorrentes', suggestions.concorrentes)}
                  onDismiss={() => handleDismissSuggestion('concorrentes')}
                  onRetry={refresh}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diferenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            Seus Diferenciais
            <HelpTooltip blockId="concorrentes" fieldKey="diferenciais" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            O que torna sua empresa única no mercado?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite um diferencial..."
              value={newDiferencial}
              onChange={(e) => setNewDiferencial(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDiferencial()}
            />
            <Button onClick={addDiferencial} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.diferenciais.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.diferenciais.map((diferencial, index) => (
                <Badge key={index} className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20">
                  {diferencial}
                  <button
                    onClick={() => removeDiferencial(index)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {showSuggestion('diferenciais', localData.diferenciais) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.diferenciais}
              fieldKey="diferenciais"
              label="Sugestão de diferenciais"
              onAccept={(value) => handleAcceptSuggestion('diferenciais', value)}
              onDismiss={() => handleDismissSuggestion('diferenciais')}
              onRetry={refresh}
              currentValue={localData.diferenciais}
            />
          )}
        </CardContent>
      </Card>

      {/* Público Alvo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Público-Alvo
            <HelpTooltip blockId="concorrentes" fieldKey="publicoAlvo" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Descreva seu público-alvo ideal: quem são, onde estão, o que fazem..."
            value={localData.publicoAlvo}
            onChange={(e) => handleChange('publicoAlvo', e.target.value)}
            className="resize-none"
            rows={3}
          />
          {showSuggestion('publicoAlvo', localData.publicoAlvo) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.publicoAlvo}
              fieldKey="publicoAlvo"
              label="Sugestão de público-alvo"
              onAccept={(value) => handleAcceptSuggestion('publicoAlvo', value)}
              onDismiss={() => handleDismissSuggestion('publicoAlvo')}
              onRetry={refresh}
              currentValue={localData.publicoAlvo}
            />
          )}
        </CardContent>
      </Card>

      {/* Proposta de Valor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Proposta de Valor
            <HelpTooltip blockId="concorrentes" fieldKey="propostaValor" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            O que você oferece que resolve o problema do seu cliente de forma única?
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Ex: Ajudamos pequenas empresas a triplicar seu faturamento em 12 meses através de..."
            value={localData.propostaValor}
            onChange={(e) => handleChange('propostaValor', e.target.value)}
            className="resize-none"
            rows={4}
          />
          {showSuggestion('propostaValor', localData.propostaValor) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.propostaValor}
              fieldKey="propostaValor"
              label="Sugestão de proposta de valor"
              onAccept={(value) => handleAcceptSuggestion('propostaValor', value)}
              onDismiss={() => handleDismissSuggestion('propostaValor')}
              onRetry={refresh}
              currentValue={localData.propostaValor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
