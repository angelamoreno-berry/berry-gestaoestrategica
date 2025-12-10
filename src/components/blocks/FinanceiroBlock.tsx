import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, Users, Wallet, CreditCard, Lightbulb, ShieldAlert } from 'lucide-react';
import { HelpTooltip } from '@/components/HelpTooltip';
import { Divida } from '@/types/consulting';

export function FinanceiroBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.financeiro);
  const [newOportunidade, setNewOportunidade] = useState('');
  const [newRisco, setNewRisco] = useState('');
  const [novaDivida, setNovaDivida] = useState<Partial<Divida>>({
    descricao: '',
    valorTotal: 0,
    parcelasMensais: 0,
    parcelasRestantes: 0,
    taxaJuros: 0,
  });

  useEffect(() => {
    const hasDespesas = (localData.despesasFixas > 0 || localData.despesasVariaveis > 0) ? 1 : 0;
    const hasFaturamento = localData.faturamentoAtual > 0 ? 1 : 0;
    const hasMeta = localData.metaFaturamento > 0 ? 1 : 0;
    const hasIndicadores = (localData.ticketMedio > 0 || localData.quantidadeClientes > 0) ? 1 : 0;
    const hasOportunidades = localData.oportunidades.length > 0 ? 1 : 0;
    const progress = Math.round(((hasDespesas + hasFaturamento + hasMeta + hasIndicadores + hasOportunidades) / 5) * 100);
    updateBlockProgress('financeiro', progress);
    
    if (progress === 100) {
      markBlockComplete('financeiro');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: number | string[] | Divida[]) => {
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

  const addRisco = () => {
    if (newRisco.trim()) {
      handleChange('riscos', [...(localData.riscos || []), newRisco.trim()]);
      setNewRisco('');
    }
  };

  const removeRisco = (index: number) => {
    handleChange('riscos', (localData.riscos || []).filter((_, i) => i !== index));
  };

  const addDivida = () => {
    if (novaDivida.descricao && novaDivida.valorTotal && novaDivida.valorTotal > 0) {
      const novasDividas = [...(localData.dividas || []), novaDivida as Divida];
      const totalDividas = novasDividas.reduce((acc, d) => acc + d.valorTotal, 0);
      const parcelasMensaisTotal = novasDividas.reduce((acc, d) => acc + d.parcelasMensais, 0);
      const comprometimento = localData.faturamentoAtual > 0 
        ? (parcelasMensaisTotal / localData.faturamentoAtual) * 100 
        : 0;
      
      const newData = {
        ...localData,
        dividas: novasDividas,
        totalDividas,
        comprometimentoReceita: parseFloat(comprometimento.toFixed(1)),
      };
      setLocalData(newData);
      updateData('financeiro', newData);
      setNovaDivida({ descricao: '', valorTotal: 0, parcelasMensais: 0, parcelasRestantes: 0, taxaJuros: 0 });
    }
  };

  const removeDivida = (index: number) => {
    const novasDividas = (localData.dividas || []).filter((_, i) => i !== index);
    const totalDividas = novasDividas.reduce((acc, d) => acc + d.valorTotal, 0);
    const parcelasMensaisTotal = novasDividas.reduce((acc, d) => acc + d.parcelasMensais, 0);
    const comprometimento = localData.faturamentoAtual > 0 
      ? (parcelasMensaisTotal / localData.faturamentoAtual) * 100 
      : 0;
    
    const newData = {
      ...localData,
      dividas: novasDividas,
      totalDividas,
      comprometimentoReceita: parseFloat(comprometimento.toFixed(1)),
    };
    setLocalData(newData);
    updateData('financeiro', newData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Cálculos de indicadores
  const lucroLiquido = localData.faturamentoAtual - localData.despesasFixas - localData.despesasVariaveis;
  const margemCalculada = localData.faturamentoAtual > 0 
    ? ((lucroLiquido / localData.faturamentoAtual) * 100).toFixed(1)
    : '0';
  
  const pontoEquilibrio = localData.margemLucro > 0 
    ? localData.despesasFixas / (localData.margemLucro / 100)
    : localData.despesasFixas;
    
  const ltvCacRatio = localData.cac > 0 ? (localData.ltv / localData.cac).toFixed(1) : '0';
  
  const mesesReserva = localData.despesasFixas > 0 
    ? (localData.reservaEmergencia / localData.despesasFixas).toFixed(1)
    : '0';
    
  const cicloFinanceiro = localData.prazoMedioRecebimento - localData.prazoMedioPagamento;

  // Insights automáticos
  const getInsights = () => {
    const insights: { type: 'success' | 'warning' | 'danger'; text: string }[] = [];
    
    if (Number(margemCalculada) < 10) {
      insights.push({ type: 'danger', text: 'Margem crítica! Abaixo de 10% compromete a sustentabilidade do negócio.' });
    } else if (Number(margemCalculada) < 20) {
      insights.push({ type: 'warning', text: 'Margem abaixo do ideal. Busque aumentar para pelo menos 20%.' });
    } else {
      insights.push({ type: 'success', text: `Margem saudável de ${margemCalculada}%. Continue otimizando custos.` });
    }
    
    if (Number(ltvCacRatio) < 3 && localData.cac > 0) {
      insights.push({ type: 'warning', text: `LTV/CAC de ${ltvCacRatio}x está baixo. Ideal é acima de 3x.` });
    } else if (localData.cac > 0) {
      insights.push({ type: 'success', text: `LTV/CAC de ${ltvCacRatio}x indica boa eficiência de aquisição.` });
    }
    
    if (Number(mesesReserva) < 3 && localData.reservaEmergencia > 0) {
      insights.push({ type: 'danger', text: `Reserva cobre apenas ${mesesReserva} meses. Recomendado: 6 meses.` });
    } else if (Number(mesesReserva) >= 6) {
      insights.push({ type: 'success', text: `Reserva de ${mesesReserva} meses oferece boa segurança.` });
    }
    
    if (localData.comprometimentoReceita > 30) {
      insights.push({ type: 'danger', text: `${localData.comprometimentoReceita}% da receita comprometida com dívidas é muito alto!` });
    } else if (localData.comprometimentoReceita > 15) {
      insights.push({ type: 'warning', text: `${localData.comprometimentoReceita}% comprometido com dívidas. Atenção ao fluxo de caixa.` });
    }
    
    if (cicloFinanceiro > 15) {
      insights.push({ type: 'warning', text: `Ciclo financeiro de ${cicloFinanceiro} dias. Negocie melhores prazos.` });
    } else if (cicloFinanceiro < 0) {
      insights.push({ type: 'success', text: `Ciclo financeiro favorável de ${cicloFinanceiro} dias.` });
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Realize uma análise financeira completa com indicadores de desempenho, endividamento e insights estratégicos.
      </p>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Despesas Totais</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(localData.despesasFixas + localData.despesasVariaveis)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Faturamento</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(localData.faturamentoAtual)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Lucro Líquido</span>
            </div>
            <p className={`text-lg font-bold ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(lucroLiquido)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Margem</span>
            </div>
            <p className={`text-lg font-bold ${Number(margemCalculada) >= 20 ? 'text-green-600' : Number(margemCalculada) >= 10 ? 'text-orange-600' : 'text-red-600'}`}>
              {margemCalculada}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights Automáticos */}
      {insights.length > 0 && localData.faturamentoAtual > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Insights Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  insight.type === 'success' ? 'bg-green-500/10 text-green-700' :
                  insight.type === 'warning' ? 'bg-orange-500/10 text-orange-700' :
                  'bg-red-500/10 text-red-700'
                }`}
              >
                {insight.type === 'danger' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {insight.text}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="basico" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basico">Básico</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="endividamento">Endividamento</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="basico" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Despesas
                  <HelpTooltip fieldKey="despesasFixas" blockId="financeiro" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Despesas Fixas (mensal)
                    <span className="text-xs ml-2 opacity-70">Ex: aluguel, salários, contador</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.despesasFixas || ''}
                    onChange={(e) => handleChange('despesasFixas', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Despesas Variáveis (mensal)
                    <span className="text-xs ml-2 opacity-70">Ex: comissões, insumos, frete</span>
                  </label>
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
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Receita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Faturamento Atual (mensal)
                    <span className="text-xs ml-2 opacity-70">Média dos últimos 3-6 meses</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.faturamentoAtual || ''}
                    onChange={(e) => handleChange('faturamentoAtual', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Meta de Faturamento (mensal)
                  </label>
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

          {/* Análise Rápida */}
          {localData.faturamentoAtual > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Ponto de Equilíbrio</span>
                    <span className="text-xl font-bold">{formatCurrency(pontoEquilibrio)}</span>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Gap para Meta</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(Math.max(0, localData.metaFaturamento - localData.faturamentoAtual))}
                    </span>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">% do Ponto de Equilíbrio</span>
                    <span className={`text-xl font-bold ${localData.faturamentoAtual >= pontoEquilibrio ? 'text-green-600' : 'text-red-600'}`}>
                      {pontoEquilibrio > 0 ? ((localData.faturamentoAtual / pontoEquilibrio) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="indicadores" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Indicadores de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Quantidade de Clientes Ativos</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localData.quantidadeClientes || ''}
                    onChange={(e) => handleChange('quantidadeClientes', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Ticket Médio (R$)
                    <span className="text-xs ml-2 opacity-70">Faturamento / Clientes</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.ticketMedio || ''}
                    onChange={(e) => handleChange('ticketMedio', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    CAC - Custo de Aquisição de Cliente
                    <span className="text-xs ml-2 opacity-70">Quanto custa trazer um cliente</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.cac || ''}
                    onChange={(e) => handleChange('cac', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    LTV - Lifetime Value
                    <span className="text-xs ml-2 opacity-70">Valor total que um cliente gera</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.ltv || ''}
                    onChange={(e) => handleChange('ltv', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-500" />
                  Fluxo de Caixa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Prazo Médio de Recebimento (dias)
                    <span className="text-xs ml-2 opacity-70">Quanto tempo para receber</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localData.prazoMedioRecebimento || ''}
                    onChange={(e) => handleChange('prazoMedioRecebimento', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Prazo Médio de Pagamento (dias)
                    <span className="text-xs ml-2 opacity-70">Quanto tempo para pagar</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localData.prazoMedioPagamento || ''}
                    onChange={(e) => handleChange('prazoMedioPagamento', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Capital de Giro Disponível</label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.capitalGiro || ''}
                    onChange={(e) => handleChange('capitalGiro', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Reserva de Emergência
                    <span className="text-xs ml-2 opacity-70">Ideal: 6 meses de despesas fixas</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={localData.reservaEmergencia || ''}
                    onChange={(e) => handleChange('reservaEmergencia', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores Calculados */}
          {(localData.cac > 0 || localData.prazoMedioRecebimento > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores Calculados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {localData.cac > 0 && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <span className="text-sm text-muted-foreground block mb-1">Ratio LTV/CAC</span>
                      <span className={`text-xl font-bold ${Number(ltvCacRatio) >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                        {ltvCacRatio}x
                      </span>
                      <span className="text-xs text-muted-foreground block">Ideal: ≥ 3x</span>
                    </div>
                  )}
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Ciclo Financeiro</span>
                    <span className={`text-xl font-bold ${cicloFinanceiro <= 0 ? 'text-green-600' : cicloFinanceiro <= 15 ? 'text-orange-600' : 'text-red-600'}`}>
                      {cicloFinanceiro} dias
                    </span>
                    <span className="text-xs text-muted-foreground block">Ideal: ≤ 0 dias</span>
                  </div>
                  {localData.reservaEmergencia > 0 && localData.despesasFixas > 0 && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <span className="text-sm text-muted-foreground block mb-1">Meses de Reserva</span>
                      <span className={`text-xl font-bold ${Number(mesesReserva) >= 6 ? 'text-green-600' : Number(mesesReserva) >= 3 ? 'text-orange-600' : 'text-red-600'}`}>
                        {mesesReserva}
                      </span>
                      <span className="text-xs text-muted-foreground block">Ideal: ≥ 6 meses</span>
                    </div>
                  )}
                  {localData.quantidadeClientes > 0 && localData.faturamentoAtual > 0 && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <span className="text-sm text-muted-foreground block mb-1">Ticket Calculado</span>
                      <span className="text-xl font-bold">
                        {formatCurrency(localData.faturamentoAtual / localData.quantidadeClientes)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="endividamento" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                Dívidas e Financiamentos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Cadastre empréstimos, financiamentos e outras dívidas para análise de comprometimento.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-5 gap-2">
                <Input
                  placeholder="Descrição"
                  value={novaDivida.descricao || ''}
                  onChange={(e) => setNovaDivida({ ...novaDivida, descricao: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Valor Total"
                  value={novaDivida.valorTotal || ''}
                  onChange={(e) => setNovaDivida({ ...novaDivida, valorTotal: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Parcela Mensal"
                  value={novaDivida.parcelasMensais || ''}
                  onChange={(e) => setNovaDivida({ ...novaDivida, parcelasMensais: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Parcelas Restantes"
                  value={novaDivida.parcelasRestantes || ''}
                  onChange={(e) => setNovaDivida({ ...novaDivida, parcelasRestantes: Number(e.target.value) })}
                />
                <Button onClick={addDivida}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar
                </Button>
              </div>

              {(localData.dividas || []).length > 0 && (
                <div className="space-y-2">
                  {(localData.dividas || []).map((divida, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{divida.descricao}</span>
                        <div className="text-sm text-muted-foreground">
                          Total: {formatCurrency(divida.valorTotal)} | 
                          Parcela: {formatCurrency(divida.parcelasMensais)} | 
                          Restante: {divida.parcelasRestantes}x
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeDivida(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resumo do Endividamento */}
              {(localData.dividas || []).length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="p-4 bg-red-500/10 rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Total de Dívidas</span>
                    <span className="text-xl font-bold text-red-600">{formatCurrency(localData.totalDividas || 0)}</span>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Parcelas Mensais</span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatCurrency((localData.dividas || []).reduce((acc, d) => acc + d.parcelasMensais, 0))}
                    </span>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg text-center">
                    <span className="text-sm text-muted-foreground block mb-1">Comprometimento da Receita</span>
                    <span className={`text-xl font-bold ${(localData.comprometimentoReceita || 0) > 30 ? 'text-red-600' : (localData.comprometimentoReceita || 0) > 15 ? 'text-orange-600' : 'text-green-600'}`}>
                      {localData.comprometimentoReceita || 0}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oportunidades" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-500" />
                Oportunidades de Melhoria
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ex: Renegociar aluguel, reduzir inadimplência, aumentar preços, cortar custos não essenciais.
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
                    <Badge key={index} className="px-3 py-1.5 text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Riscos Identificados
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ex: Dependência de poucos clientes, inadimplência, sazonalidade, custos variáveis altos.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Descreva um risco financeiro..."
                  value={newRisco}
                  onChange={(e) => setNewRisco(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRisco()}
                />
                <Button onClick={addRisco} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {(localData.riscos || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(localData.riscos || []).map((risco, index) => (
                    <Badge key={index} className="px-3 py-1.5 text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20">
                      {risco}
                      <button onClick={() => removeRisco(index)} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}