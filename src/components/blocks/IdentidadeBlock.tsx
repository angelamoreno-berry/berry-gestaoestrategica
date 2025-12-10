import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';

export function IdentidadeBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.identidade);
  const [newValor, setNewValor] = useState('');

  useEffect(() => {
    const fields = [localData.visao, localData.missao, localData.posicionamento];
    const filledFields = fields.filter(f => f.trim().length > 0).length;
    const hasValores = localData.valores.length > 0 ? 1 : 0;
    const progress = Math.round(((filledFields + hasValores) / 4) * 100);
    updateBlockProgress('identidade', progress);
    
    if (progress === 100) {
      markBlockComplete('identidade');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: keyof typeof localData, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('identidade', newData);
  };

  const addValor = () => {
    if (newValor.trim()) {
      const newValores = [...localData.valores, newValor.trim()];
      handleChange('valores', newValores);
      setNewValor('');
    }
  };

  const removeValor = (index: number) => {
    const newValores = localData.valores.filter((_, i) => i !== index);
    handleChange('valores', newValores);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina ou ajuste os pilares fundamentais que guiarão todas as decisões estratégicas da empresa.
      </p>

      <div className="grid gap-6">
        {/* Visão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔭</span>
              Visão
              <HelpTooltip blockId="identidade" fieldKey="visao" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Onde a empresa quer chegar? Qual é o sonho grande a ser alcançado?
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Ser a maior referência em consultoria de gestão para pequenas empresas no Brasil até 2030..."
              value={localData.visao}
              onChange={(e) => handleChange('visao', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Missão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Missão
              <HelpTooltip blockId="identidade" fieldKey="missao" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Qual é o propósito da empresa? Por que ela existe?
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Transformar a gestão de pequenas empresas através de metodologias práticas e resultados mensuráveis..."
              value={localData.missao}
              onChange={(e) => handleChange('missao', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              Valores
              <HelpTooltip blockId="identidade" fieldKey="valores" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Quais são os princípios inegociáveis que guiam as ações da empresa?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite um valor..."
                value={newValor}
                onChange={(e) => setNewValor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addValor()}
              />
              <Button onClick={addValor} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {localData.valores.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {localData.valores.map((valor, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    {valor}
                    <button
                      onClick={() => removeValor(index)}
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

        {/* Posicionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Posicionamento
              <HelpTooltip blockId="identidade" fieldKey="posicionamento" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Como a empresa quer ser percebida pelo mercado?
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Somos a consultoria que entrega resultado real, com metodologia prática e acompanhamento próximo..."
              value={localData.posicionamento}
              onChange={(e) => handleChange('posicionamento', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
