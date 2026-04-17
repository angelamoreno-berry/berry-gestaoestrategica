import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts-v2/ConsultingContextV2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2, Lightbulb, RefreshCw } from 'lucide-react';
import { HelpTooltip } from '@/components-v2/HelpTooltip';
import { AISuggestionLoader } from '@/components-v2/AISuggestionLoader';
import { useAISuggestions } from '@/hooks-v2/useAISuggestions';

const motoresOpcoes = [
  { value: 'Inbound Marketing', label: 'Inbound Marketing', description: 'Blog, SEO, conteúdo educativo que atrai leads.', icon: '📝' },
  { value: 'Outbound Sales', label: 'Outbound Sales', description: 'Prospecção ativa via cold call/email/LinkedIn.', icon: '📞' },
  { value: 'Indicações', label: 'Indicações', description: 'Programa de referral onde clientes trazem novos.', icon: '🤝' },
  { value: 'Parcerias', label: 'Parcerias', description: 'Canais indiretos, revendedores, integradores.', icon: '🔗' },
  { value: 'Product-Led Growth', label: 'Product-Led Growth', description: 'Produto vende sozinho via freemium/trial.', icon: '🚀' },
];

interface MotoresSuggestions {
  motoresPrincipais: string[];
  canais: string[];
  metricas: Array<{ nome: string; meta: string }>;
}

