import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { HelpTooltip } from '@/components/HelpTooltip';

export function GoldenCircleBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.goldenCircle);

  useEffect(() => {
    const hasWhy = localData.why.trim().length > 0 ? 1 : 0;
    const hasHow = localData.how.trim().length > 0 ? 1 : 0;
    const hasWhat = localData.what.trim().length > 0 ? 1 : 0;
    const progress = Math.round(((hasWhy + hasHow + hasWhat) / 3) * 100);
    updateBlockProgress('goldenCircle', progress);
    
    if (progress === 100) {
      markBlockComplete('goldenCircle');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('goldenCircle', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Baseado no conceito de Simon Sinek, defina o propósito profundo da empresa começando pelo "porquê".
      </p>

      {/* Golden Circle Visualization */}
      <div className="flex justify-center py-8">
        <div className="relative">
          {/* Por Quê - Círculo Interno */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary flex items-center justify-center z-30 shadow-strong">
            <div className="text-center text-primary-foreground">
              <span className="text-xl font-bold">POR QUÊ</span>
              <p className="text-xs opacity-80">Propósito</p>
            </div>
          </div>
          
          {/* Como - Círculo do Meio */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-primary/30 flex items-start justify-center pt-4 z-20">
            <div className="text-center text-foreground">
              <span className="text-lg font-semibold">COMO</span>
              <p className="text-xs opacity-70">Diferencial</p>
            </div>
          </div>
          
          {/* O Quê - Círculo Externo */}
          <div className="w-80 h-80 rounded-full bg-primary/10 flex items-start justify-center pt-4 z-10">
            <div className="text-center text-foreground">
              <span className="text-lg font-semibold">O QUÊ</span>
              <p className="text-xs opacity-70">Entrega</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Cards */}
      <div className="space-y-4">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              POR QUÊ - Por que existimos?
              <HelpTooltip fieldKey="why" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Seu propósito vai além do lucro. O que te fez começar? Que impacto quer causar? Ex: Apple = "Desafiar o status quo"
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Acreditamos que toda pequena empresa merece acesso a ferramentas de gestão profissionais. Existimos para democratizar a gestão de qualidade e ajudar empreendedores a realizarem seu potencial..."
              value={localData.why}
              onChange={(e) => handleChange('why', e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold">
                2
              </div>
              COMO - Como fazemos?
              <HelpTooltip fieldKey="how" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sua forma única de entregar valor. Metodologia, processos ou valores que te diferenciam.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Através de uma metodologia prática de 90 dias com sprints semanais, ferramentas exclusivas, mentoria personalizada e foco obsessivo em resultados mensuráveis..."
              value={localData.how}
              onChange={(e) => handleChange('how', e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                3
              </div>
              O QUÊ - O que entregamos?
              <HelpTooltip fieldKey="what" blockId="goldenCircle" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Produtos e serviços concretos. O que o cliente leva para casa?
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Consultoria em gestão empresarial, treinamentos para líderes, diagnósticos de maturidade, ferramentas de planejamento estratégico e acompanhamento mensal de resultados..."
              value={localData.what}
              onChange={(e) => handleChange('what', e.target.value)}
              className="resize-none"
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary Preview */}
      {(localData.why || localData.how || localData.what) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Golden Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {localData.why && (
              <div>
                <p className="text-xs font-medium text-primary mb-1">POR QUÊ</p>
                <p className="text-sm">{localData.why}</p>
              </div>
            )}
            {localData.how && (
              <div>
                <p className="text-xs font-medium text-primary/70 mb-1">COMO</p>
                <p className="text-sm">{localData.how}</p>
              </div>
            )}
            {localData.what && (
              <div>
                <p className="text-xs font-medium text-primary/50 mb-1">O QUÊ</p>
                <p className="text-sm">{localData.what}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
