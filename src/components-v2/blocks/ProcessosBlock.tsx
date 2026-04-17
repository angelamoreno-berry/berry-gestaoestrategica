import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Cog, RefreshCw } from 'lucide-react';
import { HelpTooltip } from '@/components-v2/HelpTooltip';
import { AISuggestionLoader } from '@/components-v2/AISuggestionLoader';
import { useAISuggestions } from '@/hooks-v2/useAISuggestions';

const frequencias = [
  { value: 'diario', label: 'Diário' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'sob_demanda', label: 'Sob Demanda' },
];

interface ProcessosSuggestions {
  processos: Array<{ nome: string; descricao: string; responsavel: string; frequencia: string }>;
}

export function ProcessosBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.processos);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);

  const { suggestions: aiSuggestions, isLoading, error, refresh } = useAISuggestions('processos', currentProject);
  const suggestions = aiSuggestions as unknown as ProcessosSuggestions | null;

  useEffect(() => {
    const hasProcessos = localData.processos.length > 0 ? 1 : 0;
    const hasDetalhes = localData.processos.some(p => p.descricao && p.responsavel) ? 1 : 0;
    const progress = Math.round(((hasProcessos + hasDetalhes) / 2) * 100);
    updateBlockProgress('processos', progress);
    if (progress === 100) markBlockComplete('processos');
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addProcesso = () => {
    const newProcesso = { nome: '', descricao: '', responsavel: '', frequencia: '' };
    const newData = { ...localData, processos: [...localData.processos, newProcesso] };
    setLocalData(newData);
    updateData('processos', newData);
  };

  const updateProcesso = (index: number, field: string, value: string) => {
    const newProcessos = [...localData.processos];
    newProcessos[index] = { ...newProcessos[index], [field]: value };
    const newData = { ...localData, processos: newProcessos };
    setLocalData(newData);
    updateData('processos', newData);
  };

  const removeProcesso = (index: number) => {
    const newData = { ...localData, processos: localData.processos.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('processos', newData);
  };

  const handleAcceptSuggestion = () => {
    if (suggestions?.processos) {
      const newData = { ...localData, processos: suggestions.processos };
      setLocalData(newData);
      updateData('processos', newData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Mapeie os processos essenciais do negócio, definindo responsáveis e frequência de execução.</p>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Gerar sugestões
        </Button>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <HelpTooltip fieldKey="processos" blockId="processos" />
            <div>
              <p className="text-sm font-medium">💡 Processos essenciais para mapear</p>
              <p className="text-sm text-muted-foreground">
                <strong>Vendas:</strong> Prospecção → Qualificação → Proposta → Fechamento<br/>
                <strong>Entrega:</strong> Onboarding → Execução → Acompanhamento → Conclusão
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={addProcesso} size="lg" className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Processo
        </Button>
      </div>

      {localData.processos.length === 0 && !dismissedSuggestions && (
        <AISuggestionLoader
          isLoading={isLoading}
          error={error}
          suggestion={suggestions?.processos?.map(p => `${p.nome}: ${p.descricao}`)}
          fieldKey="processos"
          label="Sugestão de processos"
          onAccept={handleAcceptSuggestion}
          onDismiss={() => setDismissedSuggestions(true)}
          onRetry={refresh}
        />
      )}

      <div className="grid gap-4">
        {localData.processos.map((processo, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cog className="w-5 h-5 text-primary" />
                  </div>
                  <Input placeholder="Nome do processo" value={processo.nome} onChange={(e) => updateProcesso(index, 'nome', e.target.value)} className="font-medium" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeProcesso(index)} className="text-destructive hover:text-destructive ml-2">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Descreva as etapas principais..." value={processo.descricao} onChange={(e) => updateProcesso(index, 'descricao', e.target.value)} className="resize-none" rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Responsável</label>
                  <Input placeholder="Quem executa?" value={processo.responsavel} onChange={(e) => updateProcesso(index, 'responsavel', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Frequência</label>
                  <Select value={processo.frequencia} onValueChange={(value) => updateProcesso(index, 'frequencia', value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>{frequencias.map((freq) => (<SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {localData.processos.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Cog className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Clique em "Adicionar Processo" para mapear os processos essenciais</p>
          </CardContent>
        </Card>
      )}

      {localData.processos.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Resumo dos Processos</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><p className="text-2xl font-bold text-primary">{localData.processos.length}</p><p className="text-xs text-muted-foreground">Processos mapeados</p></div>
              <div><p className="text-2xl font-bold text-primary">{localData.processos.filter(p => p.responsavel).length}</p><p className="text-xs text-muted-foreground">Com responsável</p></div>
              <div><p className="text-2xl font-bold text-primary">{localData.processos.filter(p => p.frequencia).length}</p><p className="text-xs text-muted-foreground">Com frequência</p></div>
              <div><p className="text-2xl font-bold text-primary">{localData.processos.filter(p => p.descricao).length}</p><p className="text-xs text-muted-foreground">Com descrição</p></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
