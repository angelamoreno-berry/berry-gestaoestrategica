import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsulting } from '@/contexts/ConsultingContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Building2, Users, Mail, TrendingUp, Briefcase, Trash2, Sparkles, Presentation, ArrowLeft, BarChart3, LayoutGrid, Settings2, UserCircle2, Search, EyeOff } from 'lucide-react';
import { openSalesPresentationInNewTab } from '@/utils/salesPresentationGenerator';
import { Project, ProjectType, SimulationType } from '@/types/consulting';

interface ProjectSelectorProps {
  projectType: ProjectType;
}

interface ProfileOption {
  id: string;
  name: string | null;
  email: string;
}

const emptyForm = {
  nomeEmpresa: '',
  responsavel: '',
  segmento: '',
  faturamentoMedio: '',
  quantidadeColaboradores: '',
  emailResponsavel: ''
};

export function ProjectSelector({ projectType }: ProjectSelectorProps) {
  const navigate = useNavigate();
  const { projects, currentProject, createProject, updateProjectInfo, createDemoProject, selectProject, deleteProject } = useConsulting();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [demoFormData, setDemoFormData] = useState({
    segmento: '',
    faturamentoMedio: '',
    quantidadeColaboradores: ''
  });
  const [simulationType, setSimulationType] = useState<SimulationType>('completa');
  const [searchTerm, setSearchTerm] = useState('');
  const [discreetMode, setDiscreetMode] = useState<boolean>(() => localStorage.getItem('berry-discreet-mode') === '1');

  const toggleDiscreetMode = (value: boolean) => {
    setDiscreetMode(value);
    localStorage.setItem('berry-discreet-mode', value ? '1' : '0');
  };

  // Edição de projeto (engrenagem)
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editFormData, setEditFormData] = useState({ ...emptyForm });
  const [editCreatorId, setEditCreatorId] = useState<string>('');
  const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      nomeEmpresa: formData.nomeEmpresa,
      responsavel: formData.responsavel,
      segmento: formData.segmento,
      faturamentoMedio: parseFloat(formData.faturamentoMedio) || 0,
      quantidadeColaboradores: parseInt(formData.quantidadeColaboradores) || 0,
      emailResponsavel: formData.emailResponsavel,
      projectType,
    });
    setFormData({ ...emptyForm });
    setIsDialogOpen(false);
  };

  const openEditDialog = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditFormData({
      nomeEmpresa: project.nomeEmpresa,
      responsavel: project.responsavel,
      segmento: project.segmento,
      faturamentoMedio: String(project.faturamentoMedio || ''),
      quantidadeColaboradores: String(project.quantidadeColaboradores || ''),
      emailResponsavel: project.emailResponsavel,
    });
    setEditCreatorId(project.createdById || '');
    // Lista de usuários para o admin atribuir o criador
    if (isAdmin && profileOptions.length === 0) {
      const { data } = await supabase.from('profiles').select('id, name, email').order('email');
      if (data) setProfileOptions(data as ProfileOption[]);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    await updateProjectInfo(
      editingProject.id,
      {
        nomeEmpresa: editFormData.nomeEmpresa,
        responsavel: editFormData.responsavel,
        segmento: editFormData.segmento,
        faturamentoMedio: parseFloat(editFormData.faturamentoMedio) || 0,
        quantidadeColaboradores: parseInt(editFormData.quantidadeColaboradores) || 0,
        emailResponsavel: editFormData.emailResponsavel,
      },
      isAdmin ? (editCreatorId || null) : undefined
    );
    setEditingProject(null);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDemoProject({
      segmento: demoFormData.segmento,
      faturamentoMedio: parseFloat(demoFormData.faturamentoMedio) || 100000,
      quantidadeColaboradores: parseInt(demoFormData.quantidadeColaboradores) || 10,
      simulationType,
    });
    setDemoFormData({
      segmento: '',
      faturamentoMedio: '',
      quantidadeColaboradores: ''
    });
    setSimulationType('completa');
    setIsDemoDialogOpen(false);
  };

  const { isAdmin, isBerry, canEdit } = useAuth();
  const isSimulation = projectType === 'simulation';
  const canCreate = isSimulation ? isBerry : isAdmin;
  const canDelete = isSimulation ? isBerry : isAdmin;
  const filteredProjects = projects.filter(p => (p.projectType || 'real') === projectType);

  // Busca por nome da empresa (ignora maiúsculas e acentos)
  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchedProjects = searchTerm.trim()
    ? filteredProjects.filter(p => normalize(p.nomeEmpresa).includes(normalize(searchTerm)))
    : filteredProjects;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const projectFormFields = (
    data: typeof emptyForm,
    setData: React.Dispatch<React.SetStateAction<typeof emptyForm>>,
    idPrefix: string
  ) => (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}NomeEmpresa`}>Nome da Empresa *</Label>
        <Input
          id={`${idPrefix}NomeEmpresa`}
          value={data.nomeEmpresa}
          onChange={(e) => setData({ ...data, nomeEmpresa: e.target.value })}
          placeholder="Ex: Empresa XYZ Ltda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}Responsavel`}>Responsável *</Label>
        <Input
          id={`${idPrefix}Responsavel`}
          value={data.responsavel}
          onChange={(e) => setData({ ...data, responsavel: e.target.value })}
          placeholder="Nome do responsável"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}EmailResponsavel`}>E-mail do Responsável *</Label>
        <Input
          id={`${idPrefix}EmailResponsavel`}
          type="email"
          value={data.emailResponsavel}
          onChange={(e) => setData({ ...data, emailResponsavel: e.target.value })}
          placeholder="email@empresa.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}Segmento`}>Segmento de Atuação *</Label>
        <Input
          id={`${idPrefix}Segmento`}
          value={data.segmento}
          onChange={(e) => setData({ ...data, segmento: e.target.value })}
          placeholder="Ex: Clínica de estética, Loja de roupas femininas, Consultoria de TI..."
          required
        />
        <p className="text-xs text-muted-foreground">Seja específico para obter insights mais relevantes</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}FaturamentoMedio`}>Faturamento Médio Mensal</Label>
          <Input
            id={`${idPrefix}FaturamentoMedio`}
            type="number"
            value={data.faturamentoMedio}
            onChange={(e) => setData({ ...data, faturamentoMedio: e.target.value })}
            placeholder="R$ 0,00"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}QuantidadeColaboradores`}>Nº de Colaboradores</Label>
          <Input
            id={`${idPrefix}QuantidadeColaboradores`}
            type="number"
            value={data.quantidadeColaboradores}
            onChange={(e) => setData({ ...data, quantidadeColaboradores: e.target.value })}
            placeholder="0"
            min="0"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {isSimulation ? 'Simulação de Projetos' : 'Projetos Reais'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isSimulation 
              ? 'Simule projetos com dados gerados para demonstrações e testes'
              : 'Gerencie e estruture o essencial da gestão de cada empresa'}
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar empresa pelo nome..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Switch id="discreet-mode" checked={discreetMode} onCheckedChange={toggleDiscreetMode} />
            <Label htmlFor="discreet-mode" className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1.5">
              <EyeOff className="h-3.5 w-3.5" />
              Modo discreto (oculta dados sensíveis dos cards)
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {!isSimulation && canCreate && !searchTerm.trim() && (
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
                {projectFormFields(formData, setFormData, 'new')}

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
          )}

          {isSimulation && canCreate && !searchTerm.trim() && (
            <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center min-h-[280px]">
                  <div className="text-center p-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Nova Simulação</h3>
                    <p className="text-sm text-muted-foreground">Gere um projeto demo 100% preenchido</p>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Personalizar Simulação
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDemoSubmit} className="space-y-4 mt-4">
                  {/* Simulation Type Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Simulação</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSimulationType('completa')}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          simulationType === 'completa'
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <LayoutGrid className={`w-6 h-6 mb-2 ${simulationType === 'completa' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="font-semibold text-sm">Gestão Completa</p>
                        <p className="text-xs text-muted-foreground mt-1">14 módulos de gestão estratégica</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulationType('financeira')}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          simulationType === 'financeira'
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <BarChart3 className={`w-6 h-6 mb-2 ${simulationType === 'financeira' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="font-semibold text-sm">Gestão Financeira</p>
                        <p className="text-xs text-muted-foreground mt-1">11 módulos focados em finanças</p>
                      </button>
                    </div>
                  </div>

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
                      Gerar Simulação
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {searchedProjects.map((project) => (
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
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{project.nomeEmpresa}</CardTitle>
                        {!isSimulation && canEdit(project.id, false) && (
                          <button
                            type="button"
                            title="Editar dados da empresa"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => openEditDialog(project, e)}
                          >
                            <Settings2 className="h-4 w-4" />
                          </button>
                        )}
                        {project.simulationType === 'financeira' && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Financeiro</span>
                        )}
                      </div>
                      <CardDescription>{project.segmento}</CardDescription>
                    </div>
                  </div>
                  {canDelete && (
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
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {discreetMode ? (
                  <p className="text-xs text-muted-foreground italic">Dados ocultos — modo discreto ativo</p>
                ) : (
                  <>
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
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Criado em {new Date(project.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                      {!isSimulation && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1" title={project.createdByEmail || undefined}>
                          <UserCircle2 className="h-3.5 w-3.5" />
                          Criado por: {project.createdByName || project.createdByEmail || '—'}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de edição de projeto */}
        <Dialog open={!!editingProject} onOpenChange={(open) => { if (!open) setEditingProject(null); }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Editar Dados da Empresa
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              {projectFormFields(editFormData, setEditFormData, 'edit')}

              {isAdmin && (
                <div className="space-y-2">
                  <Label>Criado por</Label>
                  <Select value={editCreatorId || 'none'} onValueChange={(v) => setEditCreatorId(v === 'none' ? '' : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Não atribuído —</SelectItem>
                      {profileOptions.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name ? `${p.name} (${p.email})` : p.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Somente administradores podem alterar este campo</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingProject(null)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {searchedProjects.length === 0 && !isSimulation && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm.trim() ? 'Nenhuma empresa encontrada' : 'Nenhum projeto cadastrado'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm.trim() ? 'Ajuste o termo de busca' : 'Comece criando seu primeiro projeto de consultoria'}
            </p>
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
