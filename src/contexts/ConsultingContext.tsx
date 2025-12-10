import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConsultingData, BlockStatus, Project } from '@/types/consulting';

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
    diferenciais: [],
    publicoAlvo: '',
    propostaValor: '',
  },
  icp: {
    caracteristicasDemograficas: '',
    dores: [],
    desejos: [],
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
  },
  financeiro: {
    despesasFixas: 0,
    despesasVariaveis: 0,
    faturamentoAtual: 0,
    margemAtual: 0,
    metaFaturamento: 0,
    oportunidades: [],
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
    focoTrimestre: '',
  },
};

const initialBlocks: BlockStatus[] = [
  { id: 'diagnostico', name: 'Diagnóstico de Maturidade', icon: '📊', completed: false, progress: 0 },
  { id: 'identidade', name: 'Visão, Missão e Valores', icon: '🎯', completed: false, progress: 0 },
  { id: 'concorrentes', name: 'Análise de Mercado', icon: '🔍', completed: false, progress: 0 },
  { id: 'icp', name: 'Definição de ICP', icon: '👤', completed: false, progress: 0 },
  { id: 'estrategiasValor', name: 'Estratégias de Valor', icon: '💎', completed: false, progress: 0 },
  { id: 'precificacao', name: 'Modelo de Precificação', icon: '💰', completed: false, progress: 0 },
  { id: 'motoresCrescimento', name: 'Motores de Crescimento', icon: '🚀', completed: false, progress: 0 },
  { id: 'organograma', name: 'Organograma', icon: '🏢', completed: false, progress: 0 },
  { id: 'processos', name: 'Processos Essenciais', icon: '⚙️', completed: false, progress: 0 },
  { id: 'financeiro', name: 'Análise Financeira', icon: '📈', completed: false, progress: 0 },
  { id: 'swot', name: 'SWOT e Horizontes', icon: '🧭', completed: false, progress: 0 },
  { id: 'goldenCircle', name: 'Golden Circle', icon: '⭕', completed: false, progress: 0 },
  { id: 'swotPessoal', name: 'SWOT Pessoal', icon: '🪞', completed: false, progress: 0 },
  { id: 'agendaCEO', name: 'Agenda Estratégica', icon: '📅', completed: false, progress: 0 },
];

interface ProjectData {
  project: Project;
  data: ConsultingData;
  blocks: BlockStatus[];
}

interface ConsultingContextType {
  data: ConsultingData;
  blocks: BlockStatus[];
  currentBlock: string;
  projects: Project[];
  currentProject: Project | null;
  setCurrentBlock: (id: string) => void;
  updateData: <K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => void;
  updateBlockProgress: (id: string, progress: number) => void;
  markBlockComplete: (id: string) => void;
  getTotalProgress: () => number;
  resetAll: () => void;
  createProject: (projectData: Omit<Project, 'id' | 'dataCriacao'>) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  goToProjectList: () => void;
}

const ConsultingContext = createContext<ConsultingContextType | undefined>(undefined);

export function ConsultingProvider({ children }: { children: React.ReactNode }) {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState('diagnostico');

  const currentProjectData = projectsData.find(p => p.project.id === currentProjectId);
  const data = currentProjectData?.data || initialData;
  const blocks = currentProjectData?.blocks || initialBlocks;
  const projects = projectsData.map(p => p.project);
  const currentProject = currentProjectData?.project || null;

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
    setCurrentBlock('diagnostico');
  }, []);

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'dataCriacao'>) => {
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
  }, []);

  const selectProject = useCallback((id: string) => {
    setCurrentProjectId(id);
    setCurrentBlock('diagnostico');
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjectsData(prev => prev.filter(pd => pd.project.id !== id));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
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
      setCurrentBlock,
      updateData,
      updateBlockProgress,
      markBlockComplete,
      getTotalProgress,
      resetAll,
      createProject,
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
