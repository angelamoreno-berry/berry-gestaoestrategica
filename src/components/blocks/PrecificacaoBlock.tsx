import { useState, useEffect } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { HelpTooltip } from '@/components/HelpTooltip';
import { Plus, Trash2, TrendingUp, Package, Crown, RefreshCw, Target, Anchor } from 'lucide-react';
import { ProdutoServico } from '@/types/consulting';

const modelosPrecificacao = [
  { value: 'hora', label: 'Por Hora', description: 'Ideal para consultorias e serviços customizados' },
  { value: 'projeto', label: 'Por Projeto', description: 'Valor fixo por entrega' },
  { value: 'recorrente', label: 'Recorrente', description: 'Assinatura mensal/anual' },
  { value: 'resultado', label: 'Por Resultado', description: 'Comissão sobre resultados' },
  { value: 'hibrido', label: 'Híbrido', description: 'Combinação de modelos' },
];

const estrategiasPrecificacao = [
  { value: 'penetracao', label: 'Penetração', description: 'Preço baixo para ganhar mercado' },
  { value: 'skimming', label: 'Skimming', description: 'Preço premium posicionamento alto' },
  { value: 'competitivo', label: 'Competitivo', description: 'Preços alinhados ao mercado' },
  { value: 'valor', label: 'Baseado em Valor', description: 'Preço reflete ROI do cliente' },
];

interface SugestaoPreco {
  tipo: string;
  icone: React.ReactNode;
  cor: string;
  titulo: string;
  descricao: string;
  calculo: (preco: number) => { valor: string; explicacao: string };
}

