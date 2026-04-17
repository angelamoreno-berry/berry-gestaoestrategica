import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X, Users, Crown, User, UserCircle } from 'lucide-react';
import { HelpTooltip } from '@/components-v2/HelpTooltip';

const nivelConfig = {
  1: { label: 'Nível 1 - Estratégico', icon: Crown, color: 'bg-yellow-500', description: 'CEO, Diretores, Sócios' },
  2: { label: 'Nível 2 - Tático', icon: User, color: 'bg-blue-500', description: 'Gerentes, Coordenadores' },
  3: { label: 'Nível 3 - Operacional', icon: UserCircle, color: 'bg-green-500', description: 'Analistas, Assistentes' },
};

export function OrganogramaBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.organograma);
  const [newResponsabilidade, setNewResponsabilidade] = useState<Record<number, string>>({});
  const [newKpi, setNewKpi] = useState<Record<number, string>>({});

  useEffect(() => {
    const hasCargos = localData.cargos.length > 0 ? 1 : 0;
    const hasResponsabilidades = localData.cargos.some(c => c.responsabilidades.length > 0) ? 1 : 0;
    const hasKpis = localData.cargos.some(c => c.kpis && c.kpis.length > 0) ? 1 : 0;
    const progress = Math.round(((hasCargos + hasResponsabilidades + hasKpis) / 3) * 100);
    updateBlockProgress('organograma', progress);
    
    if (progress === 100) {
      markBlockComplete('organograma');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addCargo = (nivel: 1 | 2 | 3) => {
    const newCargo = { titulo: '', nivel, responsabilidades: [], kpis: [], subordinadoA: '' };
    const newData = { ...localData, cargos: [...localData.cargos, newCargo] };
    setLocalData(newData);
    updateData('organograma', newData);
  };

  const updateCargo = (index: number, field: string, value: any) => {
    const newCargos = [...localData.cargos];
    newCargos[index] = { ...newCargos[index], [field]: value };
    const newData = { ...localData, cargos: newCargos };
    setLocalData(newData);
    updateData('organograma', newData);
  };

  const removeCargo = (index: number) => {
    const newData = { ...localData, cargos: localData.cargos.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('organograma', newData);
  };

  const addResponsabilidade = (cargoIndex: number) => {
    const resp = newResponsabilidade[cargoIndex];
    if (resp?.trim()) {
      const newCargos = [...localData.cargos];
      newCargos[cargoIndex].responsabilidades = [...newCargos[cargoIndex].responsabilidades, resp.trim()];
      const newData = { ...localData, cargos: newCargos };
      setLocalData(newData);
      updateData('organograma', newData);
      setNewResponsabilidade({ ...newResponsabilidade, [cargoIndex]: '' });
    }
  };

  const removeResponsabilidade = (cargoIndex: number, respIndex: number) => {
    const newCargos = [...localData.cargos];
    newCargos[cargoIndex].responsabilidades = newCargos[cargoIndex].responsabilidades.filter((_, i) => i !== respIndex);
    const newData = { ...localData, cargos: newCargos };
    setLocalData(newData);
    updateData('organograma', newData);
  };

  const addKpi = (cargoIndex: number) => {
    const kpi = newKpi[cargoIndex];
    if (kpi?.trim()) {
      const newCargos = [...localData.cargos];
      newCargos[cargoIndex].kpis = [...(newCargos[cargoIndex].kpis || []), kpi.trim()];
      const newData = { ...localData, cargos: newCargos };
      setLocalData(newData);
      updateData('organograma', newData);
      setNewKpi({ ...newKpi, [cargoIndex]: '' });
    }
  };

  const removeKpi = (cargoIndex: number, kpiIndex: number) => {
    const newCargos = [...localData.cargos];
    newCargos[cargoIndex].kpis = (newCargos[cargoIndex].kpis || []).filter((_, i) => i !== kpiIndex);
    const newData = { ...localData, cargos: newCargos };
    setLocalData(newData);
    updateData('organograma', newData);
  };

  const cargosPorNivel = {
    1: localData.cargos.filter(c => c.nivel === 1),
    2: localData.cargos.filter(c => c.nivel === 2),
    3: localData.cargos.filter(c => c.nivel === 3),
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Construa a estrutura organizacional em 3 níveis: Estratégico (direção), Tático (gerência) e Operacional (execução).
      </p>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <HelpTooltip fieldKey="cargos" blockId="organograma" />
            <div>
              <p className="text-sm font-medium">💡 Estrutura em 3 Níveis</p>
              <p className="text-sm text-muted-foreground">
                <strong>Nível 1 (Estratégico):</strong> Define visão e direção • 
                <strong> Nível 2 (Tático):</strong> Traduz estratégia em planos • 
                <strong> Nível 3 (Operacional):</strong> Executa o dia a dia
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Organograma Preview */}
      {localData.cargos.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">Estrutura Organizacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((nivel) => {
              const cargosNivel = cargosPorNivel[nivel as 1 | 2 | 3];
              const config = nivelConfig[nivel as 1 | 2 | 3];
              if (cargosNivel.length === 0) return null;
              
              return (
                <div key={nivel} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 pl-5">
                    {cargosNivel.map((cargo, idx) => {
                      const Icon = config.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-card border rounded-lg p-3 text-center min-w-[140px] shadow-soft"
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-1 ${config.color.replace('bg-', 'text-')}`} />
                          <p className="font-medium text-sm">{cargo.titulo || 'Cargo'}</p>
                          <p className="text-xs text-muted-foreground">
                            {cargo.responsabilidades.length} resp. • {(cargo.kpis || []).length} KPIs
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {nivel < 3 && cargosPorNivel[(nivel + 1) as 2 | 3].length > 0 && (
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Add Position Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((nivel) => {
          const config = nivelConfig[nivel as 1 | 2 | 3];
          const Icon = config.icon;
          return (
            <Button
              key={nivel}
              onClick={() => addCargo(nivel as 1 | 2 | 3)}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-1"
            >
              <Icon className={`w-5 h-5 ${config.color.replace('bg-', 'text-')}`} />
              <span className="text-xs font-medium">{config.label}</span>
              <span className="text-xs text-muted-foreground">{config.description}</span>
            </Button>
          );
        })}
      </div>

      {/* Position Cards by Level */}
      {[1, 2, 3].map((nivel) => {
        const cargosNivel = localData.cargos
          .map((cargo, originalIndex) => ({ ...cargo, originalIndex }))
          .filter(c => c.nivel === nivel);
        const config = nivelConfig[nivel as 1 | 2 | 3];
        
        if (cargosNivel.length === 0) return null;

        return (
          <div key={nivel} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <h3 className="font-semibold">{config.label}</h3>
            </div>
            
            <div className="grid gap-4">
              {cargosNivel.map((cargo) => {
                const index = cargo.originalIndex;
                return (
                  <Card key={index} className={`border-l-4 ${config.color.replace('bg-', 'border-')}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder={`Título do cargo (ex: ${nivel === 1 ? 'CEO, Diretor' : nivel === 2 ? 'Gerente, Coordenador' : 'Analista, Assistente'})`}
                            value={cargo.titulo}
                            onChange={(e) => updateCargo(index, 'titulo', e.target.value)}
                            className="font-medium"
                          />
                          <Input
                            placeholder="Reporta-se a (ex: CEO)"
                            value={cargo.subordinadoA}
                            onChange={(e) => updateCargo(index, 'subordinadoA', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCargo(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Responsabilidades */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          📋 Responsabilidades Críticas
                          <span className="text-xs text-muted-foreground font-normal">
                            (Liste as 3-5 entregas mais importantes)
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ex: Garantir meta de vendas mensal"
                            value={newResponsabilidade[index] || ''}
                            onChange={(e) => setNewResponsabilidade({ ...newResponsabilidade, [index]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addResponsabilidade(index)}
                          />
                          <Button onClick={() => addResponsabilidade(index)} size="icon">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {cargo.responsabilidades.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {cargo.responsabilidades.map((resp, respIndex) => (
                              <Badge key={respIndex} variant="secondary" className="px-3 py-1.5 text-sm">
                                {resp}
                                <button
                                  onClick={() => removeResponsabilidade(index, respIndex)}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* KPIs */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          📊 KPIs Principais
                          <span className="text-xs text-muted-foreground font-normal">
                            (Ex: Taxa de conversão {">"} 15%, NPS {">"} 70)
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ex: Faturamento mensal > R$ 100k"
                            value={newKpi[index] || ''}
                            onChange={(e) => setNewKpi({ ...newKpi, [index]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addKpi(index)}
                          />
                          <Button onClick={() => addKpi(index)} size="icon" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {(cargo.kpis || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {(cargo.kpis || []).map((kpi, kpiIndex) => (
                              <Badge key={kpiIndex} variant="outline" className="px-3 py-1.5 text-sm border-accent text-accent">
                                📈 {kpi}
                                <button
                                  onClick={() => removeKpi(index, kpiIndex)}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {localData.cargos.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Selecione um nível acima para começar a montar o organograma
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
