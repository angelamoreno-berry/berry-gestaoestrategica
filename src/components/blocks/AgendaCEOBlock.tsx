import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const importanciaLabels = {
  alta: { label: 'Alta', color: 'bg-red-500' },
  media: { label: 'Média', color: 'bg-yellow-500' },
  baixa: { label: 'Baixa', color: 'bg-green-500' },
};

export function AgendaCEOBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.agendaCEO);

  useEffect(() => {
    const hasPrioridades = localData.prioridades.length > 0 ? 1 : 0;
    const hasAlocacao = localData.alocacaoTempo.length > 0 ? 1 : 0;
    const hasFoco = localData.focoTrimestre.trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasPrioridades + hasAlocacao + hasFoco) / 3) * 100);
    updateBlockProgress('agendaCEO', progress);
    
    if (progress === 100) {
      markBlockComplete('agendaCEO');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addPrioridade = () => {
    const newPrioridade = { descricao: '', importancia: 'media' as const };
    const newData = { ...localData, prioridades: [...localData.prioridades, newPrioridade] };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const updatePrioridade = (index: number, field: string, value: string) => {
    const newPrioridades = [...localData.prioridades];
    newPrioridades[index] = { ...newPrioridades[index], [field]: value };
    const newData = { ...localData, prioridades: newPrioridades };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const removePrioridade = (index: number) => {
    const newData = { ...localData, prioridades: localData.prioridades.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const addAlocacao = () => {
    const newAlocacao = { atividade: '', percentual: 20 };
    const newData = { ...localData, alocacaoTempo: [...localData.alocacaoTempo, newAlocacao] };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const updateAlocacao = (index: number, field: string, value: string | number) => {
    const newAlocacao = [...localData.alocacaoTempo];
    newAlocacao[index] = { ...newAlocacao[index], [field]: value };
    const newData = { ...localData, alocacaoTempo: newAlocacao };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const removeAlocacao = (index: number) => {
    const newData = { ...localData, alocacaoTempo: localData.alocacaoTempo.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const handleFocoChange = (value: string) => {
    const newData = { ...localData, focoTrimestre: value };
    setLocalData(newData);
    updateData('agendaCEO', newData);
  };

  const totalPercentual = localData.alocacaoTempo.reduce((acc, item) => acc + item.percentual, 0);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina as prioridades estratégicas do CEO, a alocação ideal de tempo e o foco principal para o próximo trimestre.
      </p>

      {/* Foco do Trimestre */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Foco Principal do Trimestre
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Qual é A coisa mais importante que o CEO deve entregar nos próximos 90 dias?
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ex: Implementar o novo processo comercial e treinar a equipe para dobrar a conversão de leads..."
            value={localData.focoTrimestre}
            onChange={(e) => handleFocoChange(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Prioridades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Prioridades Estratégicas
            </span>
            <Button onClick={addPrioridade} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {localData.prioridades.map((prioridade, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <div className="flex-1">
                <Input
                  placeholder="Descreva a prioridade..."
                  value={prioridade.descricao}
                  onChange={(e) => updatePrioridade(index, 'descricao', e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                {(['alta', 'media', 'baixa'] as const).map((imp) => (
                  <button
                    key={imp}
                    onClick={() => updatePrioridade(index, 'importancia', imp)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all",
                      prioridade.importancia === imp
                        ? cn(importanciaLabels[imp].color, "text-white")
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {importanciaLabels[imp].label}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePrioridade(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {localData.prioridades.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Adicione as prioridades estratégicas do CEO
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alocação de Tempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Alocação Ideal de Tempo
            </span>
            <Button onClick={addAlocacao} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como o tempo do CEO deve ser distribuído entre as principais atividades?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.alocacaoTempo.map((alocacao, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Atividade (ex: Estratégia, Vendas, Operações)"
                  value={alocacao.atividade}
                  onChange={(e) => updateAlocacao(index, 'atividade', e.target.value)}
                  className="flex-1"
                />
                <span className="w-12 text-right font-bold text-primary">{alocacao.percentual}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAlocacao(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Slider
                value={[alocacao.percentual]}
                onValueChange={(value) => updateAlocacao(index, 'percentual', value[0])}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          ))}
          
          {localData.alocacaoTempo.length > 0 && (
            <div className={cn(
              "p-3 rounded-lg text-center",
              totalPercentual === 100 ? "bg-green-500/10" : "bg-orange-500/10"
            )}>
              <p className="text-sm font-medium">
                Total: {totalPercentual}%
                {totalPercentual !== 100 && (
                  <span className="text-muted-foreground ml-2">
                    (ideal: 100%)
                  </span>
                )}
              </p>
            </div>
          )}
          
          {localData.alocacaoTempo.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Adicione as atividades e sua alocação de tempo ideal
            </p>
          )}
        </CardContent>
      </Card>

      {/* Visual Time Distribution */}
      {localData.alocacaoTempo.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-8 rounded-lg overflow-hidden">
              {localData.alocacaoTempo.map((alocacao, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center text-xs font-medium text-white transition-all",
                    index % 5 === 0 ? "bg-primary" :
                    index % 5 === 1 ? "bg-accent" :
                    index % 5 === 2 ? "bg-green-500" :
                    index % 5 === 3 ? "bg-orange-500" : "bg-purple-500"
                  )}
                  style={{ width: `${alocacao.percentual}%` }}
                  title={`${alocacao.atividade}: ${alocacao.percentual}%`}
                >
                  {alocacao.percentual >= 15 && alocacao.atividade.substring(0, 10)}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {localData.alocacaoTempo.map((alocacao, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {alocacao.atividade}: {alocacao.percentual}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
