import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const areas = [
  { key: 'pessoas', label: 'Pessoas', color: 'bg-[hsl(var(--brand-blue))]', description: 'Gestão de equipe, cultura, talentos e desenvolvimento' },
  { key: 'processos', label: 'Processos', color: 'bg-[hsl(var(--brand-teal))]', description: 'Fluxos de trabalho, automações e eficiência operacional' },
  { key: 'financas', label: 'Finanças', color: 'bg-[hsl(var(--brand-green))]', description: 'Controle financeiro, fluxo de caixa e indicadores' },
  { key: 'mercado', label: 'Mercado', color: 'bg-[hsl(var(--brand-purple))]', description: 'Posicionamento, vendas e relacionamento com cliente' },
] as const;

const maturityLevels = [
  { level: 1, label: 'Inicial', description: 'Processos ad-hoc, sem estrutura definida' },
  { level: 2, label: 'Básico', description: 'Alguns processos definidos, pouca consistência' },
  { level: 3, label: 'Definido', description: 'Processos documentados e seguidos' },
  { level: 4, label: 'Gerenciado', description: 'Métricas e KPIs estabelecidos' },
  { level: 5, label: 'Otimizado', description: 'Melhoria contínua e inovação' },
];

export function DiagnosticoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.diagnostico);

  useEffect(() => {
    // Calculate progress based on filled fields
    const filledAreas = Object.values(localData).filter(area => area.level > 0).length;
    const progress = Math.round((filledAreas / 4) * 100);
    updateBlockProgress('diagnostico', progress);
    
    if (progress === 100) {
      markBlockComplete('diagnostico');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleLevelChange = (key: string, value: number[]) => {
    const newData = {
      ...localData,
      [key]: { ...localData[key as keyof typeof localData], level: value[0] }
    };
    setLocalData(newData);
    updateData('diagnostico', newData);
  };

  const handleNotesChange = (key: string, notes: string) => {
    const newData = {
      ...localData,
      [key]: { ...localData[key as keyof typeof localData], notes }
    };
    setLocalData(newData);
    updateData('diagnostico', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Avalie o nível de maturidade atual da empresa em cada área fundamental de gestão.
        Use a escala de 1 a 5 para classificar cada dimensão.
      </p>

      {/* Maturity Scale Legend */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Escala de Maturidade</p>
          <div className="grid grid-cols-5 gap-2">
            {maturityLevels.map((level) => (
              <div key={level.level} className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-1">
                  <span className="text-sm font-bold text-primary">{level.level}</span>
                </div>
                <p className="text-xs font-medium">{level.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Cards */}
      <div className="grid gap-4">
        {areas.map((area) => {
          const areaData = localData[area.key];
          const currentLevel = maturityLevels.find(l => l.level === areaData.level);
          
          return (
            <Card key={area.key} className="overflow-hidden">
              <div className={cn("h-1", area.color)} />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{area.label}</span>
                  {areaData.level > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      Nível {areaData.level}: {currentLevel?.label}
                    </span>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Nível de Maturidade</Label>
                  <Slider
                    value={[areaData.level]}
                    onValueChange={(value) => handleLevelChange(area.key, value)}
                    max={5}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Não avaliado</span>
                    <span>Otimizado</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Observações</Label>
                  <Textarea
                    placeholder={`Adicione observações sobre ${area.label.toLowerCase()}...`}
                    value={areaData.notes}
                    onChange={(e) => handleNotesChange(area.key, e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Visualization */}
      {Object.values(localData).some(area => area.level > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Radar de Maturidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {areas.map((area) => {
                const areaData = localData[area.key];
                const percentage = (areaData.level / 5) * 100;
                return (
                  <div key={area.key} className="text-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          strokeWidth="8"
                          className="stroke-muted"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={cn("transition-all duration-500", area.color.replace('bg-', 'stroke-'))}
                          style={{
                            strokeDasharray: `${2 * Math.PI * 35}`,
                            strokeDashoffset: `${2 * Math.PI * 35 * (1 - percentage / 100)}`,
                          }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-bold">
                        {areaData.level}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-2">{area.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
