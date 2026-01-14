import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ConsultingData, BlockStatus, Project } from '@/types/consulting';
import { generateDemoData } from '@/utils/demoDataGenerator';
import { supabase } from '@/integrations/supabase/client';
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
  createDemoProject: (params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number }) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  goToProjectList: () => void;
}

const ConsultingContext = createContext<ConsultingContextType | undefined>(undefined);

export function ConsultingProvider({ children }: { children: React.ReactNode }) {
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
      const { data: dbProjects, error } = await supabase
        .from('consulting_projects')
        .select('*')
        .order('created_at', { ascending: false });

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
            },
            data: projectData as ConsultingData,
            blocks: (dbProject.blocks as unknown as BlockStatus[]) || initialBlocks.map(b => ({ ...b })),
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

  // Auto-save when project data changes
  useEffect(() => {
    if (currentProjectData && !isLoading) {
      const timeoutId = setTimeout(() => {
        saveProject(currentProjectData);
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [currentProjectData, isLoading]);

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
      dataCriacao: new Date().toISOString()
    };
    const newProjectData: ProjectData = {
      project: newProject,
      data: { ...initialData, clienteNome: projectData.nomeEmpresa },
      blocks: initialBlocks.map(b => ({ ...b }))
    };
    
    setProjectsData(prev => [...prev, newProjectData]);
    
    // Save to database immediately
    await saveProject(newProjectData);
    toast.success('Projeto criado com sucesso!');
  }, []);

  const createDemoProject = useCallback(async (params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number }) => {
    const { project: projectData, data: demoData } = generateDemoData(params);
    
    const demoProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString()
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
    
    // Save to database immediately
    await saveProject(newProjectData);
    toast.success('Projeto demo criado com sucesso!');
  }, []);

  const selectProject = useCallback((id: string) => {
    setCurrentProjectId(id);
    setCurrentBlock('goldenCircle');
  }, []);

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
      createDemoProject,
      selectProject,
      deleteProject,
      goToProjectList,
    }}>
      {children}
    </ConsultingContext.Provider>
  );
}

export function useConsulting() {
  const context = useContext(ConsultingContext);
  if (context === undefined) {
    throw new Error('useConsulting must be used within a ConsultingProvider');
  }
  return context;
}
