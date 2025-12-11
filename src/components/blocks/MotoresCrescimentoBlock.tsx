import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2, Lightbulb } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';

const motoresOpcoes = [
  { value: 'Inbound Marketing', label: 'Inbound Marketing', description: 'Blog, SEO, conteúdo educativo que atrai leads. Ex: HubSpot, Rock Content', icon: '📝' },
  { value: 'Outbound Sales', label: 'Outbound Sales', description: 'Prospecção ativa via cold call/email/LinkedIn. Ex: empresas B2B de ticket alto', icon: '📞' },
  { value: 'Indicações', label: 'Indicações', description: 'Programa de referral onde clientes trazem novos. Ex: Dropbox, Nubank', icon: '🤝' },
  { value: 'Parcerias', label: 'Parcerias', description: 'Canais indiretos, revendedores, integradores. Ex: Salesforce, Microsoft', icon: '🔗' },
  { value: 'Product-Led Growth', label: 'Product-Led Growth', description: 'Produto vende sozinho via freemium/trial. Ex: Slack, Notion, Canva', icon: '🚀' },
];

const motoresSugestoes = [
  { value: 'Marketing de Conteúdo', description: 'Criar conteúdo relevante para atrair e engajar público-alvo', icon: '✍️' },
  { value: 'SEO Local', description: 'Otimização para buscas locais no Google Meu Negócio', icon: '📍' },
  { value: 'Eventos e Networking', description: 'Participação em feiras, eventos e networking presencial', icon: '🎪' },
  { value: 'Social Selling', description: 'Vendas através de relacionamentos em redes sociais', icon: '💬' },
  { value: 'Comunidade', description: 'Criar comunidade de clientes e entusiastas da marca', icon: '👥' },
  { value: 'Afiliados', description: 'Programa de afiliados que divulgam por comissão', icon: '💰' },
  { value: 'Account-Based Marketing', description: 'Marketing direcionado para contas específicas de alto valor', icon: '🎯' },
  { value: 'Influenciadores', description: 'Parcerias com influenciadores do nicho', icon: '⭐' },
  { value: 'Email Marketing', description: 'Nutrição de leads e relacionamento por email', icon: '📧' },
  { value: 'Webinars e Workshops', description: 'Eventos online educativos para gerar leads qualificados', icon: '🎥' },
];

export function MotoresCrescimentoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.motoresCrescimento);
  const [newCanal, setNewCanal] = useState('');
  const [newMotor, setNewMotor] = useState('');
  const [showSugestoes, setShowSugestoes] = useState(false);

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
    } else {
      handleChange('motoresPrincipais', [...current, motorValue]);
    }
  };

  const addCustomMotor = () => {
    if (newMotor.trim() && !localData.motoresPrincipais.includes(newMotor.trim())) {
      handleChange('motoresPrincipais', [...localData.motoresPrincipais, newMotor.trim()]);
      setNewMotor('');
    }
  };

  const addSugestao = (sugestao: string) => {
    if (!localData.motoresPrincipais.includes(sugestao)) {
      handleChange('motoresPrincipais', [...localData.motoresPrincipais, sugestao]);
    }
  };

  const removeMotor = (motor: string) => {
    handleChange('motoresPrincipais', localData.motoresPrincipais.filter(m => m !== motor));
  };

  const selectAll = () => {
    const allMotores = motoresOpcoes.map(m => m.value);
    handleChange('motoresPrincipais', [...new Set([...localData.motoresPrincipais, ...allMotores])]);
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

  // Filter suggestions that are not already selected
  const availableSugestoes = motoresSugestoes.filter(
    s => !localData.motoresPrincipais.includes(s.value)
  );

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
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Selecione os motores que fazem sentido para o seu negócio.
              <Badge variant="outline" className="ml-2">{localData.motoresPrincipais.length} selecionados</Badge>
            </p>
            <Button variant="outline" size="sm" onClick={selectAll}>
              Selecionar Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {motoresOpcoes.map((motor) => {
              const isSelected = localData.motoresPrincipais.includes(motor.value);
              
              return (
                <div
                  key={motor.value}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => toggleMotor(motor.value)}
                >
                  <Checkbox 
                    checked={isSelected} 
                    className="mt-1" 
                  />
                  <Label className="flex-1 cursor-pointer">
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

          {/* Motores customizados adicionados */}
          {localData.motoresPrincipais.filter(m => !motoresOpcoes.find(o => o.value === m)).length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Motores adicionados:</p>
              <div className="flex flex-wrap gap-2">
                {localData.motoresPrincipais
                  .filter(m => !motoresOpcoes.find(o => o.value === m))
                  .map((motor, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                      {motor}
                      <button onClick={(e) => { e.stopPropagation(); removeMotor(motor); }} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Adicionar motor customizado */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Adicionar outro motor:</p>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Marketing de Guerrilha, PLG, etc..."
                value={newMotor}
                onChange={(e) => setNewMotor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomMotor()}
              />
              <Button onClick={addCustomMotor} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sugestões */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setShowSugestoes(!showSugestoes)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showSugestoes ? 'Ocultar sugestões' : 'Ver sugestões de motores adicionais'}
            </Button>
            
            {showSugestoes && availableSugestoes.length > 0 && (
              <div className="mt-3 grid gap-2">
                {availableSugestoes.map((sugestao) => (
                  <div
                    key={sugestao.value}
                    className="flex items-center justify-between p-3 border border-dashed rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>{sugestao.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{sugestao.value}</p>
                        <p className="text-xs text-muted-foreground">{sugestao.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addSugestao(sugestao.value)}>
                      <Plus className="w-3 h-3 mr-1" /> Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {showSugestoes && availableSugestoes.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground text-center py-4">
                Todas as sugestões já foram adicionadas!
              </p>
            )}
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