export function MotoresCrescimentoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete, currentProject } = useConsulting();
  const [localData, setLocalData] = useState(data.motoresCrescimento);
  const [newCanal, setNewCanal] = useState('');
  const [newMotor, setNewMotor] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Record<string, boolean>>({});

  const { suggestions: aiSuggestions, isLoading, error, refresh } = useAISuggestions('motoresCrescimento', currentProject);
  const suggestions = aiSuggestions as unknown as MotoresSuggestions | null;

  useEffect(() => {
    const hasMotor = localData.motoresPrincipais.length > 0 ? 1 : 0;
    const hasCanais = localData.canais.length > 0 ? 1 : 0;
    const hasMetricas = localData.metricas.length > 0 ? 1 : 0;
    const progress = Math.round(((hasMotor + hasCanais + hasMetricas) / 3) * 100);
    updateBlockProgress('motoresCrescimento', progress);
    if (progress === 100) markBlockComplete('motoresCrescimento');
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: unknown) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('motoresCrescimento', newData);
  };

  const toggleMotor = (motorValue: string) => {
    const current = localData.motoresPrincipais;
    handleChange('motoresPrincipais', current.includes(motorValue) ? current.filter(m => m !== motorValue) : [...current, motorValue]);
  };

  const addCustomMotor = () => {
    if (newMotor.trim() && !localData.motoresPrincipais.includes(newMotor.trim())) {
      handleChange('motoresPrincipais', [...localData.motoresPrincipais, newMotor.trim()]);
      setNewMotor('');
    }
  };

  const addCanal = () => {
    if (newCanal.trim()) {
      handleChange('canais', [...localData.canais, newCanal.trim()]);
      setNewCanal('');
    }
  };

  const removeCanal = (index: number) => handleChange('canais', localData.canais.filter((_, i) => i !== index));

  const addMetrica = () => handleChange('metricas', [...localData.metricas, { nome: '', meta: '' }]);

  const updateMetrica = (index: number, field: string, value: string) => {
    const newMetricas = [...localData.metricas];
    newMetricas[index] = { ...newMetricas[index], [field]: value };
    handleChange('metricas', newMetricas);
  };

  const removeMetrica = (index: number) => handleChange('metricas', localData.metricas.filter((_, i) => i !== index));

  const handleAcceptMotoresSuggestion = () => {
    if (suggestions?.motoresPrincipais) handleChange('motoresPrincipais', suggestions.motoresPrincipais);
  };

  const handleAcceptCanaisSuggestion = () => {
    if (suggestions?.canais) handleChange('canais', suggestions.canais);
  };

  const handleAcceptMetricasSuggestion = () => {
    if (suggestions?.metricas) handleChange('metricas', suggestions.metricas);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Defina os motores de crescimento que vão impulsionar o negócio e as métricas para acompanhar o progresso.</p>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Gerar sugestões
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><span className="text-2xl">🚀</span>Motores de Crescimento Principais<HelpTooltip fieldKey="motorPrincipal" blockId="motoresCrescimento" /></CardTitle>
          <p className="text-sm text-muted-foreground">Selecione os motores que fazem sentido para o seu negócio.<Badge variant="outline" className="ml-2">{localData.motoresPrincipais.length} selecionados</Badge></p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {motoresOpcoes.map((motor) => (
              <div key={motor.value} className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${localData.motoresPrincipais.includes(motor.value) ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'}`} onClick={() => toggleMotor(motor.value)}>
                <Checkbox checked={localData.motoresPrincipais.includes(motor.value)} className="mt-1" />
                <Label className="flex-1 cursor-pointer"><span className="flex items-center gap-2 font-medium"><span>{motor.icon}</span>{motor.label}</span><p className="text-sm text-muted-foreground">{motor.description}</p></Label>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Adicionar outro motor:</p>
            <div className="flex gap-2">
              <Input placeholder="Ex: Marketing de Guerrilha..." value={newMotor} onChange={(e) => setNewMotor(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomMotor()} />
              <Button onClick={addCustomMotor} size="icon"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          {localData.motoresPrincipais.length === 0 && !dismissedSuggestions['motores'] && (
            <AISuggestionLoader isLoading={isLoading} error={error} suggestion={suggestions?.motoresPrincipais} fieldKey="motores" label="Sugestão de motores" onAccept={handleAcceptMotoresSuggestion} onDismiss={() => setDismissedSuggestions(prev => ({ ...prev, motores: true }))} onRetry={refresh} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><span className="text-2xl">📣</span>Canais de Aquisição<HelpTooltip fieldKey="canais" blockId="motoresCrescimento" /></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Ex: LinkedIn, Google Ads..." value={newCanal} onChange={(e) => setNewCanal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCanal()} />
            <Button onClick={addCanal} size="icon"><Plus className="w-4 h-4" /></Button>
          </div>
          {localData.canais.length > 0 && (<div className="flex flex-wrap gap-2">{localData.canais.map((canal, index) => (<Badge key={index} variant="secondary" className="px-3 py-1.5">{canal}<button onClick={() => removeCanal(index)} className="ml-2"><X className="w-3 h-3" /></button></Badge>))}</div>)}
          {localData.canais.length === 0 && !dismissedSuggestions['canais'] && (
            <AISuggestionLoader isLoading={isLoading} error={error} suggestion={suggestions?.canais} fieldKey="canais" label="Sugestão de canais" onAccept={handleAcceptCanaisSuggestion} onDismiss={() => setDismissedSuggestions(prev => ({ ...prev, canais: true }))} onRetry={refresh} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="text-2xl">📊</span>Métricas de Crescimento<HelpTooltip fieldKey="metricas" blockId="motoresCrescimento" /></span>
            <Button onClick={addMetrica} size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar Métrica</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.metricas.map((metrica, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input placeholder="Nome da métrica" value={metrica.nome} onChange={(e) => updateMetrica(index, 'nome', e.target.value)} className="flex-1" />
              <Input placeholder="Meta" value={metrica.meta} onChange={(e) => updateMetrica(index, 'meta', e.target.value)} className="w-40" />
              <Button variant="ghost" size="icon" onClick={() => removeMetrica(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
          {localData.metricas.length === 0 && !dismissedSuggestions['metricas'] && (
            <AISuggestionLoader isLoading={isLoading} error={error} suggestion={suggestions?.metricas?.map(m => `${m.nome}: ${m.meta}`)} fieldKey="metricas" label="Sugestão de métricas" onAccept={handleAcceptMetricasSuggestion} onDismiss={() => setDismissedSuggestions(prev => ({ ...prev, metricas: true }))} onRetry={refresh} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
