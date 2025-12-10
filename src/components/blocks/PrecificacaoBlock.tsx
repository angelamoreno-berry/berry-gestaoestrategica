import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpTooltip } from '@/components/HelpTooltip';

const modelosPrecificacao = [
  { value: 'hora', label: 'Por Hora', description: 'Ideal para consultorias e serviços customizados. Ex: R$150-500/hora' },
  { value: 'projeto', label: 'Por Projeto', description: 'Valor fixo por entrega. Ex: Website R$5.000, Consultoria R$15.000' },
  { value: 'recorrente', label: 'Recorrente', description: 'Assinatura mensal/anual. Ex: SaaS R$99-999/mês, Assessoria R$2.000/mês' },
  { value: 'resultado', label: 'Por Resultado', description: 'Comissão sobre resultados. Ex: 10% do aumento de vendas, fee de sucesso' },
  { value: 'hibrido', label: 'Híbrido', description: 'Combinação de modelos. Ex: Setup R$5.000 + R$500/mês de manutenção' },
];

const estrategiasPrecificacao = [
  { value: 'penetracao', label: 'Penetração', description: 'Preço baixo para ganhar mercado rápido. Cuidado com a sustentabilidade!' },
  { value: 'skimming', label: 'Skimming', description: 'Preço premium para posicionamento alto. Requer diferenciação clara.' },
  { value: 'competitivo', label: 'Competitivo', description: 'Preços alinhados ao mercado. Seguro, mas difícil de se destacar.' },
  { value: 'valor', label: 'Baseado em Valor', description: 'Preço reflete ROI do cliente. Ideal se você pode comprovar resultados.' },
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
            <HelpTooltip fieldKey="modelo" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como você vai cobrar? A escolha impacta diretamente seu fluxo de caixa e escalabilidade.
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
            <HelpTooltip fieldKey="estrategia" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Posicionamento de preço define percepção de marca. Preço baixo demais pode desvalorizar seu trabalho.
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
            <HelpTooltip fieldKey="ancoragem" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Técnica psicológica para criar referência de valor. Ex: mostrar o plano premium primeiro.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ex: Mostrar primeiro o pacote Enterprise de R$15k, depois o Pro de R$5k parece muito acessível. Ou comparar com o custo de contratar um funcionário (R$5k/mês vs nossa solução por R$500/mês)..."
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
            <HelpTooltip fieldKey="margemDesejada" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Referências: SaaS 70-80%, Consultoria 40-60%, Varejo 30-50%, Indústria 15-30%
          </p>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Ex: 45% de margem bruta ou 25% de margem líquida"
            value={localData.margemDesejada}
            onChange={(e) => handleChange('margemDesejada', e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
