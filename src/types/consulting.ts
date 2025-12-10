export interface Project {
  id: string;
  nomeEmpresa: string;
  responsavel: string;
  segmento: string;
  faturamentoMedio: number;
  quantidadeColaboradores: number;
  emailResponsavel: string;
  dataCriacao: string;
}

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

export interface Concorrente {
  nome: string;
  tipo: string;
  pontosFortes: string;
  pontosFracos: string;
}

export interface ConcorrentesData {
  concorrentes: Array<{
    nome: string;
    pontoForte: string;
    pontoFraco: string;
  }>;
  principais: Concorrente[];
  diferenciais: string[];
  publicoAlvo: string;
  propostaValor: string;
}

export interface ICPData {
  caracteristicasDemograficas: string;
  descricao: string;
  segmentos: string[];
  dores: string[];
  dpisos: string[];
  desejos: string[];
  necessidades: string[];
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

export interface ProdutoServico {
  id: string;
  nome: string;
  precoAtual: number;
  descricao: string;
}

export interface PrecificacaoData {
  modelo: string;
  estrategia: string;
  ancoragem: string;
  margemDesejada: string;
  produtos: ProdutoServico[];
}

export interface MotoresCrescimentoData {
  motoresPrincipais: string[];
  canais: string[];
  metricas: Array<{
    nome: string;
    meta: string;
  }>;
}

export interface Cargo {
  titulo: string;
  nivel: 1 | 2 | 3;
  responsabilidades: string[];
  kpis: string[];
  subordinadoA: string;
}

export interface OrganogramaData {
  cargos: Cargo[];
}

export interface Processo {
  nome: string;
  descricao: string;
  responsavel: string;
  frequencia: string;
}

export interface ProcessosData {
  processos: Processo[];
  lista: Processo[];
}

export interface Investimento {
  area: string;
  valor: number;
  prazo: string;
  prioridade: 'Alta' | 'Media' | 'Baixa';
}

export interface FinanceiroData {
  despesasFixas: number;
  despesasVariaveis: number;
  faturamentoAtual: number;
  faturamentoMensal: number;
  margemAtual: number;
  margemLucro: number;
  custoFixoMensal: number;
  pontoEquilibrio: number;
  metaFaturamento: number;
  oportunidades: string[];
  investimentos: Investimento[];
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

export interface Prioridade {
  descricao: string;
  importancia: 'alta' | 'media' | 'baixa';
}

export interface Rotina {
  atividade: string;
  frequencia: string;
  dia: string;
}

export interface Delegacao {
  atividade: string;
  para: string;
}

export interface AgendaCEOData {
  prioridades: Prioridade[];
  alocacaoTempo: Array<{
    atividade: string;
    percentual: number;
  }>;
  rotinas: Rotina[];
  delegacoes: Delegacao[];
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
