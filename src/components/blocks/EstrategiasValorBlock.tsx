import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';

export function EstrategiasValorBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.estrategiasValor);
  const [newOferta, setNewOferta] = useState('');
  const [newServico, setNewServico] = useState('');

  useEffect(() => {
    const hasOfertas = localData.novasOfertas.length > 0 ? 1 : 0;
    const hasServicos = localData.novosServicos.length > 0 ? 1 : 0;
    const hasPacotes = localData.pacotes.length > 0 ? 1 : 0;
    const progress = Math.round(((hasOfertas + hasServicos + hasPacotes) / 3) * 100);
    updateBlockProgress('estrategiasValor', progress);
    
    if (progress === 100) {
      markBlockComplete('estrategiasValor');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const addOferta = () => {
    if (newOferta.trim()) {
      const newData = { ...localData, novasOfertas: [...localData.novasOfertas, newOferta.trim()] };
      setLocalData(newData);
      updateData('estrategiasValor', newData);
      setNewOferta('');
    }
  };

  const removeOferta = (index: number) => {
    const newData = { ...localData, novasOfertas: localData.novasOfertas.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const addServico = () => {
    if (newServico.trim()) {
      const newData = { ...localData, novosServicos: [...localData.novosServicos, newServico.trim()] };
      setLocalData(newData);
      updateData('estrategiasValor', newData);
      setNewServico('');
    }
  };

  const removeServico = (index: number) => {
    const newData = { ...localData, novosServicos: localData.novosServicos.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const addPacote = () => {
    const newPacote = { nome: '', descricao: '', preco: '' };
    const newData = { ...localData, pacotes: [...localData.pacotes, newPacote] };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const updatePacote = (index: number, field: string, value: string) => {
    const newPacotes = [...localData.pacotes];
    newPacotes[index] = { ...newPacotes[index], [field]: value };
    const newData = { ...localData, pacotes: newPacotes };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  const removePacote = (index: number) => {
    const newData = { ...localData, pacotes: localData.pacotes.filter((_, i) => i !== index) };
    setLocalData(newData);
    updateData('estrategiasValor', newData);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Identifique oportunidades para agregar valor ao negócio através de novas ofertas, serviços e pacotes estratégicos.
      </p>

      {/* Novas Ofertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            Novas Ofertas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Produtos ou serviços adicionais que podem ser oferecidos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova oferta..."
              value={newOferta}
              onChange={(e) => setNewOferta(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOferta()}
            />
            <Button onClick={addOferta} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.novasOfertas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.novasOfertas.map((oferta, index) => (
                <Badge key={index} className="px-3 py-1.5 text-sm bg-primary/10 text-primary">
                  {oferta}
                  <button onClick={() => removeOferta(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Novos Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Novos Serviços
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Serviços complementares ou upgrades para o portfólio atual
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite um novo serviço..."
              value={newServico}
              onChange={(e) => setNewServico(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addServico()}
            />
            <Button onClick={addServico} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.novosServicos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.novosServicos.map((servico, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {servico}
                  <button onClick={() => removeServico(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pacotes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              Pacotes de Serviços
            </span>
            <Button onClick={addPacote} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Pacote
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Combine serviços em pacotes atrativos para diferentes perfis de clientes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.pacotes.map((pacote, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Nome do pacote (ex: Pacote Premium)"
                  value={pacote.nome}
                  onChange={(e) => updatePacote(index, 'nome', e.target.value)}
                  className="font-medium"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePacote(index)}
                  className="ml-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Descrição do pacote e o que inclui..."
                value={pacote.descricao}
                onChange={(e) => updatePacote(index, 'descricao', e.target.value)}
                className="resize-none"
                rows={2}
              />
              <Input
                placeholder="Preço sugerido (ex: R$ 2.500/mês)"
                value={pacote.preco}
                onChange={(e) => updatePacote(index, 'preco', e.target.value)}
              />
            </div>
          ))}
          {localData.pacotes.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Clique em "Adicionar Pacote" para criar seus pacotes de serviços
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
