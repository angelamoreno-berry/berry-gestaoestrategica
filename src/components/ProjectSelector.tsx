import { useState } from 'react';
import { useConsulting } from '@/contexts/ConsultingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Users, Mail, TrendingUp, Briefcase, Trash2 } from 'lucide-react';
import { Project } from '@/types/consulting';

const segmentos = [
  'Agronegócio',
  'Alimentação',
  'Atacado e Distribuição',
  'Automotivo',
  'Engenharia e Construção',
  'Educação',
  'Energia Solar',
  'Indústria',
  'Logística',
  'Negócios Digitais',
  'Saúde e Bem Estar',
  'Serviços',
  'Supermercado',
  'Tecnologia',
  'Varejo',
  'Outro'
];

export function ProjectSelector() {
  const { projects, currentProject, createProject, selectProject, deleteProject } = useConsulting();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    responsavel: '',
    segmento: '',
    faturamentoMedio: '',
    quantidadeColaboradores: '',
    emailResponsavel: ''
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
            Gerencie seus projetos de consultoria e acompanhe o diagnóstico de maturidade de cada empresa
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
                  <Select
                    value={formData.segmento}
                    onValueChange={(value) => setFormData({ ...formData, segmento: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segmentos.map((seg) => (
                        <SelectItem key={seg} value={seg}>
                          {seg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>
        )}
      </div>
    </div>
  );
}
