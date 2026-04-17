import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, RefreshCw } from 'lucide-react';
import { HelpTooltip } from '@/components-v2/HelpTooltip';
import { AISuggestionLoader } from '@/components-v2/AISuggestionLoader';
import { useAISuggestions } from '@/hooks-v2/useAISuggestions';

interface EstrategiasValorSuggestions {
  novasOfertas: string[];
  novosServicos: string[];
  pacotes?: Array<{ nome: string; descricao: string; preco: string }>;
}

export function EstrategiasValorBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.estrategiasValor);
  const [newOferta, setNewOferta] = useState('');
  const [newServico, setNewServico] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { 
    suggestions: aiSuggestions, 
    isLoading, 
    error, 
    refresh 
  } = useAISuggestions('estrategiasValor', currentProject);

  const suggestions = aiSuggestions as unknown as EstrategiasValorSuggestions | null;

  useEffect(() => {
    const hasOfertas = localData.novasOfertas.length > 0 ? 1 : 0;
    const hasServicos = localData.novosServicos.length > 0 ? 1 : 0;
    const progress = Math.round(((hasOfertas + hasServicos) / 2) * 100);
    updateBlockProgress('estrategiasValor', progress);
    
    if (progress === 100) {
      markBlockComplete('estrategiasValor');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addOferta = () => {
    if (newOferta.trim()) {
      const newData = { ...localData, novasOfertas: [...localData.novasOfertas, newOferta.trim()] };
      setLocalData(newData);
      updateData('estrategiasValor', newData);
      setNewOferta('');
    }
  };

  const removeOferta = (index: number) => {
    const newData = { ...localData, novasOfertas: localData.novasOfertas.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const addServico = () => {
    if (newServico.trim()) {
      const newData = { ...localData, novosServicos: [...localData.novosServicos, newServico.trim()] };
      setLocalData(newData);
      updateData('estrategiasValor', newData);
      setNewServico('');
    }
  };

  const removeServico = (index: number) => {
    const newData = { ...localData, novosServicos: localData.novosServicos.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const handleAcceptSuggestion = (field: 'novasOfertas' | 'novosServicos', value: string | string[]) => {
    const newData = { ...localData, [field]: value as string[] };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const handleDismissSuggestion = (field: string) => {
    setDismissedSuggestions(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Identifique oportunidades para agregar valor ao negócio através de novas ofertas, serviços e pacotes estratégicos.
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

      {/* Novas Ofertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            Novas Ofertas
            <HelpTooltip fieldKey="novasOfertas" blockId="estrategiasValor" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Produtos ou serviços adicionais que podem gerar receita extra. Pense no que mais seus clientes precisam.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova oferta..."
              value={newOferta}
              onChange={(e) => setNewOferta(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOferta()}
            />
            <Button onClick={addOferta} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.novasOfertas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.novasOfertas.map((oferta, index) => (
                <Badge key={index} className="px-3 py-1.5 text-sm bg-primary/10 text-primary">
                  {oferta}
                  <button onClick={() => removeOferta(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {localData.novasOfertas.length === 0 && !dismissedSuggestions['novasOfertas'] && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.novasOfertas}
              fieldKey="novasOfertas"
              label="Sugestão de novas ofertas"
              onAccept={(value) => handleAcceptSuggestion('novasOfertas', value)}
              onDismiss={() => handleDismissSuggestion('novasOfertas')}
              onRetry={refresh}
              currentValue={localData.novasOfertas}
            />
          )}
        </CardContent>
      </Card>

      {/* Novos Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Novos Serviços
            <HelpTooltip fieldKey="novosServicos" blockId="estrategiasValor" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Serviços que resolvem problemas adjacentes dos clientes. Ex: suporte premium, consultoria, treinamentos.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite um novo serviço..."
              value={newServico}
              onChange={(e) => setNewServico(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addServico()}
            />
            <Button onClick={addServico} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.novosServicos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.novosServicos.map((servico, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {servico}
                  <button onClick={() => removeServico(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {localData.novosServicos.length === 0 && !dismissedSuggestions['novosServicos'] && (
            <AISuggestionLoader
              isLoading={isLoading}
              error={error}
              suggestion={suggestions?.novosServicos}
              fieldKey="novosServicos"
              label="Sugestão de novos serviços"
              onAccept={(value) => handleAcceptSuggestion('novosServicos', value)}
              onDismiss={() => handleDismissSuggestion('novosServicos')}
              onRetry={refresh}
              currentValue={localData.novosServicos}
            />
          )}
        </CardContent>
      </Card>

      {/* Pacotes Sugeridos pela IA */}
      {suggestions?.pacotes && suggestions.pacotes.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              Pacotes Sugeridos pela IA
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sugestões de pacotes baseadas no seu segmento
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {suggestions.pacotes.map((pacote, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border">
                  <h4 className="font-semibold mb-2">{pacote.nome}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{pacote.descricao}</p>
                  <p className="text-sm font-medium text-primary">{pacote.preco}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
