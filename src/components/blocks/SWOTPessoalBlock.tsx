import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const swotConfig = [
  { key: 'forcas', label: 'Forças Pessoais', icon: '💪', color: 'bg-green-500', description: 'Quais são suas principais habilidades e talentos?' },
  { key: 'fraquezas', label: 'Pontos de Melhoria', icon: '🎯', color: 'bg-red-500', description: 'Em que áreas você precisa se desenvolver?' },
  { key: 'oportunidades', label: 'Oportunidades', icon: '🚀', color: 'bg-blue-500', description: 'Que oportunidades você pode aproveitar?' },
  { key: 'ameacas', label: 'Desafios', icon: '⚠️', color: 'bg-orange-500', description: 'Quais obstáculos podem atrapalhar seu desenvolvimento?' },
] as const;

export function SWOTPessoalBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.swotPessoal);
  const [newItems, setNewItems] = useState<Record<string, string>>({});

  useEffect(() => {
    const hasForcas = localData.forcas.length > 0 ? 1 : 0;
    const hasFraquezas = localData.fraquezas.length > 0 ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const hasAmeacas = localData.ameacas.length > 0 ? 1 : 0;
    const progress = Math.round(((hasForcas + hasFraquezas + hasOportunidades + hasAmeacas) / 4) * 100);
    updateBlockProgress('swotPessoal', progress);
    
    if (progress === 100) {
      markBlockComplete('swotPessoal');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addItem = (key: string) => {
    const item = newItems[key];
    if (item?.trim()) {
      const newData = { ...localData, [key]: [...localData[key as keyof typeof localData], item.trim()] };
      setLocalData(newData);
      updateData('swotPessoal', newData);
      setNewItems({ ...newItems, [key]: '' });
    }
  };

  const removeItem = (key: string, index: number) => {
    const newData = { 
      ...localData, 
      [key]: localData[key as keyof typeof localData].filter((_, i) => i !== index) 
    };
    setLocalData(newData);
    updateData('swotPessoal', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Realize uma análise SWOT pessoal do líder/CEO para identificar pontos de desenvolvimento e fortalecimento.
      </p>

      {/* Personal Profile Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Análise Pessoal do Líder</h3>
              <p className="text-sm text-muted-foreground">
                Autoconhecimento é a base para o desenvolvimento de uma liderança eficaz
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              
              {localData[item.key as keyof typeof localData].length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {localData[item.key as keyof typeof localData].map((swotItem, index) => (
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

      {/* Insights */}
      {(localData.forcas.length > 0 || localData.fraquezas.length > 0) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Insights de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {localData.forcas.length > 0 && localData.oportunidades.length > 0 && (
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm font-medium text-green-600 mb-1">Alavancagem (Forças + Oportunidades)</p>
                <p className="text-sm text-muted-foreground">
                  Use suas forças ({localData.forcas.slice(0, 2).join(', ')}) para aproveitar as oportunidades identificadas.
                </p>
              </div>
            )}
            {localData.fraquezas.length > 0 && (
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <p className="text-sm font-medium text-orange-600 mb-1">Foco de Desenvolvimento</p>
                <p className="text-sm text-muted-foreground">
                  Priorize o desenvolvimento em: {localData.fraquezas.slice(0, 2).join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
