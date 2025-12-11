import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConsultingData, BlockStatus, Project } from '@/types/consulting';
import { generateDemoData } from '@/utils/demoDataGenerator';
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
    setCurrentBlock('goldenCircle');
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

  const createDemoProject = useCallback((params: { segmento: string; faturamentoMedio: number; quantidadeColaboradores: number }) => {
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
  }, []);

  const selectProject = useCallback((id: string) => {
    setCurrentProjectId(id);
    setCurrentBlock('goldenCircle');
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