const sugestoes: SugestaoPreco[] = [
  {
    tipo: 'valor',
    icone: <TrendingUp className="w-5 h-5" />,
    cor: 'from-emerald-500 to-emerald-600',
    titulo: 'Valor Agregado',
    descricao: 'Adicione benefícios extras que justifiquem um preço maior',
    calculo: (preco) => ({
      valor: `R$ ${(preco * 1.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      explicacao: '+40% com garantia estendida, suporte VIP e bônus exclusivos'
    })
  },
  {
    tipo: 'combo',
    icone: <Package className="w-5 h-5" />,
    cor: 'from-blue-500 to-blue-600',
    titulo: 'Combo/Pacote',
    descricao: 'Agrupe produtos para aumentar ticket médio',
    calculo: (preco) => ({
      valor: `R$ ${(preco * 2.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      explicacao: 'Pacote com 3 itens (economia de 15% para o cliente, +67% ticket)'
    })
  },
  {
    tipo: 'premium',
    icone: <Crown className="w-5 h-5" />,
    cor: 'from-amber-500 to-amber-600',
    titulo: 'Plano Premium',
    descricao: 'Versão exclusiva com recursos avançados',
    calculo: (preco) => ({
      valor: `R$ ${(preco * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      explicacao: '2x o valor com atendimento prioritário, recursos exclusivos'
    })
  },
  {
    tipo: 'recorrencia',
    icone: <RefreshCw className="w-5 h-5" />,
    cor: 'from-purple-500 to-purple-600',
    titulo: 'Recorrência',
    descricao: 'Transforme em assinatura para receita previsível',
    calculo: (preco) => ({
      valor: `R$ ${(preco * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`,
      explicacao: '15% do valor como mensalidade = 12x retorno anual'
    })
  },
  {
    tipo: 'roi',
    icone: <Target className="w-5 h-5" />,
    cor: 'from-rose-500 to-rose-600',
    titulo: 'Baseado em ROI',
    descricao: 'Mostre o retorno que o cliente terá',
    calculo: (preco) => ({
      valor: `R$ ${(preco * 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      explicacao: 'Se gera 10x de retorno, cobrar 3x é "barato"'
    })
  },
  {
    tipo: 'ancoragem',
    icone: <Anchor className="w-5 h-5" />,
    cor: 'from-cyan-500 to-cyan-600',
    titulo: 'Ancoragem',
    descricao: 'Mostre primeiro um preço maior como referência',
    calculo: (preco) => ({
      valor: `De R$ ${(preco * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por R$ ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      explicacao: 'Âncora alta faz o preço real parecer uma oportunidade'
    })
  },
];

export function PrecificacaoBlock() {
  const { data, updateData, updateBlockProgress, markBlockComplete } = useConsulting();
  const [localData, setLocalData] = useState(data.precificacao);
  const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const hasModelo = localData.modelo.length > 0 ? 1 : 0;
    const hasEstrategia = localData.estrategia.length > 0 ? 1 : 0;
    const hasProdutos = localData.produtos.length > 0 ? 1 : 0;
    const hasMargemOuAncoragem = (localData.ancoragem.trim().length > 0 || localData.margemDesejada.trim().length > 0) ? 1 : 0;
    const progress = Math.round(((hasModelo + hasEstrategia + hasProdutos + hasMargemOuAncoragem) / 4) * 100);
    updateBlockProgress('precificacao', progress);
    
    if (progress === 100) {
      markBlockComplete('precificacao');
    }
  }, [localData, updateBlockProgress, markBlockComplete]);

  const handleChange = (field: string, value: string | ProdutoServico[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData('precificacao', newData);
  };

  const adicionarProduto = () => {
    const novoProduto: ProdutoServico = {
      id: crypto.randomUUID(),
      nome: '',
      precoAtual: 0,
      descricao: ''
    };
    const novosProdutos = [...localData.produtos, novoProduto];
    handleChange('produtos', novosProdutos);
    setProdutoSelecionado(novoProduto.id);
  };

  const atualizarProduto = (id: string, campo: keyof ProdutoServico, valor: string | number) => {
    const novosProdutos = localData.produtos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    );
    handleChange('produtos', novosProdutos);
  };

  const removerProduto = (id: string) => {
    const novosProdutos = localData.produtos.filter(p => p.id !== id);
    handleChange('produtos', novosProdutos);
    if (produtoSelecionado === id) {
      setProdutoSelecionado(novosProdutos[0]?.id || null);
    }
  };

  const produtoAtivo = localData.produtos.find(p => p.id === produtoSelecionado);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Defina a estratégia de precificação que maximize valor percebido e rentabilidade do negócio.
      </p>

      {/* Produtos/Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              Produtos/Serviços
            </div>
            <Button onClick={adicionarProduto} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cadastre seus produtos/serviços e veja sugestões de precificação para cada um.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {localData.produtos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2">Nenhum produto cadastrado</p>
              <Button onClick={adicionarProduto} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar primeiro produto
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de produtos */}
              <div className="flex flex-wrap gap-2">
                {localData.produtos.map((produto) => (
                  <button
                    key={produto.id}
                    onClick={() => setProdutoSelecionado(produto.id)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      produtoSelecionado === produto.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {produto.nome || 'Novo Produto'}
                    {produto.precoAtual > 0 && (
                      <span className="ml-2 text-sm opacity-70">
                        R$ {produto.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Editor do produto selecionado */}
              {produtoAtivo && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Detalhes do Produto</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removerProduto(produtoAtivo.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        placeholder="Ex: Consultoria Estratégica"
                        value={produtoAtivo.nome}
                        onChange={(e) => atualizarProduto(produtoAtivo.id, 'nome', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço Atual (R$)</Label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={produtoAtivo.precoAtual || ''}
                        onChange={(e) => atualizarProduto(produtoAtivo.id, 'precoAtual', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descreva brevemente o produto/serviço..."
                      value={produtoAtivo.descricao}
                      onChange={(e) => atualizarProduto(produtoAtivo.id, 'descricao', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* Sugestões de Precificação Visual */}
              {produtoAtivo && produtoAtivo.precoAtual > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    Sugestões de Precificação para {produtoAtivo.nome || 'este produto'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sugestoes.map((sugestao) => {
                      const resultado = sugestao.calculo(produtoAtivo.precoAtual);
                      return (
                        <div 
                          key={sugestao.tipo}
                          className="relative overflow-hidden rounded-xl border bg-card p-4 hover:shadow-lg transition-all"
                        >
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sugestao.cor}`} />
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${sugestao.cor} text-white`}>
                              {sugestao.icone}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-sm">{sugestao.titulo}</h5>
                              <p className="text-xs text-muted-foreground mt-0.5">{sugestao.descricao}</p>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-lg font-bold text-primary">{resultado.valor}</p>
                            <p className="text-xs text-muted-foreground mt-1">{resultado.explicacao}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modelo de Precificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            Modelo de Precificação
            <HelpTooltip fieldKey="modelo" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como você vai cobrar? A escolha impacta diretamente seu fluxo de caixa e escalabilidade.
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.modelo}
            onValueChange={(value) => handleChange('modelo', value)}
            className="grid gap-3"
          >
            {modelosPrecificacao.map((modelo) => (
              <div key={modelo.value} className="flex items-start space-x-3">
                <RadioGroupItem value={modelo.value} id={modelo.value} className="mt-1" />
                <Label htmlFor={modelo.value} className="flex-1 cursor-pointer">
                  <span className="font-medium">{modelo.label}</span>
                  <p className="text-sm text-muted-foreground">{modelo.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Estratégia de Preço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Estratégia de Preço
            <HelpTooltip fieldKey="estrategia" blockId="precificacao" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Posicionamento de preço define percepção de marca.
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.estrategia}
            onValueChange={(value) => handleChange('estrategia', value)}
            className="grid grid-cols-2 gap-3"
          >
            {estrategiasPrecificacao.map((estrategia) => (
              <div
                key={estrategia.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  localData.estrategia === estrategia.value
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground'
                }`}
                onClick={() => handleChange('estrategia', estrategia.value)}
              >
                <RadioGroupItem value={estrategia.value} id={estrategia.value} className="sr-only" />
                <Label htmlFor={estrategia.value} className="cursor-pointer">
                  <span className="font-medium">{estrategia.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{estrategia.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ancoragem e Margem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚓</span>
              Ancoragem de Preço
              <HelpTooltip fieldKey="ancoragem" blockId="precificacao" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Mostrar primeiro o pacote Enterprise de R$15k..."
              value={localData.ancoragem}
              onChange={(e) => handleChange('ancoragem', e.target.value)}
              className="resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Margem Desejada
              <HelpTooltip fieldKey="margemDesejada" blockId="precificacao" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Ex: 45% de margem bruta"
              value={localData.margemDesejada}
              onChange={(e) => handleChange('margemDesejada', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Referências: SaaS 70-80%, Consultoria 40-60%, Varejo 30-50%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
