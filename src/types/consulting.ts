export interface MaturityLevel {
  area: string;
  level: number;
  notes: string;
}

export interface DiagnosticoData {
  pessoas: MaturityLevel;
  processos: MaturityLevel;
  financas: MaturityLevel;
  mercado: MaturityLevel;
}

export interface IdentidadeData {
  visao: string;
  missao: string;
  valores: string[];
  posicionamento: string;
}

export interface ConcorrentesData {
  concorrentes: Array<{
    nome: string;
    pontoForte: string;
    pontoFraco: string;
  }>;
  diferenciais: string[];
  publicoAlvo: string;
  propostaValor: string;
}

export interface ICPData {
  caracteristicasDemograficas: string;
  dores: string[];
  desejos: string[];
  comportamento: string;
  ondeEncontrar: string;
}

export interface EstrategiasValorData {
  novasOfertas: string[];
  novosServicos: string[];
  pacotes: Array<{
    nome: string;
    descricao: string;
    preco: string;
  }>;
}

export interface PrecificacaoData {
  modelo: string;
  estrategia: string;
  ancoragem: string;
  margemDesejada: string;
}

export interface MotoresCrescimentoData {
  motorPrincipal: string;
  canais: string[];
  metricas: Array<{
    nome: string;
    meta: string;
  }>;
}

export interface OrganogramaData {
  cargos: Array<{
    titulo: string;
    responsabilidades: string[];
    subordinadoA: string;
  }>;
}

export interface ProcessosData {
  processos: Array<{
    nome: string;
    descricao: string;
    responsavel: string;
    frequencia: string;
  }>;
}

export interface FinanceiroData {
  despesasFixas: number;
  despesasVariaveis: number;
  faturamentoAtual: number;
  margemAtual: number;
  metaFaturamento: number;
  oportunidades: string[];
}

export interface SWOTData {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
  horizontes: {
    curto: string;
    medio: string;
    longo: string;
  };
}

export interface GoldenCircleData {
  why: string;
  how: string;
  what: string;
}

export interface SWOTPessoalData {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

export interface AgendaCEOData {
  prioridades: Array<{
    descricao: string;
    importancia: 'alta' | 'media' | 'baixa';
  }>;
  alocacaoTempo: Array<{
    atividade: string;
    percentual: number;
  }>;
  focoTrimestre: string;
}

export interface ConsultingData {
  clienteNome: string;
  consultorNome: string;
  dataInicio: string;
  diagnostico: DiagnosticoData;
  identidade: IdentidadeData;
  concorrentes: ConcorrentesData;
  icp: ICPData;
  estrategiasValor: EstrategiasValorData;
  precificacao: PrecificacaoData;
  motoresCrescimento: MotoresCrescimentoData;
  organograma: OrganogramaData;
  processos: ProcessosData;
  financeiro: FinanceiroData;
  swot: SWOTData;
  goldenCircle: GoldenCircleData;
  swotPessoal: SWOTPessoalData;
  agendaCEO: AgendaCEOData;
}

export interface BlockStatus {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  progress: number;
}
