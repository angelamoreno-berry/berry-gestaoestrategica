import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2 } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';

const motoresOpcoes = [
  { value: 'inbound', label: 'Inbound Marketing', description: 'Blog, SEO, conteúdo educativo que atrai leads. Ex: HubSpot, Rock Content', icon: '📝' },
  { value: 'outbound', label: 'Outbound Sales', description: 'Prospecção ativa via cold call/email/LinkedIn. Ex: empresas B2B de ticket alto', icon: '📞' },
  { value: 'indicacao', label: 'Indicações', description: 'Programa de referral onde clientes trazem novos. Ex: Dropbox, Nubank', icon: '🤝' },
  { value: 'parcerias', label: 'Parcerias', description: 'Canais indiretos, revendedores, integradores. Ex: Salesforce, Microsoft', icon: '🔗' },
  { value: 'produto', label: 'Product-Led', description: 'Produto vende sozinho via freemium/trial. Ex: Slack, Notion, Canva', icon: '🚀' },
];

export function MotoresCrescimentoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.motoresCrescimento);
  const [newCanal, setNewCanal] = useState('');

  useEffect(() => {
    const hasMotor = localData.motoresPrincipais.length > 0 ? 1 : 0;
    const hasCanais = localData.canais.length > 0 ? 1 : 0;
    const hasMetricas = localData.metricas.length > 0 ? 1 : 0;
    const progress = Math.round(((hasMotor + hasCanais + hasMetricas) / 3) * 100);
    updateBlockProgress('motoresCrescimento', progress);
    
    if (progress === 100) {
      markBlockComplete('motoresCrescimento');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('motoresCrescimento', newData);
  };

  const toggleMotor = (motorValue: string) => {
    const current = localData.motoresPrincipais;
    if (current.includes(motorValue)) {
      handleChange('motoresPrincipais', current.filter(m => m !== motorValue));
    } else if (current.length < 2) {
      handleChange('motoresPrincipais', [...current, motorValue]);
    }
  };

  const addCanal = () => {
    if (newCanal.trim()) {
      handleChange('canais', [...localData.canais, newCanal.trim()]);
      setNewCanal('');
    }
  };

  const removeCanal = (index: number) => {
    handleChange('canais', localData.canais.filter((_, i) => i !== index));
  };

  const addMetrica = () => {
    const newMetrica = { nome: '', meta: '' };
    handleChange('metricas', [...localData.metricas, newMetrica]);
  };

  const updateMetrica = (index: number, field: string, value: string) => {
    const newMetricas = [...localData.metricas];
    newMetricas[index] = { ...newMetricas[index], [field]: value };
    handleChange('metricas', newMetricas);
  };

  const removeMetrica = (index: number) => {
    handleChange('metricas', localData.metricas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina os motores de crescimento que vão impulsionar o negócio e as métricas para acompanhar o progresso.
      </p>

      {/* Motores Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Motores de Crescimento Principais
            <HelpTooltip fieldKey="motorPrincipal" blockId="motoresCrescimento" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha até 2 motores principais. Foco é essencial - empresas que dominam poucos canais crescem mais rápido.
            <Badge variant="outline" className="ml-2">{localData.motoresPrincipais.length}/2</Badge>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {motoresOpcoes.map((motor) => {
              const isSelected = localData.motoresPrincipais.includes(motor.value);
              const isDisabled = !isSelected && localData.motoresPrincipais.length >= 2;
              
              return (
                <div
                  key={motor.value}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => !isDisabled && toggleMotor(motor.value)}
                >
                  <Checkbox 
                    checked={isSelected} 
                    disabled={isDisabled}
                    className="mt-1" 
                  />
                  <Label className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <span className="flex items-center gap-2 font-medium">
                      <span>{motor.icon}</span>
                      {motor.label}
                    </span>
                    <p className="text-sm text-muted-foreground">{motor.description}</p>
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Canais de Aquisição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📣</span>
            Canais de Aquisição
            <HelpTooltip fieldKey="canais" blockId="motoresCrescimento" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Liste 2-3 canais principais. Ex: Google Ads, LinkedIn, Instagram, Eventos, Indicações, Parcerias.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: LinkedIn, Google Ads, Eventos..."
              value={newCanal}
              onChange={(e) => setNewCanal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCanal()}
            />
            <Button onClick={addCanal} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.canais.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.canais.map((canal, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {canal}
                  <button onClick={() => removeCanal(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Métricas de Crescimento
              <HelpTooltip fieldKey="metricas" blockId="motoresCrescimento" />
            </span>
            <Button onClick={addMetrica} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Métrica
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            KPIs essenciais: CAC (custo aquisição), LTV (valor cliente), Conversão, Churn, MRR, Ticket Médio.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.metricas.map((metrica, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder="Nome da métrica (ex: CAC, LTV, MRR)"
                value={metrica.nome}
                onChange={(e) => updateMetrica(index, 'nome', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Meta (ex: R$ 500, 30%)"
                value={metrica.meta}
                onChange={(e) => updateMetrica(index, 'meta', e.target.value)}
                className="w-40"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMetrica(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {localData.metricas.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Clique em "Adicionar Métrica" para definir seus KPIs
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
