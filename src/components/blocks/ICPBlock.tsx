import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, RefreshCw } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';
import { AISuggestionLoader } from '@/components/AISuggestionLoader';
import { useAISuggestions } from '@/hooks/useAISuggestions';

interface ICPSuggestions {
  caracteristicasDemograficas: string;
  descricao?: string;
  segmentos?: string[];
  dores: string[];
  desejos: string[];
  necessidades?: string[];
  comportamento: string;
  ondeEncontrar: string;
}

export function ICPBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.icp);
  const [newDor, setNewDor] = useState('');
  const [newDesejo, setNewDesejo] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { 
    suggestions: aiSuggestions, 
    isLoading, 
    error, 
    refresh 
  } = useAISuggestions('icp', currentProject);

  const suggestions = aiSuggestions as unknown as ICPSuggestions | null;

  useEffect(() => {
    const hasCaracteristicas = String(localData.caracteristicasDemograficas ?? '').trim().length > 0 ? 1 : 0;
    const hasDores = localData.dores.length > 0 ? 1 : 0;
    const hasDesejos = localData.desejos.length > 0 ? 1 : 0;
    const hasComportamento = localData.comportamento.trim().length > 0 ? 1 : 0;
    const hasOnde = localData.ondeEncontrar.trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasCaracteristicas + hasDores + hasDesejos + hasComportamento + hasOnde) / 5) * 100);
    updateBlockProgress('icp', progress);
    
    if (progress === 100) {
      markBlockComplete('icp');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('icp', newData);
  };

  const addDor = () => {
    if (newDor.trim()) {
      handleChange('dores', [...localData.dores, newDor.trim()]);
      setNewDor('');
    }
  };

  const removeDor = (index: number) => {
    handleChange('dores', localData.dores.filter((_, i) => i !== index));
  };

  const addDesejo = () => {
    if (newDesejo.trim()) {
      handleChange('desejos', [...localData.desejos, newDesejo.trim()]);
      setNewDesejo('');
    }
  };

  const removeDesejo = (index: number) => {
    handleChange('desejos', localData.desejos.filter((_, i) => i !== index));
  };

  const handleAcceptSuggestion = (field: keyof ICPSuggestions, value: string | string[]) => {
    handleChange(field, value);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  const showSuggestion = (field: string, value: string | string[]) => {
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value.trim();
    return isEmpty && !dismissedSuggestions[field];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Defina o Perfil de Cliente Ideal (ICP) para direcionar suas estratégias de marketing e vendas com precisão.
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

      {/* Avatar Visual */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Seu Cliente Ideal</h3>
              <p className="text-sm text-muted-foreground">
                Quanto mais detalhado, melhor será sua comunicação
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características Demográficas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Características Demográficas
            <HelpTooltip blockId="icp" fieldKey="caracteristicasDemograficas" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Idade, gênero, localização, renda, profissão, segmento de empresa...
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Ex: Empresários entre 30-50 anos, donos de pequenas empresas de serviços com faturamento entre R$50k-500k/mês, localizados em grandes centros urbanos..."
            value={localData.caracteristicasDemograficas}
            onChange={(e) => handleChange('caracteristicasDemograficas', e.target.value)}
            className="resize-none"
            rows={4}
          />
          {showSuggestion('caracteristicasDemograficas', localData.caracteristicasDemograficas) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.caracteristicasDemograficas}
              fieldKey="caracteristicasDemograficas"
              label="Sugestão de perfil demográfico"
              onAccept={(value) => handleAcceptSuggestion('caracteristicasDemograficas', value)}
              onDismiss={() => handleDismissSuggestion('caracteristicasDemograficas')}
              onRetry={refresh}
              currentValue={localData.caracteristicasDemograficas}
            />
          )}
        </CardContent>
      </Card>

      {/* Dores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">😰</span>
            Dores e Problemas
            <HelpTooltip blockId="icp" fieldKey="dores" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quais são os maiores desafios e frustrações do seu cliente ideal?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma dor do cliente..."
              value={newDor}
              onChange={(e) => setNewDor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDor()}
            />
            <Button onClick={addDor} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.dores.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.dores.map((dor, index) => (
                <Badge key={index} variant="destructive" className="px-3 py-1.5 text-sm">
                  {dor}
                  <button onClick={() => removeDor(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {showSuggestion('dores', localData.dores) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.dores}
              fieldKey="dores"
              label="Sugestão de dores do cliente"
              onAccept={(value) => handleAcceptSuggestion('dores', value)}
              onDismiss={() => handleDismissSuggestion('dores')}
              onRetry={refresh}
              currentValue={localData.dores}
            />
          )}
        </CardContent>
      </Card>

      {/* Desejos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Desejos e Aspirações
            <HelpTooltip blockId="icp" fieldKey="desejos" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            O que seu cliente ideal quer conquistar? Quais são seus sonhos?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite um desejo do cliente..."
              value={newDesejo}
              onChange={(e) => setNewDesejo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDesejo()}
            />
            <Button onClick={addDesejo} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.desejos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.desejos.map((desejo, index) => (
                <Badge key={index} className="px-3 py-1.5 text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  {desejo}
                  <button onClick={() => removeDesejo(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {showSuggestion('desejos', localData.desejos) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.desejos}
              fieldKey="desejos"
              label="Sugestão de desejos do cliente"
              onAccept={(value) => handleAcceptSuggestion('desejos', value)}
              onDismiss={() => handleDismissSuggestion('desejos')}
              onRetry={refresh}
              currentValue={localData.desejos}
            />
          )}
        </CardContent>
      </Card>

      {/* Comportamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Comportamento de Compra
            <HelpTooltip blockId="icp" fieldKey="comportamento" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como ele toma decisões? O que influencia suas escolhas?
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Ex: Pesquisa bastante antes de comprar, valoriza indicações, busca provas de resultado, sensível a preço mas paga por qualidade..."
            value={localData.comportamento}
            onChange={(e) => handleChange('comportamento', e.target.value)}
            className="resize-none"
            rows={3}
          />
          {showSuggestion('comportamento', localData.comportamento) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.comportamento}
              fieldKey="comportamento"
              label="Sugestão de comportamento"
              onAccept={(value) => handleAcceptSuggestion('comportamento', value)}
              onDismiss={() => handleDismissSuggestion('comportamento')}
              onRetry={refresh}
              currentValue={localData.comportamento}
            />
          )}
        </CardContent>
      </Card>

      {/* Onde Encontrar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Onde Encontrar
            <HelpTooltip blockId="icp" fieldKey="ondeEncontrar" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quais canais, redes sociais, eventos ou lugares seu cliente frequenta?
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Ex: LinkedIn, eventos de negócios, associações comerciais, Instagram profissional, podcasts de empreendedorismo..."
            value={localData.ondeEncontrar}
            onChange={(e) => handleChange('ondeEncontrar', e.target.value)}
            className="resize-none"
            rows={3}
          />
          {showSuggestion('ondeEncontrar', localData.ondeEncontrar) && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.ondeEncontrar}
              fieldKey="ondeEncontrar"
              label="Sugestão de onde encontrar"
              onAccept={(value) => handleAcceptSuggestion('ondeEncontrar', value)}
              onDismiss={() => handleDismissSuggestion('ondeEncontrar')}
              onRetry={refresh}
              currentValue={localData.ondeEncontrar}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
