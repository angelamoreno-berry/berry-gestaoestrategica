import { useState } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building2, Users, Mail, TrendingUp, Briefcase, Trash2, Sparkles, Presentation } from 'lucide-react';
import { openSalesPresentationInNewTab } from '@/utils/salesPresentationGenerator';
import { Project } from '@/types/consulting';

export function ProjectSelector() {
  const { projects, currentProject, createProject, createDemoProject, selectProject, deleteProject } = useConsulting();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    responsavel: '',
    segmento: '',
    faturamentoMedio: '',
    quantidadeColaboradores: '',
    emailResponsavel: ''
  });
  const [demoFormData, setDemoFormData] = useState({
    segmento: '',
    faturamentoMedio: '',
    quantidadeColaboradores: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      nomeEmpresa: formData.nomeEmpresa,
      responsavel: formData.responsavel,
      segmento: formData.segmento,
      faturamentoMedio: parseFloat(formData.faturamentoMedio) || 0,
      quantidadeColaboradores: parseInt(formData.quantidadeColaboradores) || 0,
      emailResponsavel: formData.emailResponsavel
    });
    setFormData({
      nomeEmpresa: '',
      responsavel: '',
      segmento: '',
      faturamentoMedio: '',
      quantidadeColaboradores: '',
      emailResponsavel: ''
    });
    setIsDialogOpen(false);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDemoProject({
      segmento: demoFormData.segmento,
      faturamentoMedio: parseFloat(demoFormData.faturamentoMedio) || 100000,
      quantidadeColaboradores: parseInt(demoFormData.quantidadeColaboradores) || 10
    });
    setDemoFormData({
      segmento: '',
      faturamentoMedio: '',
      quantidadeColaboradores: ''
    });
    setIsDemoDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ferramenta de Estruturação
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie e estruture o essencial da gestão de cada empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                currentProject?.id === project.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => selectProject(project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.nomeEmpresa}</CardTitle>
                      <CardDescription>{project.segmento}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{project.responsavel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{project.emailResponsavel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{formatCurrency(project.faturamentoMedio)}/mês</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.quantidadeColaboradores} colaboradores</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Criado em {new Date(project.dataCriacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center min-h-[280px]">
                <div className="text-center p-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Novo Projeto</h3>
                  <p className="text-sm text-muted-foreground">Adicione uma nova empresa</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Cadastrar Nova Empresa
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                  <Input
                    id="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                    placeholder="Ex: Empresa XYZ Ltda"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável *</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailResponsavel">E-mail do Responsável *</Label>
                  <Input
                    id="emailResponsavel"
                    type="email"
                    value={formData.emailResponsavel}
                    onChange={(e) => setFormData({ ...formData, emailResponsavel: e.target.value })}
                    placeholder="email@empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segmento">Segmento de Atuação *</Label>
                  <Input
                    id="segmento"
                    value={formData.segmento}
                    onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                    placeholder="Ex: Clínica de estética, Loja de roupas femininas, Consultoria de TI..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">Seja específico para obter insights mais relevantes</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faturamentoMedio">Faturamento Médio Mensal</Label>
                    <Input
                      id="faturamentoMedio"
                      type="number"
                      value={formData.faturamentoMedio}
                      onChange={(e) => setFormData({ ...formData, faturamentoMedio: e.target.value })}
                      placeholder="R$ 0,00"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidadeColaboradores">Nº de Colaboradores</Label>
                    <Input
                      id="quantidadeColaboradores"
                      type="number"
                      value={formData.quantidadeColaboradores}
                      onChange={(e) => setFormData({ ...formData, quantidadeColaboradores: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Criar Projeto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum projeto cadastrado</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu primeiro projeto de consultoria</p>
            <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Criar Projeto Demo (100% preenchido)
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Personalizar Projeto Demo
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDemoSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="demoSegmento">Segmento de Atuação *</Label>
                    <Input
                      id="demoSegmento"
                      value={demoFormData.segmento}
                      onChange={(e) => setDemoFormData({ ...demoFormData, segmento: e.target.value })}
                      placeholder="Ex: Clínica de estética, Loja de roupas femininas..."
                      required
                    />
                    <p className="text-xs text-muted-foreground">Seja específico para obter insights personalizados</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demoFaturamento">Faturamento Médio Mensal (R$)</Label>
                    <Input
                      id="demoFaturamento"
                      type="number"
                      value={demoFormData.faturamentoMedio}
                      onChange={(e) => setDemoFormData({ ...demoFormData, faturamentoMedio: e.target.value })}
                      placeholder="Ex: 100000"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demoColaboradores">Quantidade de Colaboradores</Label>
                    <Input
                      id="demoColaboradores"
                      type="number"
                      value={demoFormData.quantidadeColaboradores}
                      onChange={(e) => setDemoFormData({ ...demoFormData, quantidadeColaboradores: e.target.value })}
                      placeholder="Ex: 10"
                      min="0"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    O projeto será preenchido com dados personalizados para o segmento e porte selecionados.
                  </p>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDemoDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={!demoFormData.segmento}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Demo
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Botão discreto para apresentação de vendas */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={openSalesPresentationInNewTab}
            className="text-muted-foreground hover:text-foreground text-xs gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Presentation className="h-3.5 w-3.5" />
            Apresentação de Vendas
          </Button>
        </div>
      </div>
    </div>
  );
}
