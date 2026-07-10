import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ConsultingData, BlockStatus, Project, SimulationType } from '@/types/consulting';
import { generateDemoData } from '@/utils/demoDataGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { initialFinancialData, financialBlocks } from '@/types/financialSimulation';
import { toast } from 'sonner';

const initialData: ConsultingData = {
  clienteNome: '',
  consultorNome: '',
  dataInicio: new Date().toISOString().split('T')[0],
  diagnostico: {
    pessoas: { area: 'Pessoas', level: 0, notes: '' },
    processos: { area: 'Processos', level: 0, notes: '' },
    financas: { area: 'Finanças', level: 0, notes: '' },
    mercado: { area: 'Mercado', level: 0, notes: '' },
  },
  identidade: {
    visao: '',
    missao: '',
    valores: [],
    posicionamento: '',
  },
  concorrentes: {
    concorrentes: [],
    principais: [],
    diferenciais: [],
    publicoAlvo: '',
    propostaValor: '',
  },
  icp: {
    caracteristicasDemograficas: '',
    descricao: '',
    segmentos: [],
    dores: [],
    dpisos: [],
    desejos: [],
    necessidades: [],
    comportamento: '',
    ondeEncontrar: '',
  },
  estrategiasValor: {
    novasOfertas: [],
    novosServicos: [],
    pacotes: [],
  },
  precificacao: {
    modelo: '',
    estrategia: '',
    ancoragem: '',
    margemDesejada: '',
    produtos: [],
  },
  motoresCrescimento: {
    motoresPrincipais: [],
    canais: [],
    metricas: [],
  },
  organograma: {
    cargos: [],
  },
  processos: {
    processos: [],
    lista: [],
  },
  financeiro: {
    despesasFixas: 0,
    despesasVariaveis: 0,
    faturamentoAtual: 0,
    faturamentoMensal: 0,
    margemAtual: 0,
    margemLucro: 0,
    custoFixoMensal: 0,
    pontoEquilibrio: 0,
    metaFaturamento: 0,
    ticketMedio: 0,
    quantidadeClientes: 0,
    cac: 0,
    ltv: 0,
    prazoMedioRecebimento: 0,
    prazoMedioPagamento: 0,
    capitalGiro: 0,
    reservaEmergencia: 0,
    dividas: [],
    totalDividas: 0,
    comprometimentoReceita: 0,
    oportunidades: [],
    investimentos: [],
    riscos: [],
  },
  swot: {
    forcas: [],
    fraquezas: [],
    oportunidades: [],
    ameacas: [],
    horizontes: {
      curto: '',
      medio: '',
      longo: '',
    },
  },
  goldenCircle: {
    why: '',
    how: '',
    what: '',
  },
  swotPessoal: {
    forcas: [],
    fraquezas: [],
    oportunidades: [],
    ameacas: [],
  },
  agendaCEO: {
    prioridades: [],
    alocacaoTempo: [],
    rotinas: [],
    delegacoes: [],
    focoTrimestre: '',
  },
};

const initialBlocks: BlockStatus[] = [
  { id: 'goldenCircle', name: 'Golden Circle', icon: '⭕', completed: false, progress: 0 },
  { id: 'identidade', name: 'Visão, Missão e Valores', icon: '🎯', completed: false, progress: 0 },
  { id: 'swot', name: 'SWOT e Horizontes', icon: '🧭', completed: false, progress: 0 },
  { id: 'diagnostico', name: 'Diagnóstico de Maturidade', icon: '📊', completed: false, progress: 0 },
  { id: 'concorrentes', name: 'Análise de Mercado', icon: '🔍', completed: false, progress: 0 },
  { id: 'icp', name: 'Definição de ICP', icon: '👤', completed: false, progress: 0 },
  { id: 'estrategiasValor', name: 'Estratégias de Valor', icon: '💎', completed: false, progress: 0 },
  { id: 'precificacao', name: 'Modelo de Precificação', icon: '💰', completed: false, progress: 0 },
  { id: 'motoresCrescimento', name: 'Motores de Crescimento', icon: '🚀', completed: false, progress: 0 },
  { id: 'organograma', name: 'Organograma', icon: '🏢', completed: false, progress: 0 },
  { id: 'processos', name: 'Processos Essenciais', icon: '⚙️', completed: false, progress: 0 },
  { id: 'financeiro', name: 'Análise Financeira', icon: '📈', completed: false, progress: 0 },
  { id: 'swotPessoal', name: 'SWOT Pessoal', icon: '🪞', completed: false, progress: 0 },
  { id: 'agendaCEO', name: 'Agenda Estratégica', icon: '📅', completed: false, progress: 0 },
];

interface ProjectData {
  project: Project;
  data: ConsultingData;
  blocks: BlockStatus[];
}

