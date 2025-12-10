import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConsultingData, BlockStatus } from '@/types/consulting';

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
    motorPrincipal: '',
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

interface ConsultingContextType {
  data: ConsultingData;
  blocks: BlockStatus[];
  currentBlock: string;
  setCurrentBlock: (id: string) => void;
  updateData: <K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => void;
  updateBlockProgress: (id: string, progress: number) => void;
  markBlockComplete: (id: string) => void;
  getTotalProgress: () => number;
  resetAll: () => void;
}

const ConsultingContext = createContext<ConsultingContextType | undefined>(undefined);

export function ConsultingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ConsultingData>(initialData);
  const [blocks, setBlocks] = useState<BlockStatus[]>(initialBlocks);
  const [currentBlock, setCurrentBlock] = useState('diagnostico');

  const updateData = useCallback(<K extends keyof ConsultingData>(key: K, value: ConsultingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateBlockProgress = useCallback((id: string, progress: number) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, progress: Math.min(100, Math.max(0, progress)) } : block
    ));
  }, []);

  const markBlockComplete = useCallback((id: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, completed: true, progress: 100 } : block
    ));
  }, []);

  const getTotalProgress = useCallback(() => {
    const total = blocks.reduce((acc, block) => acc + block.progress, 0);
    return Math.round(total / blocks.length);
  }, [blocks]);

  const resetAll = useCallback(() => {
    setData(initialData);
    setBlocks(initialBlocks);
    setCurrentBlock('diagnostico');
  }, []);

  return (
    <ConsultingContext.Provider value={{
      data,
      blocks,
      currentBlock,
      setCurrentBlock,
      updateData,
      updateBlockProgress,
      markBlockComplete,
      getTotalProgress,
      resetAll,
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
