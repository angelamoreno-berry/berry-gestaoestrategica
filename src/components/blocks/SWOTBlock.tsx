import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const swotConfig = [
  { key: 'forcas', label: 'Forças', icon: '💪', color: 'bg-green-500', description: 'O que a empresa faz bem internamente?' },
  { key: 'fraquezas', label: 'Fraquezas', icon: '⚠️', color: 'bg-red-500', description: 'Onde a empresa precisa melhorar internamente?' },
  { key: 'oportunidades', label: 'Oportunidades', icon: '🚀', color: 'bg-blue-500', description: 'Quais fatores externos podem ser aproveitados?' },
  { key: 'ameacas', label: 'Ameaças', icon: '⛈️', color: 'bg-orange-500', description: 'Quais fatores externos podem prejudicar?' },
] as const;

export function SWOTBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.swot);
  const [newItems, setNewItems] = useState<Record<string, string>>({});

  useEffect(() => {
    const hasForcas = localData.forcas.length > 0 ? 1 : 0;
    const hasFraquezas = localData.fraquezas.length > 0 ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const hasAmeacas = localData.ameacas.length > 0 ? 1 : 0;
    const hasHorizontes = (localData.horizontes.curto || localData.horizontes.medio || localData.horizontes.longo) ? 1 : 0;
    const progress = Math.round(((hasForcas + hasFraquezas + hasOportunidades + hasAmeacas + hasHorizontes) / 5) * 100);
    updateBlockProgress('swot', progress);
    
    if (progress === 100) {
      markBlockComplete('swot');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addItem = (key: string) => {
    const item = newItems[key];
    if (item?.trim()) {
      const newData = { ...localData, [key]: [...localData[key as keyof Pick<typeof localData, 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'>], item.trim()] };
      setLocalData(newData);
      updateData('swot', newData);
      setNewItems({ ...newItems, [key]: '' });
    }
  };

  const removeItem = (key: string, index: number) => {
    const newData = { 
      ...localData, 
      [key]: (localData[key as keyof Pick<typeof localData, 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'>] as string[]).filter((_, i) => i !== index) 
    };
    setLocalData(newData);
    updateData('swot', newData);
  };

  const handleHorizonteChange = (key: string, value: string) => {
    const newData = { ...localData, horizontes: { ...localData.horizontes, [key]: value } };
    setLocalData(newData);
    updateData('swot', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Realize uma análise SWOT completa e defina os horizontes de planejamento estratégico.
      </p>

      {/* SWOT Matrix */}
      <div className="grid md:grid-cols-2 gap-4">
        {swotConfig.map((item) => (
          <Card key={item.key} className="overflow-hidden">
            <div className={cn("h-1", item.color)} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder={`Adicionar ${item.label.toLowerCase()}...`}
                  value={newItems[item.key] || ''}
                  onChange={(e) => setNewItems({ ...newItems, [item.key]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && addItem(item.key)}
                  className="text-sm"
                />
                <Button onClick={() => addItem(item.key)} size="icon" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {(localData[item.key as keyof Pick<typeof localData, 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'>] as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(localData[item.key as keyof Pick<typeof localData, 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'>] as string[]).map((swotItem, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                      {swotItem}
                      <button onClick={() => removeItem(item.key, index)} className="ml-1.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Horizontes de Planejamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🗓️</span>
            Horizontes de Planejamento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Defina as principais metas para cada horizonte temporal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Curto Prazo (3-6 meses)
              </label>
              <Textarea
                placeholder="Principais entregas e conquistas..."
                value={localData.horizontes.curto}
                onChange={(e) => handleHorizonteChange('curto', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                Médio Prazo (6-12 meses)
              </label>
              <Textarea
                placeholder="Objetivos intermediários..."
                value={localData.horizontes.medio}
                onChange={(e) => handleHorizonteChange('medio', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Longo Prazo (1-3 anos)
              </label>
              <Textarea
                placeholder="Visão de futuro e grandes metas..."
                value={localData.horizontes.longo}
                onChange={(e) => handleHorizonteChange('longo', e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
