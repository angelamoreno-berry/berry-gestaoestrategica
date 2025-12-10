import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const modelosPrecificacao = [
  { value: 'hora', label: 'Por Hora', description: 'Cobrança baseada no tempo investido' },
  { value: 'projeto', label: 'Por Projeto', description: 'Valor fixo por entrega definida' },
  { value: 'recorrente', label: 'Recorrente', description: 'Assinatura mensal ou anual' },
  { value: 'resultado', label: 'Por Resultado', description: 'Cobrança baseada em metas atingidas' },
  { value: 'hibrido', label: 'Híbrido', description: 'Combinação de modelos' },
];

const estrategiasPrecificacao = [
  { value: 'penetracao', label: 'Penetração', description: 'Preços baixos para ganhar mercado' },
  { value: 'skimming', label: 'Skimming', description: 'Preços altos para posicionamento premium' },
  { value: 'competitivo', label: 'Competitivo', description: 'Preços similares à concorrência' },
  { value: 'valor', label: 'Baseado em Valor', description: 'Preço reflete o valor entregue' },
];

export function PrecificacaoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.precificacao);

  useEffect(() => {
    const hasModelo = localData.modelo.length > 0 ? 1 : 0;
    const hasEstrategia = localData.estrategia.length > 0 ? 1 : 0;
    const hasAncoragem = localData.ancoragem.trim().length > 0 ? 1 : 0;
    const hasMargem = localData.margemDesejada.trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasModelo + hasEstrategia + hasAncoragem + hasMargem) / 4) * 100);
    updateBlockProgress('precificacao', progress);
    
    if (progress === 100) {
      markBlockComplete('precificacao');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('precificacao', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina a estratégia de precificação que maximize valor percebido e rentabilidade do negócio.
      </p>

      {/* Modelo de Precificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            Modelo de Precificação
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como você vai cobrar pelos seus serviços?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.modelo}
            onValueChange={(value) => handleChange('modelo', value)}
            className="grid gap-3"
          >
            {modelosPrecificacao.map((modelo) => (
              <div key={modelo.value} className="flex items-start space-x-3">
                <RadioGroupItem value={modelo.value} id={modelo.value} className="mt-1" />
                <Label htmlFor={modelo.value} className="flex-1 cursor-pointer">
                  <span className="font-medium">{modelo.label}</span>
                  <p className="text-sm text-muted-foreground">{modelo.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Estratégia de Preço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Estratégia de Preço
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Qual posicionamento de preço faz sentido para o negócio?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.estrategia}
            onValueChange={(value) => handleChange('estrategia', value)}
            className="grid grid-cols-2 gap-3"
          >
            {estrategiasPrecificacao.map((estrategia) => (
              <div
                key={estrategia.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  localData.estrategia === estrategia.value
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground'
                }`}
                onClick={() => handleChange('estrategia', estrategia.value)}
              >
                <RadioGroupItem value={estrategia.value} id={estrategia.value} className="sr-only" />
                <Label htmlFor={estrategia.value} className="cursor-pointer">
                  <span className="font-medium">{estrategia.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{estrategia.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ancoragem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚓</span>
            Ancoragem de Preço
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Qual referência de preço você quer criar na mente do cliente?
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ex: Mostrar primeiro o pacote premium de R$10k para que o pacote de R$5k pareça mais acessível..."
            value={localData.ancoragem}
            onChange={(e) => handleChange('ancoragem', e.target.value)}
            className="resize-none"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Margem Desejada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Margem Desejada
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Qual margem de lucro você busca alcançar?
          </p>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Ex: 40% de margem líquida"
            value={localData.margemDesejada}
            onChange={(e) => handleChange('margemDesejada', e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