interface DbProjectData extends ConsultingData {
  segmento?: string;
  faturamentoMedio?: number;
  quantidadeColaboradores?: number;
  responsavel?: string;
  emailResponsavel?: string;
}

interface ConsultingContextType {
  data: ConsultingData;
  blocks: BlockStatus[];
  currentBlock: string;
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  setCurrentBlock: (id: string) => void;
  updateData: <K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => void;
  updateBlockProgress: (id: string, progress: number) => void;
  markBlockComplete: (id: string) => void;
  getTotalProgress: () => number;
  resetAll: () => void;
  createProject: (projectData: Omit<Project, 'id' | 'dataCriacao'>) => void;
  updateProjectInfo: (id: string, info: Partial<Pick<Project, 'nomeEmpresa' | 'responsavel' | 'segmento' | 'faturamentoMedio' | 'quantidadeColaboradores' | 'emailResponsavel'>>, newCreatorId?: string | null) => Promise<void>;
  createDemoProject: (params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number; simulationType?: SimulationType }) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  goToProjectList: () => void;
}

const ConsultingContext = createContext<ConsultingContextType | undefined>(undefined);

export function ConsultingProvider({ children }: { children: React.ReactNode }) {
  const { canEdit, profile } = useAuth();
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState('goldenCircle');
  const [isLoading, setIsLoading] = useState(true);

  const currentProjectData = projectsData.find(p => p.project.id === currentProjectId);
  const data = currentProjectData?.data || initialData;
  const blocks = currentProjectData?.blocks || initialBlocks;
  const projects = projectsData.map(p => p.project);
  const currentProject = currentProjectData?.project || null;

  // Load projects from database on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      // Tenta carregar com o join do criador (profiles). Se falhar (ex.: migração
      // created_by ainda não aplicada), refaz sem o join — os projetos nunca
      // devem sumir da tela por causa desse campo.
      let { data: dbProjects, error } = await supabase
        .from('consulting_projects')
        .select('*, creator:profiles!consulting_projects_created_by_fkey(id, name, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Join com profiles indisponível, carregando sem "Criado por":', error.message);
        const fallback = await supabase
          .from('consulting_projects')
          .select('*')
          .order('created_at', { ascending: false });
        dbProjects = fallback.data as typeof dbProjects;
        error = fallback.error;
      }

      if (error) {
        console.error('Error loading projects:', error);
        toast.error('Erro ao carregar projetos');
        return;
      }

      if (dbProjects) {
        const loadedProjects: ProjectData[] = dbProjects.map(dbProject => {
          const rawData = dbProject.data as Record<string, unknown> | null;
          const projectData: DbProjectData = rawData ? {
            ...initialData,
            ...rawData as unknown as Partial<ConsultingData>,
            segmento: (rawData.segmento as string) || '',
            faturamentoMedio: (rawData.faturamentoMedio as number) || 0,
            quantidadeColaboradores: (rawData.quantidadeColaboradores as number) || 0,
            responsavel: (rawData.responsavel as string) || '',
            emailResponsavel: (rawData.emailResponsavel as string) || '',
          } : { ...initialData, segmento: '', faturamentoMedio: 0, quantidadeColaboradores: 0, responsavel: '', emailResponsavel: '' };
          
            const projectType = ((rawData?.projectType as string) || 'real') as 'real' | 'simulation';
            const simulationType = (rawData?.simulationType as string) as 'completa' | 'financeira' | undefined;
            const isFinancial = simulationType === 'financeira';
            
            return {
              project: {
                id: dbProject.id,
                nomeEmpresa: dbProject.name,
                segmento: projectData.segmento || '',
                faturamentoMedio: projectData.faturamentoMedio || 0,
                quantidadeColaboradores: projectData.quantidadeColaboradores || 0,
                responsavel: projectData.responsavel || '',
                emailResponsavel: projectData.emailResponsavel || '',
                dataCriacao: dbProject.created_at,
                projectType,
                simulationType,
                createdById: (dbProject as any).created_by ?? null,
                createdByName: (dbProject as any).creator?.name ?? null,
                createdByEmail: (dbProject as any).creator?.email ?? null,
              },
              data: projectData as ConsultingData,
              blocks: (dbProject.blocks as unknown as BlockStatus[]) || (isFinancial ? financialBlocks.map(b => ({ ...b })) : initialBlocks.map(b => ({ ...b }))),
            };
        });
        setProjectsData(loadedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async (projectData: ProjectData) => {
    try {
      const dataToSave = {
        ...projectData.data,
        segmento: projectData.project.segmento,
        faturamentoMedio: projectData.project.faturamentoMedio,
        quantidadeColaboradores: projectData.project.quantidadeColaboradores,
        responsavel: projectData.project.responsavel,
        emailResponsavel: projectData.project.emailResponsavel,
        projectType: projectData.project.projectType,
        simulationType: projectData.project.simulationType,
      };

      const { error } = await supabase
        .from('consulting_projects')
        .upsert([{
          id: projectData.project.id,
          name: projectData.project.nomeEmpresa,
          company: projectData.project.nomeEmpresa,
          data: JSON.parse(JSON.stringify(dataToSave)),
          blocks: JSON.parse(JSON.stringify(projectData.blocks)),
        }]);

      if (error) {
        console.error('Error saving project:', error);
        toast.error('Erro ao salvar projeto');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Erro ao salvar projeto');
    }
  };

  // Auto-save when project data changes.
  // Leitores (viewers) nunca disparam gravação — evita "Erro ao salvar" para
  // quem só tem acesso de consulta (o RLS já bloqueia no banco; aqui evitamos
  // a tentativa e o toast de erro desnecessário).
  useEffect(() => {
    if (currentProjectData && !isLoading) {
      const isSimulation = (currentProjectData.project.projectType || 'real') === 'simulation';
      if (!canEdit(currentProjectData.project.id, isSimulation)) return;

      const timeoutId = setTimeout(() => {
        saveProject(currentProjectData);
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [currentProjectData, isLoading, canEdit]);

  const updateData = useCallback(<K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { ...pd, data: { ...pd.data, [key]: value } }
        : pd
    ));
  }, [currentProjectId]);

  const updateBlockProgress = useCallback((id: string, progress: number) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { 
            ...pd, 
            blocks: pd.blocks.map(block => 
              block.id === id ? { ...block, progress: Math.min(100, Math.max(0, progress)) } : block
            )
          }
        : pd
    ));
  }, [currentProjectId]);

  const markBlockComplete = useCallback((id: string) => {
    if (!currentProjectId) return;
    setProjectsData(prev => prev.map(pd => 
      pd.project.id === currentProjectId 
        ? { 
            ...pd, 
            blocks: pd.blocks.map(block => 
              block.id === id ? { ...block, completed: true, progress: 100 } : block
            )
          }
        : pd
    ));
  }, [currentProjectId]);

  const getTotalProgress = useCallback(() => {
    const total = blocks.reduce((acc, block) => acc + block.progress, 0);
    return Math.round(total / blocks.length);
  }, [blocks]);

  const resetAll = useCallback(() => {
    setProjectsData([]);
    setCurrentProjectId(null);
    setCurrentBlock('goldenCircle');
  }, []);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'dataCriacao'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
      createdById: profile?.id ?? null,
      createdByName: profile?.name ?? null,
      createdByEmail: profile?.email ?? null,
    };
    const newProjectData: ProjectData = {
      project: newProject,
      data: { ...initialData, clienteNome: projectData.nomeEmpresa },
      blocks: initialBlocks.map(b => ({ ...b }))
    };
    
    setProjectsData(prev => [...prev, newProjectData]);
    
    // Save to database immediately (created_by é preenchido pelo banco via DEFAULT auth.uid())
    await saveProject(newProjectData);
    toast.success('Projeto criado com sucesso!');
  }, [profile]);

  const updateProjectInfo = useCallback(async (
    id: string,
    info: Partial<Pick<Project, 'nomeEmpresa' | 'responsavel' | 'segmento' | 'faturamentoMedio' | 'quantidadeColaboradores' | 'emailResponsavel'>>,
    newCreatorId?: string | null
  ) => {
    const target = projectsData.find(pd => pd.project.id === id);
    if (!target) return;

    const updatedProject: Project = { ...target.project, ...info };
    const updatedData = { ...target.data, clienteNome: updatedProject.nomeEmpresa };
    const updated: ProjectData = { ...target, project: updatedProject, data: updatedData };

    try {
      // Atualiza dados principais (name + JSONB via saveProject)
      await saveProject(updated);

      // Alteração de criador: apenas admins (guard também aplicado no banco)
      if (newCreatorId !== undefined && newCreatorId !== target.project.createdById) {
        const { data: updatedRow, error } = await supabase
          .from('consulting_projects')
          .update({ created_by: newCreatorId })
          .eq('id', id)
          .select('created_by, creator:profiles!consulting_projects_created_by_fkey(id, name, email)')
          .single();
        if (error) {
          console.error('Error updating creator:', error);
          toast.error('Erro ao alterar o criador do projeto. Verifique se a migração created_by foi aplicada no banco.');
          return;
        }
        updatedProject.createdById = (updatedRow as any)?.created_by ?? null;
        updatedProject.createdByName = (updatedRow as any)?.creator?.name ?? null;
        updatedProject.createdByEmail = (updatedRow as any)?.creator?.email ?? null;
      }

      setProjectsData(prev => prev.map(pd => pd.project.id === id
        ? { ...pd, project: { ...updatedProject }, data: updatedData }
        : pd
      ));
      toast.success('Projeto atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Erro ao atualizar projeto');
    }
  }, [projectsData]);

  const createDemoProject = useCallback(async (params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number; simulationType?: SimulationType }) => {
    const isFinancial = params.simulationType === 'financeira';
    
    if (isFinancial) {
      // Create financial simulation project
      const demoProject: Project = {
        id: crypto.randomUUID(),
        nomeEmpresa: `${params.segmento} (Financeiro)`,
        responsavel: 'Simulação',
        segmento: params.segmento,
        faturamentoMedio: params.faturamentoMedio,
        quantidadeColaboradores: params.quantidadeColaboradores,
        emailResponsavel: 'simulacao@demo.com',
        dataCriacao: new Date().toISOString(),
        projectType: 'simulation',
        simulationType: 'financeira',
      };

      const demoBlocks: BlockStatus[] = financialBlocks.map(b => ({ ...b }));

      // Generate demo financial data
      const fat = params.faturamentoMedio || 100000;
      const demoFinancialData = {
        ...initialFinancialData,
        maturidadeProcessos: { padronizacao: 3, rotinas: 2, controles: 2, previsibilidade: 3, usoDeDados: 2, notes: '' },
        governancaFinanceira: { separacaoCpfCnpj: 3, disciplinaGestao: 2, tomadaDecisao: 3, proLabore: 2, planejamentoTributario: 2, notes: '' },
        analiseFinanceira: { faturamentoMensal: fat, despesasFixas: Math.round(fat * 0.45), despesasVariaveis: Math.round(fat * 0.25), lucroLiquido: Math.round(fat * 0.3), margemLiquida: 30, ticketMedio: Math.round(fat / 80), quantidadeClientes: 80, notes: '' },
        fluxoCaixa: { saldoAtual: Math.round(fat * 0.8), entradasPrevistas30d: fat, saidasPrevistas30d: Math.round(fat * 0.7), entradasPrevistas60d: Math.round(fat * 1.05), saidasPrevistas60d: Math.round(fat * 0.72), entradasPrevistas90d: Math.round(fat * 1.1), saidasPrevistas90d: Math.round(fat * 0.75), notes: '' },
      };

      const newProjectData: ProjectData = {
        project: demoProject,
        data: { ...initialData, financialSimulation: demoFinancialData } as any,
        blocks: demoBlocks,
      };

      setProjectsData(prev => [...prev, newProjectData]);
      setCurrentProjectId(demoProject.id);
      setCurrentBlock('maturidadeProcessos');
      await saveProject(newProjectData);
      toast.success('Simulação financeira criada com sucesso!');
    } else {
      const { project: projectData, data: demoData } = generateDemoData(params);
      
      const demoProject: Project = {
        ...projectData,
        id: crypto.randomUUID(),
        dataCriacao: new Date().toISOString(),
        simulationType: 'completa',
      };

      const demoBlocks: BlockStatus[] = initialBlocks.map(b => ({
        ...b,
        completed: true,
        progress: 100
      }));

      const newProjectData: ProjectData = {
        project: demoProject,
        data: demoData,
        blocks: demoBlocks
      };

      setProjectsData(prev => [...prev, newProjectData]);
      setCurrentProjectId(demoProject.id);
      setCurrentBlock('goldenCircle');
      await saveProject(newProjectData);
      toast.success('Projeto demo criado com sucesso!');
    }
  }, []);

  const selectProject = useCallback((id: string) => {
    const project = projectsData.find(p => p.project.id === id);
    setCurrentProjectId(id);
    const isFinancial = project?.project.simulationType === 'financeira';
    setCurrentBlock(isFinancial ? 'maturidadeProcessos' : 'goldenCircle');
  }, [projectsData]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('consulting_projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        toast.error('Erro ao excluir projeto');
        return;
      }

      setProjectsData(prev => prev.filter(pd => pd.project.id !== id));
      if (currentProjectId === id) {
        setCurrentProjectId(null);
      }
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erro ao excluir projeto');
    }
  }, [currentProjectId]);

  const goToProjectList = useCallback(() => {
    setCurrentProjectId(null);
  }, []);

  return (
    <ConsultingContext.Provider value={{
      data,
      blocks,
      currentBlock,
      projects,
      currentProject,
      isLoading,
      setCurrentBlock,
      updateData,
      updateBlockProgress,
      markBlockComplete,
      getTotalProgress,
      resetAll,
      createProject,
      updateProjectInfo,
      createDemoProject,
      selectProject,
      deleteProject,
      goToProjectList,
    }}>
      {children}
    </ConsultingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConsulting() {
  const context = useContext(ConsultingContext);
  if (context === undefined) {
    throw new Error('useConsulting must be used within a ConsultingProvider');
  }
  return context;
}
