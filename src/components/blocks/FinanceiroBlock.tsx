import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function FinanceiroBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.financeiro);
  const [newOportunidade, setNewOportunidade] = useState('');

  useEffect(() => {
    const hasDespesas = (localData.despesasFixas > 0 || localData.despesasVariaveis > 0) ? 1 : 0;
    const hasFaturamento = localData.faturamentoAtual > 0 ? 1 : 0;
    const hasMeta = localData.metaFaturamento > 0 ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const progress = Math.round(((hasDespesas + hasFaturamento + hasMeta + hasOportunidades) / 4) * 100);
    updateBlockProgress('financeiro', progress);
    
    if (progress === 100) {
      markBlockComplete('financeiro');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('financeiro', newData);
  };

  const addOportunidade = () => {
    if (newOportunidade.trim()) {
      handleChange('oportunidades', [...localData.oportunidades, newOportunidade.trim()]);
      setNewOportunidade('');
    }
  };

  const removeOportunidade = (index: number) => {
    handleChange('oportunidades', localData.oportunidades.filter((_, i) => i !== index));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const lucroLiquido = localData.faturamentoAtual - localData.despesasFixas - localData.despesasVariaveis;
  const margemCalculada = localData.faturamentoAtual > 0 
    ? ((lucroLiquido / localData.faturamentoAtual) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Realize uma análise financeira inicial para identificar a situação atual e oportunidades de melhoria.
      </p>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Despesas Fixas</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(localData.despesasFixas)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Despesas Variáveis</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(localData.despesasVariaveis)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Faturamento</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(localData.faturamentoAtual)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Margem</span>
            </div>
            <p className="text-lg font-bold">{margemCalculada}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Input Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">📉</span>
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Despesas Fixas (mensal)</label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={localData.despesasFixas || ''}
                onChange={(e) => handleChange('despesasFixas', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Despesas Variáveis (mensal)</label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={localData.despesasVariaveis || ''}
                onChange={(e) => handleChange('despesasVariaveis', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">📈</span>
              Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Faturamento Atual (mensal)</label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={localData.faturamentoAtual || ''}
                onChange={(e) => handleChange('faturamentoAtual', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Meta de Faturamento (mensal)</label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={localData.metaFaturamento || ''}
                onChange={(e) => handleChange('metaFaturamento', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicator */}
      {localData.faturamentoAtual > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Lucro Líquido Estimado</span>
                <span className={`font-bold ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(lucroLiquido)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Margem de Lucro</span>
                <span className={`font-bold ${Number(margemCalculada) >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
                  {margemCalculada}%
                </span>
              </div>
              {localData.metaFaturamento > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Gap para Meta</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(localData.metaFaturamento - localData.faturamentoAtual)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Oportunidades Identificadas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Onde é possível reduzir custos ou aumentar receita?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Descreva uma oportunidade..."
              value={newOportunidade}
              onChange={(e) => setNewOportunidade(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOportunidade()}
            />
            <Button onClick={addOportunidade} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {localData.oportunidades.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.oportunidades.map((oportunidade, index) => (
                <Badge key={index} className="px-3 py-1.5 text-sm bg-green-500/10 text-green-600">
                  {oportunidade}
                  <button onClick={() => removeOportunidade(index)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
