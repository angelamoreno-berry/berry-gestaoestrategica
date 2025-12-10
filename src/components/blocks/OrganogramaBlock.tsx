import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X, Users } from 'lucide-react';

export function OrganogramaBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.organograma);
  const [newResponsabilidade, setNewResponsabilidade] = useState<Record<number, string>>({});

  useEffect(() => {
    const hasCargos = localData.cargos.length > 0 ? 1 : 0;
    const hasResponsabilidades = localData.cargos.some(c => c.responsabilidades.length > 0) ? 1 : 0;
    const progress = Math.round(((hasCargos + hasResponsabilidades) / 2) * 100);
    updateBlockProgress('organograma', progress);
    
    if (progress === 100) {
      markBlockComplete('organograma');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addCargo = () => {
    const newCargo = { titulo: '', responsabilidades: [], subordinadoA: '' };
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

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Construa a estrutura organizacional definindo cargos, hierarquia e responsabilidades críticas de cada função.
      </p>

      {/* Visual Organograma Preview */}
      {localData.cargos.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">Estrutura Organizacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {localData.cargos.map((cargo, index) => (
                <div
                  key={index}
                  className="bg-card border rounded-lg p-3 text-center min-w-[120px] shadow-soft"
                >
                  <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="font-medium text-sm">{cargo.titulo || 'Cargo ' + (index + 1)}</p>
                  <p className="text-xs text-muted-foreground">
                    {cargo.responsabilidades.length} responsabilidades
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Position Button */}
      <div className="flex justify-center">
        <Button onClick={addCargo} size="lg" className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Cargo
        </Button>
      </div>

      {/* Position Cards */}
      <div className="grid gap-4">
        {localData.cargos.map((cargo, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Título do cargo (ex: Diretor Comercial)"
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
            <CardContent className="space-y-3">
              <label className="text-sm font-medium">Responsabilidades Críticas</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar responsabilidade..."
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
            </CardContent>
          </Card>
        ))}
      </div>

      {localData.cargos.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Clique em "Adicionar Cargo" para começar a montar o organograma
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
